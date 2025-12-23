import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

const SESSION_KEY = "@user_session";
const USER_DATA_KEY = "@user_data";

export interface UserData {
  phone: string;
  userId: string;
  profile: any;
  timestamp: string;
}

export interface SessionData {
  token: string;
  userData: UserData;
}

/**
 * Save user session to AsyncStorage
 */
export const saveSession = async (
  sessionToken: string,
  userData: UserData
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SESSION_KEY, sessionToken);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

/**
 * Get current session from AsyncStorage
 */
export const getSession = async (): Promise<SessionData | null> => {
  try {
    const token = await AsyncStorage.getItem(SESSION_KEY);
    const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);

    if (!token || !userDataString) {
      return null;
    }

    const userData = JSON.parse(userDataString);
    return { token, userData };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

/**
 * Clear session from AsyncStorage
 */
export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
    throw error;
  }
};

/**
 * Validate session token with backend
 */
export const validateSession = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("validate-session", {
      body: { token },
    });

    if (error) {
      console.error("Session validation error:", error);
      return false;
    }

    return data?.valid === true;
  } catch (error) {
    console.error("Session validation exception:", error);
    return false;
  }
};

/**
 * Check if user has a valid session
 */
export const checkSession = async (): Promise<SessionData | null> => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Validate with backend
  const isValid = await validateSession(session.token);

  if (!isValid) {
    await clearSession();
    return null;
  }

  return session;
};

/**
 * Sign out user by clearing session
 */
export const signOut = async (): Promise<void> => {
  try {
    const session = await getSession();
    
    if (session) {
      // Optional: Call backend to invalidate token
      await supabase.functions.invoke("sign-out", {
        body: { token: session.token },
      });
    }

    await clearSession();
  } catch (error) {
    console.error("Error signing out:", error);
    // Clear session anyway
    await clearSession();
  }
};