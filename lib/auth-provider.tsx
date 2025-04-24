"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { usersApi } from "./api";
import type { User } from "./data";
import { useRouter } from "next/navigation";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWCDwZIcU8vBdsSx41C82tj37WJg86wWM",
  authDomain: "auth-2babd.firebaseapp.com",
  databaseURL: "https://auth-2babd-default-rtdb.firebaseio.com",
  projectId: "auth-2babd",
  storageBucket: "auth-2babd.appspot.com",
  messagingSenderId: "744312420718",
  appId: "1:744312420718:web:0debd0ef143ab52886297f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Firebase persistence set to LOCAL"))
  .catch((error) => console.error("Error setting persistence:", error));

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: "student" | "teacher" | "admin"
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const syncUserWithDatabase = async (firebaseUser: FirebaseUser) => {
    try {
      const userData = await usersApi.getByFirebaseId(firebaseUser.uid);
      setUser(userData);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        await createUserInDatabase(firebaseUser);
      } else {
        try {
          await createUserInDatabase(firebaseUser);
        } catch (createError) {
          console.error("Failed to create user after sync error:", createError);
        }
      }
    }
  };

  const createUserInDatabase = async (firebaseUser: FirebaseUser) => {
    try {
      const newUser = {
        firebaseId: firebaseUser.uid,
        name: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        role: "student" as const,
        createdAt: new Date().toISOString(),
      };
      const userData = await usersApi.create(newUser);
      setUser(userData);
    } catch (createError) {
      console.error("Error creating user in database:", createError);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        document.cookie = `firebaseId=${firebaseUser.uid}; path=/; max-age=3600; SameSite=Strict`;
        await syncUserWithDatabase(firebaseUser);
      } else {
        document.cookie = "firebaseId=; path=/; max-age=0";
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response.user) router.push("/");
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "student" | "teacher" | "admin" = "student"
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      const newUser = {
        firebaseId: userCredential.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      const userData = await usersApi.create(newUser);
      setUser(userData);
      router.push("/");
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      document.cookie = "firebaseId=; path=/; max-age=0";
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
