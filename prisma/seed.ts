import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  await db.comment.deleteMany();
  await db.post.deleteMany();
  await db.topic.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.verificationToken.deleteMany();
  await db.user.deleteMany();

  const user = await db.user.create({
    data: {
      id: "seed-user-thierry",
      name: "thierry",
      email: "thierry@example.com",
      image: "https://picsum.photos/200",
    },
  });

  const topic = await db.topic.create({
    data: {
      slug: "Javascript",
      description: "All things JavaScript and modern web development.",
    },
  });

  const post = await db.post.create({
    data: {
      title: "What do you think about next js",
      content: "I think Next is really usefull",
      userId: user.id,
      topicId: topic.id,
    },
  });

  await db.comment.createMany({
    data: [
      { content: "Great framework for full-stack apps.", postId: post.id, userId: user.id },
      { content: "Routing and server actions are very helpful.", postId: post.id, userId: user.id },
      { content: "The DX with App Router is improving a lot.", postId: post.id, userId: user.id },
      { content: "I like using it with Prisma and Postgres.", postId: post.id, userId: user.id },
      { content: "Build performance has been good in my projects.", postId: post.id, userId: user.id },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
