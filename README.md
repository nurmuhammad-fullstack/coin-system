# 🪙 CoinEd — Student Reward Coin Platform

A full-stack-ready React + Tailwind CSS coin reward system for teachers and students.

## 🏗️ Project Structure

```
src/
├── App.jsx                          # Root routing
├── index.js                         # Entry point
├── index.css                        # Tailwind + Google Fonts
│
├── context/
│   └── AppContext.jsx               # Global state (auth, coins, transactions, shop)
│
├── data/
│   └── store.js                     # Mock data (users, coins, transactions, shop items)
│
├── components/
│   ├── ui.jsx                       # Shared UI components (Toast, Card, Modal, Avatar, etc.)
│   └── ProtectedRoute.jsx           # Auth guards for student/teacher routes
│
└── pages/
    ├── LoginPage.jsx                # /  — Auth page (student & teacher login)
    │
    ├── student/
    │   ├── StudentLayout.jsx        # /student — Shell with bottom nav
    │   ├── StudentHomePage.jsx      # /student/home    — Dashboard + balance card
    │   ├── StudentWalletPage.jsx    # /student/wallet  — Transactions + balance
    │   ├── StudentRewardsPage.jsx   # /student/rewards — Shop with buy modal
    │   └── StudentProfilePage.jsx   # /student/profile — Profile + settings
    │
    └── teacher/
        ├── TeacherLayout.jsx        # /teacher — Shell with bottom nav
        ├── TeacherStudentsPage.jsx  # /teacher/students — Leaderboard list
        ├── TeacherStudentDetailPage.jsx # /teacher/students/:id — Manage student coins
        ├── TeacherShopPage.jsx      # /teacher/shop    — Add/remove shop items
        └── TeacherProfilePage.jsx   # /teacher/profile — Teacher profile
```

## 🚀 Getting Started

```bash
npm install
npm start
```

## 🔑 Demo Credentials

| Role    | Email                  | Password |
|---------|------------------------|----------|
| Student | alex@school.uz         | 1234     |
| Teacher | teacher@school.uz      | admin    |

## ✨ Features

### Student
- 🏠 **Home** — Balance card, quick navigation, recent transactions
- 💳 **Wallet** — Full transaction history with earn/spent filter
- 🎁 **Rewards Shop** — Browse by category, buy items with coins, modal confirmation
- 👤 **Profile** — Stats, achievements, settings, logout

### Teacher
- 👥 **Students** — Ranked leaderboard, filter by class
- 📋 **Student Detail** — View balance, add/remove coins with reason, quick-action buttons, transaction history
- 🏪 **Shop Management** — Add new items (emoji, cost, category), remove items
- 👨‍🏫 **Profile** — Stats overview, settings, logout

## 🛠️ Tech Stack

- **React 18** + React Router v6
- **Tailwind CSS** with custom config
- **Context API** for global state
- **Nunito + Poppins** fonts (Google Fonts)

## 📱 Design

Mobile-first phone frame UI matching the provided design mockup:
- Green brand color (`#22c55e`) for student actions
- Blue for teacher actions
- Smooth animations (slide-up, fade-in, bounce-in)
- Consistent card-based layout with rounded-2xl corners
