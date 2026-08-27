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

const avatar = (githubUserId: number) =>
  `https://avatars.githubusercontent.com/u/${githubUserId}?v=4`;

async function main() {
  const existingPosts = await db.post.count();
  const forceSeed = process.env.FORCE_SEED === "true" || process.argv.includes("--force");
  if (existingPosts > 0 && !forceSeed) {
    console.log(`Skipping seed: ${existingPosts} posts already exist.`);
    return;
  }

  await db.comment.deleteMany();
  await db.post.deleteMany();
  await db.topic.deleteMany();

  // Keep GitHub OAuth users so production logins survive a re-seed.
  await db.user.deleteMany({
    where: { accounts: { none: {} } },
  });

  const [thierry, ana, lucas, maria, joao] = await Promise.all([
    db.user.create({
      data: {
        id: "seed-user-thierry",
        name: "thierry",
        email: "thierry@example.com",
        image: avatar(33596726),
      },
    }),
    db.user.create({
      data: {
        name: "ana",
        email: "ana@example.com",
        image: avatar(2),
      },
    }),
    db.user.create({
      data: {
        name: "lucas",
        email: "lucas@example.com",
        image: avatar(3),
      },
    }),
    db.user.create({
      data: {
        name: "maria",
        email: "maria@example.com",
        image: avatar(4),
      },
    }),
    db.user.create({
      data: {
        name: "joao",
        email: "joao@example.com",
        image: avatar(5),
      },
    }),
  ]);

  // Create Javascript first so it stays the first chip for Cypress.
  const javascript = await db.topic.create({
    data: {
      slug: "Javascript",
      description: "All things JavaScript and modern web development.",
    },
  });

  const [react, prisma, vercel, typescript] = await Promise.all([
    db.topic.create({
      data: {
        slug: "react",
        description: "Component patterns, hooks, and UI discussions.",
      },
    }),
    db.topic.create({
      data: {
        slug: "prisma",
        description: "Schema design, migrations, and database access.",
      },
    }),
    db.topic.create({
      data: {
        slug: "vercel",
        description: "Deployments, serverless, and production debugging.",
      },
    }),
    db.topic.create({
      data: {
        slug: "typescript",
        description: "Types, inference, and safer JavaScript at scale.",
      },
    }),
  ]);

  const nextJsPost = await db.post.create({
    data: {
      title: "What do you think about next js",
      content: "I think Next is really usefull",
      userId: thierry.id,
      topicId: javascript.id,
    },
  });

  await db.comment.createMany({
    data: [
      { content: "Great framework for full-stack apps.", postId: nextJsPost.id, userId: thierry.id },
      { content: "Routing and server actions are very helpful.", postId: nextJsPost.id, userId: thierry.id },
      { content: "The DX with App Router is improving a lot.", postId: nextJsPost.id, userId: thierry.id },
      { content: "I like using it with Prisma and Postgres.", postId: nextJsPost.id, userId: thierry.id },
      { content: "Build performance has been good in my projects.", postId: nextJsPost.id, userId: thierry.id },
    ],
  });

  const serverActionsPost = await db.post.create({
    data: {
      title: "Server Actions vs API routes",
      content:
        "I have been mixing Server Actions with route handlers. When do you still keep a dedicated API?",
      userId: ana.id,
      topicId: javascript.id,
    },
  });

  const hooksPost = await db.post.create({
    data: {
      title: "How do you structure custom hooks?",
      content:
        "I am splitting data fetching and UI state into separate hooks. Curious what patterns people prefer.",
      userId: lucas.id,
      topicId: react.id,
    },
  });

  const suspensePost = await db.post.create({
    data: {
      title: "Suspense boundaries in real apps",
      content:
        "I wrapped lists in Suspense and the loading states feel much smoother. Any gotchas with nested boundaries?",
      userId: maria.id,
      topicId: react.id,
    },
  });

  const prismaPost = await db.post.create({
    data: {
      title: "Driver adapters in production",
      content:
        "Moving to Prisma driver adapters on serverless. What connection pooling setup has been stable for you?",
      userId: joao.id,
      topicId: prisma.id,
    },
  });

  const schemaPost = await db.post.create({
    data: {
      title: "Modeling replies in a comment thread",
      content:
        "I used a parentId on comments for nested replies. Is a closure table worth it for this kind of forum?",
      userId: ana.id,
      topicId: prisma.id,
    },
  });

  const deployPost = await db.post.create({
    data: {
      title: "OAuth callback fails only after GitHub authorizes",
      content:
        "The homepage loads, GitHub login starts, then the callback returns Configuration. Has anyone seen this on a preview deploy?",
      userId: lucas.id,
      topicId: vercel.id,
    },
  });

  const envPost = await db.post.create({
    data: {
      title: "Which env vars actually matter on Vercel?",
      content:
        "I copied local values and AUTH_URL pointed to localhost. Sharing a short checklist that finally unblocked me.",
      userId: maria.id,
      topicId: vercel.id,
    },
  });

  const typesPost = await db.post.create({
    data: {
      title: "Typing session.user.id without fighting the SDK",
      content:
        "I keep extending the Session type so user.id is available in server actions. Is module augmentation still the cleanest way?",
      userId: joao.id,
      topicId: typescript.id,
    },
  });

  const extraPosts = [
    serverActionsPost,
    hooksPost,
    suspensePost,
    prismaPost,
    schemaPost,
    deployPost,
    envPost,
    typesPost,
  ];

  const extraComments = [
    { post: serverActionsPost, user: lucas, content: "I keep route handlers for webhooks and external clients." },
    { post: serverActionsPost, user: maria, content: "Server Actions are great for forms, APIs still win for mobile." },
    { post: serverActionsPost, user: joao, content: "If you need a stable public contract, keep the route." },
    { post: hooksPost, user: ana, content: "I colocate hooks with the feature folder instead of a global hooks dir." },
    { post: hooksPost, user: maria, content: "One hook for query, another for local UI state has been enough." },
    { post: suspensePost, user: thierry, content: "Watch out for waterfalls when a child suspends on the same data." },
    { post: suspensePost, user: lucas, content: "A boundary per page section was the sweet spot for me." },
    { post: prismaPost, user: ana, content: "Pooled URL for the app, direct URL only for migrations." },
    { post: prismaPost, user: thierry, content: "And keep a singleton PrismaClient in serverless." },
    { post: schemaPost, user: joao, content: "parentId is plenty until you need subtree queries all the time." },
    { post: deployPost, user: ana, content: "Check the issuer GitHub sends in the callback. That bit me last week." },
    { post: deployPost, user: thierry, content: "Same here. The error looked like a generic Configuration failure." },
    { post: envPost, user: lucas, content: "Never copy AUTH_URL from local into Production." },
    { post: typesPost, user: maria, content: "Module augmentation on Session is still what I use." },
    { post: typesPost, user: ana, content: "I also set the id in the session callback so the client receives it." },
  ];

  await db.comment.createMany({
    data: extraComments.map((comment) => ({
      content: comment.content,
      postId: comment.post.id,
      userId: comment.user.id,
    })),
  });

  const deployRoot = await db.comment.create({
    data: {
      content: "Did the callback URL in the GitHub OAuth app match the Vercel domain?",
      postId: deployPost.id,
      userId: joao.id,
    },
  });

  await db.comment.create({
    data: {
      content: "Yes. The mismatch was the iss value, not the redirect URI.",
      postId: deployPost.id,
      userId: lucas.id,
      parentId: deployRoot.id,
    },
  });

  const hooksRoot = await db.comment.create({
    data: {
      content: "Do you test those hooks in isolation or only through the page?",
      postId: hooksPost.id,
      userId: joao.id,
    },
  });

  await db.comment.create({
    data: {
      content: "Both. A small unit test for the query hook, then one Cypress path.",
      postId: hooksPost.id,
      userId: lucas.id,
      parentId: hooksRoot.id,
    },
  });

  console.log(
    `Seeded ${extraPosts.length + 1} posts across 5 topics (OAuth users were kept).`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
