import { User } from "@/types/auth";

export const MOCK_USERS: User[] = [
  {
    id: "user-customer-01",
    name: "James Wilson",
    email: "james.wilson@spmotors.co.nz",
    role: "viewer",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    organization: "SP Motors Ltd",
    department: "Service & Workshop",
    title: "Service Manager (Customer)",
    lastActive: "Just now",
  },
  {
    id: "user-admin-01",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@procurly.io",
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    organization: "Autohub Procurement Desk",
    department: "Strategic Sourcing",
    title: "Senior Sourcing Specialist (Procurement)",
    lastActive: "Just now",
  },
  {
    id: "user-mgr-02",
    name: "David Vance",
    email: "david.vance@procurly.io",
    role: "manager",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    organization: "Acme Global Enterprise",
    department: "Strategic Sourcing",
    title: "Senior Sourcing Manager",
    lastActive: "15m ago",
  },
  {
    id: "user-viewer-03",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@procurly.io",
    role: "viewer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    organization: "Acme Global Enterprise",
    department: "Operations & Supply Chain",
    title: "Procurement Analyst",
    lastActive: "1h ago",
  },
];

export const DEFAULT_MOCK_USER = MOCK_USERS[0];
