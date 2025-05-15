export default function ExpenseList({ expenses }) {
  return (
    <div className="bg-[var(--bg-card)] p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Your Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-400">No expenses to display.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.TimeStamp}  // Use TimeStamp as the unique key
              className="bg-gray-800 p-2 rounded-lg flex justify-between"
            >
              <div>
                <span className="font-bold">{expense.category}</span> - ${expense.amount.toFixed(2)}
                <br />
                <span className="text-sm text-gray-400">{expense.date}</span>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(expense.TimeStamp).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}