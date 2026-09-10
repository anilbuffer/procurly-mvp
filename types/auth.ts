export type UserRole = "admin" | "manager" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  organization: string;
  department: string;
  title: string;
  lastActive?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  availableUsers: User[];
  login: (userIdOrEmail: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
}
