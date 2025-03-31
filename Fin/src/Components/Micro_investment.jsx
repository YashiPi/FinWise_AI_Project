import React, { useState, useEffect } from "react";
import axios from "axios";
import VoiceAssistant from "./Voice_assistance";

const Micro_investment = () => {
  // Hardcoded userId for demonstration; replace with your auth logic
  const userId = "67e96c0be6c7599def34e657";

  // Local state for category-based savings (these entries are fetched/saved via backend)
  const [savingsData, setSavingsData] = useState({
    medical: [],
    home: [],
    investment: [],
    emergency: [],
    others: [],
  });

  // For adding a new savings entry
  const [selectedCategory, setSelectedCategory] = useState("medical");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Total savings fetched from Budget backend
  const [backendTotalSavings, setBackendTotalSavings] = useState(0);

  // Category definitions
  const categories = [
    { value: "medical", label: "Medical", color: "bg-blue-500", icon: "💊" },
    { value: "home", label: "Home", color: "bg-green-500", icon: "🏠" },
    {
      value: "investment",
      label: "Investment",
      color: "bg-purple-500",
      icon: "📈",
    },
    { value: "emergency", label: "Emergency", color: "bg-red-500", icon: "🚨" },
    { value: "others", label: "Others", color: "bg-yellow-500", icon: "📝" },
  ];

  // Fetch total savings on mount
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/budget/total-savings/${userId}`)
      .then((res) => {
        if (res.data && typeof res.data.totalSavings === "number") {
          setBackendTotalSavings(res.data.totalSavings);
        }
      })
      .catch((err) => console.error("Error fetching total savings:", err));
  }, [userId]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/microinvestment/${userId}`)
      .then((res) => {
        const allAllocations = res.data;
        const filtered = allAllocations.filter(
          (alloc) => alloc.category === selectedCategory
        );
        setSavingsData((prev) => ({
          ...prev,
          [selectedCategory]: filtered,
        }));
      })
      .catch((err) =>
        console.error("Error fetching microinvestment data:", err)
      );
  }, [userId, selectedCategory]);

  // Handle adding new savings locally and via backend
  const handleAddSavings = () => {
    if (amount && description) {
      const newEntry = {
        amount: parseFloat(amount),
        description,
        date: new Date().toLocaleDateString(),
      };
      // Send new entry to backend so that it gets stored in MongoDB
      axios
        .post("http://localhost:5000/api/microinvestment", {
          userId,
          category: selectedCategory,
          amount: parseFloat(amount),
          description,
        })
        .then((res) => {
          // Update local state with the saved entry returned from backend
          setSavingsData((prev) => ({
            ...prev,
            [selectedCategory]: [...prev[selectedCategory], res.data],
          }));
          setAmount("");
          setDescription("");
          setIsAdding(false);
        })
        .catch((err) => {
          console.error("Error saving microinvestment:", err);
          if (err.response && err.response.data && err.response.data.error) {
            alert(err.response.data.error);
          }
        });
    }
  };

  // Handle deleting an entry from the currently selected category
  const handleDeleteSavings = (index, allocId) => {
    // Delete from backend first
    axios
      .delete(`http://localhost:5000/api/microinvestment/${allocId}`)
      .then(() => {
        setSavingsData((prev) => {
          const newCatArray = [...prev[selectedCategory]];
          newCatArray.splice(index, 1);
          return {
            ...prev,
            [selectedCategory]: newCatArray,
          };
        });
      })
      .catch((err) => console.error("Error deleting allocation:", err));
  };

  // Compute allocated amount from local savingsData
  const allocatedSoFar = Object.values(savingsData)
    .flat()
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // Unallocated = backend total savings - allocated amount
  const unallocated = backendTotalSavings - allocatedSoFar;

  // Helpers to get selected category's color and icon
  const getCategoryColor = () => {
    const cat = categories.find((c) => c.value === selectedCategory);
    return cat ? cat.color : "bg-blue-500";
  };

  const getCategoryIcon = () => {
    const cat = categories.find((c) => c.value === selectedCategory);
    return cat ? cat.icon : "";
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden relative z-10 border border-indigo-300 border-opacity-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4f46e5] to-[#6b5ce5] p-6 sm:p-8 border-b border-indigo-400 border-opacity-30">
          <div className="flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-indigo-200 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Savings Tracker
            </h1>
          </div>
          <p className="text-indigo-200 text-center text-sm">
            Organize, track, and manage your savings with elegance
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          {/* Category Selector */}
          <div className="mb-8">
            <label className="block text-lg font-medium mb-3">
              Select Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setIsAdding(false);
                  }}
                  className={`${
                    selectedCategory === cat.value
                      ? `${cat.color} ring-2 ring-white shadow-lg`
                      : "bg-indigo-800 bg-opacity-60 hover:bg-indigo-700"
                  } text-white rounded-lg p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 border border-indigo-400 border-opacity-30`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Savings Box Header */}
          <div
            className={`${getCategoryColor()} bg-opacity-5 p-6 rounded-xl border border-indigo-300 border-opacity-20 shadow-lg`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getCategoryIcon()}</span>
                <h2 className="text-3xl font-bold text-black capitalize">
                  {selectedCategory} Savings
                </h2>
              </div>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg transform hover:scale-105 border border-indigo-400 border-opacity-30"
              >
                + Add Savings
              </button>
            </div>

            {/* Add New Savings Form */}
            {isAdding && (
              <div className="mb-6 bg-indigo-900 bg-opacity-40 p-6 rounded-xl backdrop-filter backdrop-blur-sm animate-fadeIn border border-indigo-400 border-opacity-20">
                <h3 className="text-indigo-100 text-xl font-semibold mb-4">
                  Add New Savings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-indigo-200 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 bg-indigo-800 bg-opacity-50 border border-indigo-500 border-opacity-30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-200 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 bg-indigo-800 bg-opacity-50 border border-indigo-500 border-opacity-30 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddSavings}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md flex-1 border border-green-500 border-opacity-30"
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md flex-1 border border-red-500 border-opacity-30"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Allocation Table for the Selected Category */}
            {savingsData[selectedCategory].length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="p-3 text-left bg-indigo-800 bg-opacity-60 text-indigo-100 rounded-tl-lg border-b border-indigo-500 border-opacity-30">
                        Date
                      </th>
                      <th className="p-3 text-left bg-indigo-800 bg-opacity-60 text-indigo-100 border-b border-indigo-500 border-opacity-30">
                        Description
                      </th>
                      <th className="p-3 text-left bg-indigo-800 bg-opacity-60 text-indigo-100 border-b border-indigo-500 border-opacity-30">
                        Amount
                      </th>
                      <th className="p-3 text-left bg-indigo-800 bg-opacity-60 text-indigo-100 rounded-tr-lg border-b border-indigo-500 border-opacity-30">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {savingsData[selectedCategory].map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-indigo-900 bg-opacity-20"
                            : "bg-indigo-900 bg-opacity-10"
                        } hover:bg-indigo-900 hover:bg-opacity-30 transition-colors`}
                      >
                        <td className="p-3 text-black border-b border-indigo-700 border-opacity-30">
                          {item.date}
                        </td>
                        <td className="p-3 text-black border-b border-indigo-700 border-opacity-30">
                          {item.description}
                        </td>
                        <td className="p-3 text-black border-b border-indigo-700 border-opacity-30 font-semibold">
                          ${parseFloat(item.amount).toFixed(2)}
                        </td>
                        <td className="p-3 text-right border-b border-indigo-700 border-opacity-30">
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                            onClick={() => handleDeleteSavings(index, item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-indigo-700 bg-opacity-60 font-bold">
                      <td className="p-3 text-white rounded-bl-lg" colSpan="3">
                        Total
                      </td>
                      <td className="p-3 text-white rounded-br-lg">
                        $
                        {savingsData[selectedCategory]
                          .reduce(
                            (sum, item) => sum + parseFloat(item.amount || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="bg-indigo-900 bg-opacity-20 p-8 rounded-lg text-center border border-indigo-400 border-opacity-20">
                <p className="text-black italic mb-4">
                  No savings added yet for this category.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors border border-indigo-400 border-opacity-30"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Summary + Total Savings Row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-400 bg-opacity-30 rounded-xl p-4 shadow-lg border border-indigo-800 border-opacity-10">
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                Summary
              </h3>
              <p className="text-black">
                Track your savings across different categories to reach your
                financial goals faster.
              </p>
            </div>
            <div className="bg-white bg-opacity-30 rounded-xl p-4 shadow-lg border border-indigo-400 border-opacity-20">
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                Total Savings
              </h3>
              <p className="text-3xl font-bold text-green-600">
                ${backendTotalSavings.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Allocated + Unallocated Savings Row */}
          <div className="mt-4">
            {(() => {
              const allocatedSoFar = Object.values(savingsData)
                .flat()
                .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
              const unallocated = backendTotalSavings - allocatedSoFar;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-30 rounded-xl p-4 shadow-lg border border-indigo-400 border-opacity-20">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                      Allocated Savings
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      ${allocatedSoFar.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-xl p-4 shadow-lg border border-indigo-400 border-opacity-20">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                      Unallocated Savings
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      ${unallocated.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-indigo-400 border-opacity-20 p-4 text-center bg-opacity-30">
          <p className="text-sm">
            © {new Date().getFullYear()} Savings Tracker • Track your financial
            journey with confidence
          </p>
        </div>
      </div>
      <div className="bg-indigo-100 rounded-xl shadow-md p-6">
        <VoiceAssistant />
        <p className="text-xl font-bold mt-4">
          Hints:-
          <ul>
            <li className="text-base m-1 font-semibold">
              Show my goals progress.
            </li>
            <li className="text-base m-1 font-semibold">
              Give me a concise report of my savings data.
            </li>
            <li className="text-base m-1 font-semibold">
              What is my expenditure goals?
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default Micro_investment;
