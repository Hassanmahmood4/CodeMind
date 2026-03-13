const { getAuth } = require('@clerk/express');

/**
 * Development-only: when Clerk token is missing or invalid, set a placeholder userId
 * so Review Code and other protected routes work without fixing Clerk token config.
 * Never runs in production (NODE_ENV=production).
 */
function devAuthBypass(req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    return next();
  }
  try {
    const userId = getAuth(req).userId;
    if (userId) return next();
  } catch (e) {
    // getAuth threw (e.g. no token)
  }
  req.auth = { userId: 'dev-bypass-user' };
  next();
}

module.exports = { devAuthBypass };
