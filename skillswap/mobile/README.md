# SkillSwap Mobile App

SkillSwap is a mobile application that facilitates decentralized peer-to-peer mentoring. Users trade skills using a virtual credit system called **Karma**.

## What the App Does

- **Onboarding & Profile Setup:** Users register by selecting skills they can teach and skills they want to learn.
- **Skill Feed:** Browse and search peer requests to teach or learn skills.
- **Skill Matching:** Automatically matches users based on complementary teaching and learning profiles.
- **My Swaps & Session Tracking:** Request, accept, and track swap sessions (pending, accepted, completed).
- **Karma Wallet:** A virtual wallet displaying transactions (e.g., welcome bonuses, karma spent on learning, karma earned from mentoring).
- **AI Chat Assistant:** A smart chat helper that recommends mentorship swaps and lists in-demand skills.

## Tech Stack

- **Framework:** Expo (React Native)
- **Routing:** Expo Router (file-based navigation)
- **State Management:** Zustand
- **Styling:** React Native Stylesheet & custom CSS utility variables
- **Haptics & Icons:** Expo Haptics, Ionicons
- **Type Checking:** TypeScript

## Run Commands

First, ensure you are in the `mobile` directory:
```bash
cd mobile
```

Install the dependencies:
```bash
npm install
```

Start the application:
```bash
npx expo start
```

Run on specific platforms:
- **Web:** Press `w` or run `npm run web`
- **Android:** Press `a` or run `npm run android` (requires Android Emulator or device)
- **iOS:** Press `i` or run `npm run ios` (requires macOS and iOS Simulator)

## Demo Flow

1. **Onboarding:** Input profile details, select what you can teach (e.g., Python, JavaScript) and learn (e.g., Machine Learning basics, UI Design) to receive a welcome bonus of 8 Karma.
2. **Explore Feed:** View public swap listings. Request a teaching session (costs Karma) or a learning session.
3. **Check Matches:** Browse users who want to learn what you teach, or vice versa, to initiate swaps.
4. **Schedule Swaps:** View active, accepted, and completed sessions under the **My Swaps** tab.
5. **Manage Karma:** Track transaction logs and your balance in the **Karma Wallet** tab.
6. **AI Swap Assistant:** Open the AI Chat Assistant from the feed header to get matching recommendations.

---

*Note: Future integrations plan to connect this frontend to a Neo4j graph database for advanced recommendation queries and Sarvam AI APIs for smart assistant chat context.*
