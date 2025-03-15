export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    username: "demo",
    password: "password",
    email: "demo@example.com",
    displayName: "Demo User",
    avatarUrl: "https://via.placeholder.com/150",
  },
];

// Initial auth state
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Listeners for auth state changes
const listeners: ((state: AuthState) => void)[] = [];

// Update auth state and notify listeners
const updateAuthState = (newState: Partial<AuthState>) => {
  authState = { ...authState, ...newState };
  listeners.forEach((listener) => listener(authState));
};

// Subscribe to auth state changes
export const subscribeToAuth = (listener: (state: AuthState) => void) => {
  listeners.push(listener);
  listener(authState);

  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Get current auth state
export const getAuthState = (): AuthState => {
  return authState;
};

// Login function
export const login = async (
  username: string,
  password: string
): Promise<User> => {
  updateAuthState({ isLoading: true, error: null });

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = user;

    // Update auth state
    updateAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false,
    });

    // Store in localStorage
    localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  } catch (error) {
    updateAuthState({
      isLoading: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during login",
    });
    throw error;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  updateAuthState({ isLoading: true });

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update auth state
    updateAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Remove from localStorage
    localStorage.removeItem("auth_user");
  } catch (error) {
    updateAuthState({
      isLoading: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during logout",
    });
    throw error;
  }
};

// Check for existing session on app load
export const initAuth = (): void => {
  const storedUser = localStorage.getItem("auth_user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      updateAuthState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("auth_user");
    }
  }
};
