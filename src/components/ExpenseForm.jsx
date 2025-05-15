import React, { useState } from "react";
import { getAuth } from "firebase/auth";

const ExpenseForm = ({ authToken }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User is not authenticated.");
      alert("You must be logged in to add an expense.");
      return;
    }

    const expenseData = {
      userId,
      amount: parseFloat(amount),
      category,
      date,
      notes,
    };

    try {
      const response = await fetch(
        '${import.meta.env.VITE_API_URL}',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify(expenseData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Expense added:", data);

      setAmount("");
      setCategory("");
      setDate("");
      setNotes("");
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Error submitting expense. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4 border rounded bg-gray-800">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
