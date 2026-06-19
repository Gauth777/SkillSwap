import { getDriver, runQuery } from '../db/neo4j';
import { SKILLS_LIST } from '../routes/users';

const DEMO_USERS = [
  {
    id: 'u_aarav',
    name: 'Aarav',
    handle: 'aarav',
    bio: 'Practical Python mentor. I keep sessions tight and beginner-friendly.',
    skillsToTeach: ['sk_py', 'sk_js'],
    skillsToLearn: ['sk_ml', 'sk_ui'],
    karmaBalance: 12,
  },
  {
    id: 'u_isha',
    name: 'Isha',
    handle: 'isha',
    bio: 'Math + DSA learner. I show up prepared and ask precise questions.',
    skillsToTeach: ['sk_math'],
    skillsToLearn: ['sk_dsa', 'sk_py'],
    karmaBalance: 5,
  },
  {
    id: 'u_neel',
    name: 'Neel',
    handle: 'neel',
    bio: 'Design systems & sharp UI reviews. Minimal, usable, modern.',
    skillsToTeach: ['sk_ui', 'sk_figma'],
    skillsToLearn: ['sk_react', 'sk_js'],
    karmaBalance: 9,
  },
  {
    id: 'u_meera',
    name: 'Meera',
    handle: 'meera',
    bio: 'Clear communication, structured feedback. I help people present better.',
    skillsToTeach: ['sk_comm', 'sk_resume'],
    skillsToLearn: ['sk_py', 'sk_figma'],
    karmaBalance: 7,
  },
  {
    id: 'u_rohan',
    name: 'Rohan',
    handle: 'rohan',
    bio: 'Interview-focused DSA sessions. Clean mental models, no fluff.',
    skillsToTeach: ['sk_dsa', 'sk_js'],
    skillsToLearn: ['sk_ml', 'sk_comm'],
    karmaBalance: 14,
  },
  {
    id: 'u_ananya',
    name: 'Ananya',
    handle: 'ananya',
    bio: 'Brand + logo fundamentals. I help you see balance and meaning.',
    skillsToTeach: ['sk_figma', 'sk_ui'],
    skillsToLearn: ['sk_react', 'sk_resume'],
    karmaBalance: 6,
  },
  {
    id: 'u_priya',
    name: 'Priya',
    handle: 'priya',
    bio: 'ML enthusiast. Breaking down complex concepts into simple steps.',
    skillsToTeach: ['sk_ml', 'sk_py'],
    skillsToLearn: ['sk_ui', 'sk_comm'],
    karmaBalance: 10,
  },
  {
    id: 'u_vikram',
    name: 'Vikram',
    handle: 'vikram',
    bio: 'Full-stack React dev. I teach by building real projects together.',
    skillsToTeach: ['sk_react', 'sk_js'],
    skillsToLearn: ['sk_dsa', 'sk_ml'],
    karmaBalance: 11,
  },
];

const DEMO_POSTS = [
  {
    id: 'post_1',
    authorId: 'u_aarav',
    type: 'teach',
    title: 'Python crash course for beginners',
    description: 'Covering variables, loops, functions, and basic OOP. Perfect for someone just starting out.',
    skillName: 'Python',
    category: 'Programming',
    duration: 45,
    karma: 3,
  },
  {
    id: 'post_2',
    authorId: 'u_isha',
    type: 'learn',
    title: 'Need help with tree and graph problems',
    description: 'Preparing for interviews. I need clarity on BFS, DFS, and common tree patterns.',
    skillName: 'DSA',
    category: 'Data Structures',
    duration: 60,
    karma: -4,
  },
  {
    id: 'post_3',
    authorId: 'u_neel',
    type: 'teach',
    title: 'UI Design review session',
    description: 'Bring your Figma file — I will review layout, spacing, type hierarchy, and color usage.',
    skillName: 'UI Design',
    category: 'Design',
    duration: 30,
    karma: 2,
  },
  {
    id: 'post_4',
    authorId: 'u_priya',
    type: 'teach',
    title: 'ML basics: regression & classification',
    description: 'Hands-on session using sklearn. We will build a simple model from scratch.',
    skillName: 'Machine Learning basics',
    category: 'Machine Learning',
    duration: 60,
    karma: 4,
  },
  {
    id: 'post_5',
    authorId: 'u_vikram',
    type: 'teach',
    title: 'React hooks deep dive',
    description: 'useState, useEffect, useRef, custom hooks — with real examples and pitfalls to avoid.',
    skillName: 'React',
    category: 'Programming',
    duration: 45,
    karma: 3,
  },
  {
    id: 'post_6',
    authorId: 'u_meera',
    type: 'teach',
    title: 'Resume and LinkedIn review',
    description: 'Structured feedback on your resume. I focus on clarity, impact statements, and formatting.',
    skillName: 'Resume review',
    category: 'Career',
    duration: 30,
    karma: 2,
  },
  {
    id: 'post_7',
    authorId: 'u_rohan',
    type: 'learn',
    title: 'Want to understand neural networks',
    description: 'I know DSA well but ML is new. Looking for someone to explain backpropagation simply.',
    skillName: 'Machine Learning basics',
    category: 'Machine Learning',
    duration: 45,
    karma: -3,
  },
  {
    id: 'post_8',
    authorId: 'u_ananya',
    type: 'learn',
    title: 'Getting started with React Native',
    description: 'I know HTML/CSS and Figma. Want to learn how to turn my designs into a real mobile app.',
    skillName: 'React',
    category: 'Programming',
    duration: 60,
    karma: -4,
  },
];

