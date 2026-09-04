import bcrypt from "bcrypt";
import prisma from "../src/config/db";

// Demo seed for LinkUp. Safe to re-run: rooms and users are upserted by
// their unique fields, memberships use skipDuplicates, and messages are
// only inserted into rooms that have none yet.
//
// Demo logins (documented in README, never reuse these anywhere real):
//   aria / demo1234
//   marcus / demo1234

const DEMO_PASSWORD = "demo1234";

const DEMO_USERS = [
  {
    username: "aria",
    email: "aria@example.com",
    bios: "Frontend dev. Coffee first, standup second.",
  },
  {
    username: "marcus",
    email: "marcus@example.com",
    bios: "Into open source and long walks through documentation.",
  },
] as const;

const DEMO_ROOMS = [
  {
    name: "General",
    description: "The living room of LinkUp — say hi, share what you're working on.",
  },
  {
    name: "Introductions",
    description: "New here? Tell everyone who you are.",
  },
] as const;

// Minutes before "now" each seeded message appears to have been sent.
const GENERAL_THREAD: { username: string; content: string; minutesAgo: number }[] = [
  {
    username: "aria",
    content: "Welcome to General! This is the living room of LinkUp — say hi and make yourself at home.",
    minutesAgo: 180,
  },
  {
    username: "marcus",
    content: "Hey everyone, Marcus here. I mostly hang out in here and Introductions.",
    minutesAgo: 150,
  },
  {
    username: "aria",
    content: "Quick tip: check the People tab to find folks, and open your Profile to set an avatar and bio.",
    minutesAgo: 120,
  },
  {
    username: "marcus",
    content: "And if you want to chat 1:1, open someone's profile and hit them with a DM.",
    minutesAgo: 90,
  },
];

const INTROS_THREAD: { username: string; content: string; minutesAgo: number }[] = [
  {
    username: "marcus",
    content: "I'll start: I'm Marcus, I break builds so you don't have to. Your turn!",
    minutesAgo: 60,
  },
  {
    username: "aria",
    content: "Aria, frontend dev. I collect side projects and finish… some of them.",
    minutesAgo: 30,
  },
];

async function seedMessages(
  roomName: string,
  thread: typeof GENERAL_THREAD,
  userIds: Map<string, string>,
  roomIds: Map<string, string>,
) {
  const roomId = roomIds.get(roomName)!;
  const existing = await prisma.message.count({ where: { roomId } });
  if (existing > 0) {
    console.log(`  ↷ "${roomName}" already has messages, skipping`);
    return;
  }

  for (const msg of thread) {
    await prisma.message.create({
      data: {
        content: msg.content,
        userId: userIds.get(msg.username)!,
        roomId,
        createdAt: new Date(Date.now() - msg.minutesAgo * 60_000),
      },
    });
  }
  console.log(`  ✓ seeded ${thread.length} messages in "${roomName}"`);
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const userIds = new Map<string, string>();
  for (const u of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        email: u.email,
        password: passwordHash,
        bios: u.bios,
      },
    });
    userIds.set(u.username, user.id);
  }
  console.log(`✓ upserted ${userIds.size} demo users`);

  const roomIds = new Map<string, string>();
  for (const r of DEMO_ROOMS) {
    const room = await prisma.room.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, description: r.description },
    });
    roomIds.set(r.name, room.id);
  }
  console.log(`✓ upserted ${roomIds.size} demo rooms`);

  await prisma.roomMember.createMany({
    data: [...userIds.values()].flatMap((userId) =>
      [...roomIds.values()].map((roomId) => ({ userId, roomId })),
    ),
    skipDuplicates: true,
  });
  console.log("✓ demo users are members of demo rooms");

  await seedMessages("General", GENERAL_THREAD, userIds, roomIds);
  await seedMessages("Introductions", INTROS_THREAD, userIds, roomIds);

  console.log("Done. Demo logins: aria / demo1234, marcus / demo1234");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
