import React, { useState } from "react";
import { getAuth } from "firebase/auth";

const ExpenseForm = ({ authToken }) => {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    const expenseData = {
      userId,
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      notes: form.notes,
      TimeStamp: Date.now(), // New TimeStamp for new entries
    };

    try {
      const response = await fetch(
        "https://w03nim31w6.execute-api.us-east-1.amazonaws.com/add-expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Expense added:", data);

      setForm({ amount: "", category: "", date: "", notes: "" });

    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Error submitting expense. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4 border rounded bg-gray-800">
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="p-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
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


  