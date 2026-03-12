/**
 * Repository code review is performed by the Gemini API.
 * Clerk is not used here; it is only for authentication in the route that calls this service.
 */
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const os = require('os');
const { generateAIResponse } = require('../config/gemini');

const ALLOWED_EXT = ['.js', '.ts', '.py', '.java', '.cpp', '.go'];
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.git', 'vendor', '__pycache__', '.next', 'coverage']);
const MAX_FILES = 20;
const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500KB
const CLONE_TIMEOUT_MS = 60 * 1000;
const ANALYSIS_TIMEOUT_MS = 90 * 1000;

function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), ms)),
  ]);
}

function isLikelyBinary(buffer) {
  if (!buffer || buffer.length === 0) return true;
  const slice = buffer.slice(0, 512);
  for (let i = 0; i < slice.length; i++) {
    if (slice[i] === 0) return true;
  }
  return false;
}

function getAllCodeFiles(dir, baseDir = dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      results.push(...getAllCodeFiles(fullPath, baseDir));
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) continue;

    try {
      const stat = fs.statSync(fullPath);
      if (stat.size > MAX_FILE_SIZE_BYTES || stat.size === 0) continue;
      const buffer = fs.readFileSync(fullPath);
      if (isLikelyBinary(buffer)) continue;
      const content = buffer.toString('utf8');
      if (!content || !content.trim()) continue;
      results.push({ relativePath, content, size: stat.size });
    } catch {
      // skip unreadable files
    }
  }

  return results;
}

function pickFiles(files) {
  const sorted = [...files].sort((a, b) => {
    const aScore = a.relativePath.split(path.sep).length;
    const bScore = b.relativePath.split(path.sep).length;
    if (aScore !== bScore) return aScore - bScore;
    return a.relativePath.localeCompare(b.relativePath);
  });
  return sorted.slice(0, MAX_FILES);
}

function parseRepoUrl(repoUrl) {
  const trimmed = (repoUrl || '').trim();
  const match = trimmed.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, ''), repoName: `${match[1]}/${match[2].replace(/\.git$/, '')}` };
}

function buildAnalysisPrompt(files) {
  const fileBlocks = files
    .map((f) => `### ${f.relativePath}\n\`\`\`\n${f.content.slice(0, 15000)}\n\`\`\``)
    .join('\n\n');

  return `You are a senior code reviewer. Analyze the following code files from a repository for bugs, performance issues, security issues, and improvements.

Return your analysis as a JSON array. Each item must have:
- "file": string (file path)
- "type": one of "bug", "suggestion", "best-practice"
- "issue": string (short description of the problem)
- "suggestedFix": string (concrete fix or recommendation)

If there are no findings for a file, you may omit it. Keep each finding concise. Return only the JSON array, no markdown or extra text.

Files to analyze:

${fileBlocks}`;
}

function parseSuggestionsFromResponse(text) {
  try {
    const trimmed = text.trim();
    const jsonStr = trimmed.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.file === 'string' && typeof x.issue === 'string')
      .map((x) => ({
        file: x.file,
        type: ['bug', 'suggestion', 'best-practice'].includes(x.type) ? x.type : 'suggestion',
        issue: x.issue,
        suggestedFix: typeof x.suggestedFix === 'string' ? x.suggestedFix : '',
      }));
  } catch {
    return [];
  }
}

/**
 * Clone repo, extract code files, run Gemini analysis.
 * @param {string} repoUrl - GitHub repo URL
 * @returns {Promise<{ repoName: string, filesAnalyzed: string[], suggestions: Array<{ file, type, issue, suggestedFix }> }>}
 */
async function reviewRepository(repoUrl) {
  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) {
    throw new Error('Invalid GitHub repository URL');
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codemind-repo-'));
  let git;

  try {
    git = simpleGit({ baseDir: tempDir });
    await timeout(git.clone(repoUrl, tempDir, ['--depth', '1']), CLONE_TIMEOUT_MS);
  } catch (err) {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
    if (err.message === 'Operation timed out') {
      throw new Error('Repository clone timed out. Try a smaller repository.');
    }
    throw new Error('Failed to clone repository. Check the URL and try again.');
  }

  try {
    const allFiles = getAllCodeFiles(tempDir);
    const selected = pickFiles(allFiles);
    const filesAnalyzed = selected.map((f) => f.relativePath);

    if (selected.length === 0) {
      return { repoName: repoInfo.repoName, filesAnalyzed: [], suggestions: [] };
    }

    const prompt = buildAnalysisPrompt(selected);
    const rawResponse = await timeout(generateAIResponse(prompt), ANALYSIS_TIMEOUT_MS);
    const suggestions = parseSuggestionsFromResponse(rawResponse);

    return {
      repoName: repoInfo.repoName,
      filesAnalyzed,
      suggestions: suggestions.length > 0 ? suggestions : [{ file: '(summary)', type: 'suggestion', issue: 'Review completed.', suggestedFix: rawResponse }],
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

module.exports = { reviewRepository, parseRepoUrl };
