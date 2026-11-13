# StarDust Project Overview

StarDust is a web platform focused on teaching programming logic, using a gamified approach and a space metaphor to engage users. Inspired by the Duolingo model, the system guides students through an intergalactic journey where learning translates into exploratory progress.

## Modular Architecture

The system adopts a modular architecture with the goal of promoting organization, scalability and maintainability. The application is divided into independent units called **modules**, where each one encapsulates a specific domain logic.

Currently, StarDust is composed of **nine domain modules**, in addition to a cross-cutting module of shared resources.

## System Modules

### 1. Global (`global`)
Unlike the others, this module is not isolated. It centralizes interfaces, UI components, utilities and shared resources accessible across the whole system, working as the common foundation of the application.

### 2. Authentication (`auth`)
Manages security and access control. Responsible for:
- User authentication and authorization.
- Management of session tokens and permissions.
- Protection of routes and restricted resources.

### 3. Space Progress (`space`)
The "heart" of the user's journey. Manages the learning structure based on the space metaphor:
- **Planets**: Represent major programming logic topics (e.g., Variables, Loops).
- **Stars**: Represent subtopics or stages within each topic.
- **Locking System**: Ensures linear progression, where new stages are only unlocked after the previous ones are completed.

### 4. Lesson (`lesson`)
Manages the theoretical and interactive educational content within the stages.
- **Narrative**: Presents theoretical concepts through stories.
- **Quizzes**: Assesses learning with interactive questions.
- **Feedback**: Provides performance metrics (accuracy, time, XP) at the end of each lesson.

### 5. Challenge (`challenging`)
Focuses on deliberate programming practice.
- **Free Challenges**: Coding exercises independent of the main track.
- **Filters**: Allows searching for challenges by difficulty, topic or completion state.
- **Autonomy**: Allows the user to practice specific topics according to their needs.

### 6. Playground
An integrated free development environment (sandbox).
- Allows writing and running code without the restrictions of a specific challenge.
- Serves as a tool for experimentation and for reinforcing creativity.

### 7. Profile (`profile`)
Centralizes user information and long-term metrics.
- **Achievements**: Medal system to reward important milestones.
- **Streak**: Tracks daily study consistency (sequence of days).
- **Personal Data**: Management of account information.

### 8. Shop (`shop`)
Adds an extra layer of gamification through a virtual economy.
- **Coins (`starcoins`)**: Virtual currency earned by completing activities.
- **Cosmetic Items**: Purchase of avatars and rocket models for personalization.
- **Personalization**: Allows the user to express their visual identity on the platform.

### 9. Ranking (`ranking`)
Encourages healthy competition and continuous engagement.
- **Tier System (Divisions)**: Groups users into leagues based on weekly XP.
- **Promotion and Relegation**: Dynamic mechanism that moves users up or down a division at the end of each weekly cycle.
- **Rewards**: Prizes based on performance and on the prestige of the division.

### 10. Forum (`forum`)
Promotes the community and social learning.
- Space for questions, discussions about challenges and general interaction among students.

### 11. Manual (`manual`)
Manages the platform's documentation and guides system.
- **Guides (`Guide`)**: Creation and editing of manuals and tutorials.
- **Categorization**: Organization of guides into categories.
- **Content Management**: Features to create, edit and reorder guides.

### 12. Conversation (`conversation`)
Responsible for managing chat interactions, possibly focused on virtual assistants.
- **Chats**: Creation and management of conversation sessions.
- **Messages**: Sending and history of messages.
- **Actions**: Management of intents and actions within the chat.

### 13. Notification (`notification`)
Centralized service for communicating system events to users or administrators.
- **Progress Events**: Notifies when a user completes planets or the space (course).
- **Error Alerts**: Sends notifications about critical system errors (server or web).
