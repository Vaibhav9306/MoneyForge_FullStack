export type Layer = "dashboard" | "idea" | "execution" | "finance" | "growth" | "wealth" | "profile" | "budget" | "tools" | "landing";

export interface SaaSMetric {
  month: string;
  mrr: number;
  totalCustomers: number;
  newCustomers: number;
  smSpend: number;
  churnedCustomers: number;
}

export type BudgetCategory = "Marketing" | "Sales" | "R&D" | "G&A" | "Support";

export interface BudgetRecord {
  category: BudgetCategory;
  planned: number;
  actual: number;
  history: number[]; // Last 3 months actuals for forecasting
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
}

export interface Idea {
  title: string;
  description: string;
  marketValidation: string;
  riskAnalysis: string;
}

export interface RoadmapItem {
  day: number;
  task: string;
  completed: boolean;
}

export type TransactionCategory = "marketing" | "salary" | "tools" | "sales" | "other";

export interface FinanceRecord {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: "income" | "expense";
  description: string;
  status?: "completed" | "refunded" | "cancelled";
}

export interface PaymentLink {
  id: string;
  amount: number;
  description: string;
  purpose: string;
  url: string;
  createdAt: string;
  status: "active" | "deactivated";
}

export interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  items: { description: string; quantity: number; price: number }[];
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  activeSubscribers: number;
  createdAt: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: "pending" | "settled";
  bankAccount: string;
  createdAt: string;
}

export interface Campaign {
  name: string;
  platform: string;
  content: string;
  status: "draft" | "active" | "completed";
}

export interface LandingPageContent {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  benefits: {
    title: string;
    description: string;
  }[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
  }[];
  pricing: {
    plan: string;
    price: string;
    features: string[];
  }[];
  footer: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
}
