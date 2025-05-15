import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  /**
   * Handle User Signup
   */
  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;

      console.log("AuthForm.jsx: User signed up with UID:", userId);

      // Store user data in Firestore
      await setDoc(doc(db, "users", userId), {
        email: email,
        userId: userId,
        createdAt: serverTimestamp(),
      });

      setUser(userCred.user);
      setError("");
    } catch (err) {
      console.error("AuthForm.jsx: Signup error:", err);
      setError(err.message);
    }
  };

  /**
   * Handle User Login
   */
  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
      setError("");
    } catch (err) {
      console.error("AuthForm.jsx: Login error:", err);
      setError(err.message);
    }
  };

  /**
   * Handle User Logout
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("AuthForm.jsx: Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <div className="w-full max-w-md p-8 bg-white text-black rounded-xl shadow-lg">
        {user ? (
          <div className="text-center space-y-4">
            <p className="text-xl">Welcome, {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Login or Sign Up</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-between gap-4">
              <button
                onClick={handleLogin}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

