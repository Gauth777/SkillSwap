SkillSwap

A karma-based skill exchange platform where people teach what they know and learn what they need — without money.

SkillSwap rewards completed contribution, not promises.

✨ Overview

SkillSwap is a frontend-first demo that explores a simple idea:

Teach → earn karma

Learn → spend karma

Karma updates only after a session is completed

No payments. No bidding. No inflated profiles.
Just a clear loop of exchange and accountability.

🔁 Core Flow

User posts what they can teach or want to learn

Another user responds

A swap is created

Session is completed

Karma updates and is recorded in a ledger

Reputation emerges from actions, not claims.

🧠 Key Design Decisions

Fixed karma rules
Karma is derived from session duration (e.g. 30 min = 2 karma) and cannot be manually set.

Ledger-based transparency
Every meaningful action leaves a visible trace.

Frontend-first demo
Focused on system clarity and flow instead of backend complexity.

🛠 Tech Stack

Next.js (App Router)

React

TypeScript

Tailwind CSS

NextAuth (Google OAuth)

React Context + localStorage (global state)

Vercel (deployment)

Backend services are planned for multi-user persistence and ledger integrity but were intentionally omitted for this demo.

🎯 Target Users

Students

Early professionals

Peer learners

Builders with limited money but valuable skills

🚧 Demo Notes

Authentication is restricted in demo mode.

The goal of this project is to demonstrate the skill exchange system and karma economy, not production infrastructure.

🚀 What’s Next

Backend for verified karma ledger

Persistent user profiles

Messaging between users

Community-based skill circles
