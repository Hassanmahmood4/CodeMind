const { createClerkClient } = require('@clerk/backend');
const { getPrisma } = require('../config/prisma');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function pickPrimaryEmail(user) {
  const list = user?.emailAddresses || [];
  const primary = list.find((e) => e.id === user?.primaryEmailAddressId);
  return primary?.emailAddress || list[0]?.emailAddress || null;
}

async function ensureUserFromClerkId(clerkId) {
  const prisma = getPrisma();

  // Dev-only bypass user (no Clerk user exists)
  if (!clerkId || clerkId === 'dev-bypass-user') {
    return prisma.user.upsert({
      where: { clerkId: clerkId || 'dev-bypass-user' },
      create: { clerkId: clerkId || 'dev-bypass-user' },
      update: {},
    });
  }

  let clerkUser = null;
  try {
    clerkUser = await clerk.users.getUser(clerkId);
  } catch (e) {
    // If Clerk is temporarily unreachable, still ensure we have *some* row.
    return prisma.user.upsert({
      where: { clerkId },
      create: { clerkId },
      update: {},
    });
  }

  const email = pickPrimaryEmail(clerkUser);
  const username = clerkUser.username || null;
  const firstName = clerkUser.firstName || null;
  const lastName = clerkUser.lastName || null;
  const imageUrl = clerkUser.imageUrl || null;

  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email, username, firstName, lastName, imageUrl },
    update: { email, username, firstName, lastName, imageUrl },
  });
}

module.exports = { ensureUserFromClerkId };

