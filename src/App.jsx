import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { dynamoDb } from "./aws";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import "./App.css";
import "./index.css";

import AuthForm from "./components/AuthForm";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [error, setError] = useState("");

  /**
   * Monitor Firebase Auth State
   */
  useEffect(() => {
    console.log("Checking Firebase auth state...");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Fetch Expenses from DynamoDB
   */
  const fetchExpenses = async (userId) => {
    console.log("Fetching expenses for user:", userId);

    const params = {
      TableName: "Expenses",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    try {
      const data = await dynamoDb.send(new QueryCommand(params));
      console.log("Fetched expenses:", data.Items);
      setExpenses(data.Items);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to fetch expenses.");
    }
  };

  /**
   * Fetch Expenses After Login
   */
  useEffect(() => {
    if (user) {
      fetchExpenses(user.uid);
    }
  }, [user]);

  /**
   * Add New Expense
   */
  const handleAddExpense = (newExpense) => {
    console.log("Adding new expense to state:", newExpense);
    setExpenses([newExpense, ...expenses]);
  };

  /**
   * Handle Logout
   */
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await auth.signOut();
      setUser(null);
      setExpenses([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /**
   * Render Loading Screen
   */
  if (!isLoaded || !loadingComplete) {
    console.log("Rendering LoadingScreen...");
    return <LoadingScreen onComplete={() => setLoadingComplete(true)} />;
  }

  /**
   * Main Application Content
   */
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center">
      {user ? (
        <div className="max-w-lg w-full space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Welcome, {user.email}</h2>
            <button onClick={handleLogout} className="button-danger">
              Logout
            </button>
          </div>

          <ExpenseForm onAdd={handleAddExpense} />
          <ExpenseList expenses={expenses} />
        </div>
      ) : (
        <AuthForm onLogin={setUser} />
      )}
    </div>
  );
}

export default App;