async function seed() {
  console.log('--- Starting Database Seeding ---');

  // Verify driver is ready
  const driver = getDriver();
  if (!driver) {
    console.error('Cannot connect to Neo4j. Skipping seed. Check your .env file credentials.');
    process.exit(1);
  }

  try {
    // 1. Clear database
    console.log('Clearing existing graph data...');
    await runQuery('MATCH (n) DETACH DELETE n');

    // 2. Create Skill nodes
    console.log('Creating Skill nodes...');
    for (const skill of SKILLS_LIST) {
      await runQuery(
        `
        CREATE (s:Skill {id: $id, name: $name, category: $category})
        `,
        skill
      );
    }

    // 3. Create User nodes and link skills
    console.log('Creating User nodes...');
    for (const user of DEMO_USERS) {
      await runQuery(
        `
        CREATE (u:User {
          id: $id,
          name: $name,
          handle: $handle,
          bio: $bio,
          karmaBalance: $karmaBalance,
          joinedAt: toString(datetime())
        })
        `,
        { id: user.id, name: user.name, handle: user.handle, bio: user.bio, karmaBalance: user.karmaBalance }
      );

      // Link teach skills
      for (const skillId of user.skillsToTeach) {
        await runQuery(
          `
          MATCH (u:User {id: $userId})
          MATCH (s:Skill {id: $skillId})
          CREATE (u)-[:CAN_TEACH]->(s)
          `,
          { userId: user.id, skillId }
        );
      }

      // Link learn skills
      for (const skillId of user.skillsToLearn) {
        await runQuery(
          `
          MATCH (u:User {id: $userId})
          MATCH (s:Skill {id: $skillId})
          CREATE (u)-[:WANTS_TO_LEARN]->(s)
          `,
          { userId: user.id, skillId }
        );
      }
      
      // Create initial welcome bonus transaction
      await runQuery(
        `
        MATCH (u:User {id: $userId})
        CREATE (t:KarmaTransaction {
          id: $txId,
          delta: 7,
          type: 'welcome_bonus',
          note: 'Welcome to SkillSwap! Here is your starter karma.',
          createdAt: toString(datetime())
        })
        CREATE (u)-[:EARNED]->(t)
        `,
        { userId: user.id, txId: `tx_welcome_${user.id}` }
      );
    }

    // 4. Create SwapPost nodes and link to user + skill
    console.log('Creating SwapPost nodes...');
    for (const post of DEMO_POSTS) {
      await runQuery(
        `
        MATCH (u:User {id: $authorId})
        CREATE (p:SwapPost {
          id: $id,
          type: $type,
          title: $title,
          description: $description,
          skillName: $skillName,
          category: $category,
          duration: $duration,
          karma: $karma,
          status: 'open',
          createdAt: toString(datetime())
        })
        CREATE (u)-[:CREATED]->(p)
        `,
        {
          id: post.id,
          authorId: post.authorId,
          type: post.type,
          title: post.title,
          description: post.description,
          skillName: post.skillName,
          category: post.category,
          duration: post.duration,
          karma: post.karma,
        }
      );

      // Find normalized skill node
      const skillName = post.skillName;
      const matchingSkill = SKILLS_LIST.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
      const skillId = matchingSkill ? matchingSkill.id : 'sk_js';

      const rel = post.type === 'teach' ? 'OFFERS' : 'SEEKS';
      await runQuery(
        `
        MATCH (p:SwapPost {id: $postId})
        MATCH (s:Skill {id: $skillId})
        CREATE (p)-[:${rel}]->(s)
        `,
        { postId: post.id, skillId }
      );
    }

    console.log('--- Database Seeding Complete! ---');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    const d = getDriver();
    if (d) await d.close();
  }
}

seed();
