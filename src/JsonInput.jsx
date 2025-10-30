import { useState } from "react";

export default function JsonInput({ onVisualize }) {
  const [input, setInput] = useState(`{
  "products": [
    { "id": 1, "name": "Pen", "category": "stationery", "price": 10 },
    { "id": 2, "name": "Notebook", "category": "stationery", "price": 50 }
  ],
  "store": {
    "name": "MiniMart",
    "open": true
  }
}`);

  const processJson = () => {
    try {
      const parsed = JSON.parse(input);
      onVisualize(parsed);
    } catch {
      alert("Invalid JSON format");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-7 border border-gray-200 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Paste JSON</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"Example: { \"products\": [ { \"id\": 1, \"name\": \"Pen\" }, { \"id\": 2, \"name\": \"Notebook\" } ], \"store\": { \"name\": \"MiniMart\" } }"}
        className="w-full h-80 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base font-mono"
      />
      <button
        onClick={processJson}
        className="w-full bg-blue-500 text-white py-3 mt-5 text-lg rounded-lg hover:bg-blue-600 transition"
      >
        Visualize
      </button>
    </div>
  );
}
