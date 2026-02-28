// src/data/store.js
// Central data — in a real app this would be a backend/database

export const USERS = [
  { _id: "1", name: "Alex Thompson",  email: "alex@school.uz",    password: "1234", role: "student", class: "8-B", avatar: "AT", color: "#22c55e" },
  { _id: "2", name: "Maria Garcia",   email: "maria@school.uz",   password: "1234", role: "student", class: "8-B", avatar: "MG", color: "#3b82f6" },
  { _id: "3", name: "James Wilson",   email: "james@school.uz",   password: "1234", role: "student", class: "8-B", avatar: "JW", color: "#f97316" },
  { _id: "4", name: "Sophie Chen",    email: "sophie@school.uz",  password: "1234", role: "student", class: "8-A", avatar: "SC", color: "#8b5cf6" },
  { _id: "5", name: "Luca Rossi",     email: "luca@school.uz",    password: "1234", role: "student", class: "8-A", avatar: "LR", color: "#ef4444" },
  { _id: "6", name: "Emma Brown",     email: "emma@school.uz",    password: "1234", role: "student", class: "8-A", avatar: "EB", color: "#eab308" },
  { _id: "7", name: "Ms. Johnson",    email: "teacher@school.uz", password: "admin", role: "teacher", avatar: "MJ", color: "#f97316" },
];

export const INITIAL_COINS = {
  "1": 1240, "2": 980, "3": 760, "4": 540, "5": 1100, "6": 850, "7": 0,
};

export const INITIAL_TRANSACTIONS = {
  "1": [
    { id: 1, label: "Math Homework",  type: "earn",  amount:  50,  date: "Today, 2:30 PM",  category: "homework" },
    { id: 2, label: "Weekly Reward",  type: "earn",  amount: 100, date: "Yesterday",        category: "reward"   },
    { id: 3, label: "Game Store",     type: "spend", amount: -250, date: "Oct 24, 2023",     category: "shop"     },
  ],
  "2": [
    { id: 1, label: "Science Project", type: "earn",  amount: 200, date: "Today, 10:00 AM", category: "homework" },
    { id: 2, label: "Late Homework",   type: "spend", amount:  -30, date: "Yesterday",        category: "behavior" },
  ],
  "3": [{ id: 1, label: "Good Behavior", type: "earn", amount: 50, date: "Today", category: "behavior" }],
  "4": [], "5": [], "6": [], "7": [],
};

export const INITIAL_SHOP_ITEMS = [
  { id: 1, name: "Pro Backpack",        cost: 1200, category: "School Supplies", emoji: "🎒", tag: "NEW", desc: "Premium quality backpack"          },
  { id: 2, name: "Lunch Express Pass",  cost: 450,  category: "Snacks",          emoji: "🍕", tag: null,  desc: "Skip the lunch line for a week"    },
  { id: 3, name: "Premium Journal",     cost: 300,  category: "School Supplies", emoji: "📓", tag: null,  desc: "Hardcover ruled notebook"           },
  { id: 4, name: "+5 Quiz Points",      cost: 500,  category: "Academic",        emoji: "⭐", tag: null,  desc: "Bonus points on next quiz"          },
  { id: 5, name: "Homework Pass",       cost: 800,  category: "Academic",        emoji: "📝", tag: "HOT", desc: "Skip one homework assignment"       },
  { id: 6, name: "Movie Day Ticket",    cost: 600,  category: "Fun",             emoji: "🎬", tag: null,  desc: "Join the class movie day"           },
  { id: 7, name: "Candy Bar",           cost: 100,  category: "Snacks",          emoji: "🍫", tag: null,  desc: "Choose your favorite candy"         },
  { id: 8, name: "Extra Recess",        cost: 350,  category: "Fun",             emoji: "⚽", tag: null,  desc: "15 extra minutes of recess"         },
];
