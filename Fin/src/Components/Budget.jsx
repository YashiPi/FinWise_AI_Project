import React, { useState, useEffect } from "react";
import axios from "axios";
import VoiceAssistant from "./Voice_assistance";
//import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Budget = () => {
  // Hardcoded userId for demo; in production, fetch from auth.
  const userId = "67e96c0be6c7599def34e657";

  // ------------------ Budget States ------------------
  const [transactions, setTransactions] = useState([]);
  const [newExpense, setNewExpense] = useState("");
  const [newDate, setNewDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [timePeriod, setTimePeriod] = useState("per-transaction");
  const [results, setResults] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [transactionRoundingType, setTransactionRoundingType] =
    useState("nearest-decimal");

  const categories = [
    { value: "nearest-decimal", label: "Round to Next 0.1" },
    { value: "nearest-tens", label: "Round to Next 10" },
    { value: "nearest-hundreds", label: "Round to Next 100" },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/transactions/${userId}`)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, [userId]);

  // ------------------ Add Transaction Function ------------------
  const handleAddTransaction = () => {
    if (newExpense && !isNaN(parseFloat(newExpense))) {
      // Force amount to exactly two decimals
      const amountValue = Math.round(parseFloat(newExpense) * 100) / 100;
      axios
        .post("http://localhost:5000/api/transactions", {
          userId,
          amount: amountValue,
          date: newDate,
          roundingType: transactionRoundingType,
        })
        .then((res) => {
          const createdTransaction = res.data;
          setTransactions([...transactions, createdTransaction]);
          setNewExpense("");
        })
        .catch((err) => console.error("Error adding transaction:", err));
    }
  };

  // ------------------ Rounding Functions ------------------
  const roundToDecimal = (value) => Math.ceil(value * 10) / 10;
  const roundToTens = (value) => Math.ceil(value / 10) * 10;
  const roundToHundreds = (value) => Math.ceil(value / 100) * 100;
  const computeRoundedAmount = (amount, rt) => {
    if (rt === "nearest-decimal") return roundToDecimal(amount);
    if (rt === "nearest-tens") return roundToTens(amount);
    if (rt === "nearest-hundreds") return roundToHundreds(amount);
    return amount;
  };

  // ------------------ Group Transactions & Calculate Results ------------------
  const groupTransactionsByPeriod = () => {
    if (timePeriod === "per-transaction") {
      return transactions.map((t) => {
        const roundedAmount = computeRoundedAmount(t.amount, t.roundingType);
        const savings = Number((roundedAmount - t.amount).toFixed(2));
        return { ...t, roundedAmount, savings };
      });
    }
    const groups = {};
    transactions.forEach((transaction) => {
      const dateObj = new Date(transaction.date);
      let key;
      switch (timePeriod) {
        case "per-day":
          key = transaction.date.split("T")[0];
          break;
        case "per-week": {
          const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
          const pastDaysOfYear = (dateObj - firstDayOfYear) / 86400000;
          const weekNum = Math.ceil(
            (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
          );
          key = `${dateObj.getFullYear()}-W${weekNum}`;
          break;
        }
        case "per-month":
          key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
          break;
        case "per-year":
          key = dateObj.getFullYear().toString();
          break;
        default:
          key = transaction.date.split("T")[0];
      }
      if (!groups[key]) {
        groups[key] = {
          period: key,
          transactionList: [],
          total: 0,
          roundedSum: 0,
        };
      }
      groups[key].transactionList.push(transaction);
      groups[key].total += transaction.amount;
      groups[key].roundedSum += computeRoundedAmount(
        transaction.amount,
        transaction.roundingType
      );
    });
    const result = Object.values(groups).map((group) => {
      const savings = Number((group.roundedSum - group.total).toFixed(2));
      return {
        ...group,
        transactionCount: group.transactionList.length,
        roundedTotal: group.roundedSum,
        savings,
      };
    });
    return result.sort((a, b) => a.period.localeCompare(b.period));
  };

  const calculateResults = () => {
    const groupedData = groupTransactionsByPeriod();
    setResults(groupedData);
    let savings = 0;
    if (timePeriod === "per-transaction") {
      savings = groupedData.reduce((sum, t) => sum + (t.savings || 0), 0);
    } else {
      savings = groupedData.reduce((sum, g) => sum + (g.savings || 0), 0);
    }
    setTotalSavings(savings);
  };

  useEffect(() => {
    calculateResults();
  }, [transactions, timePeriod]);

  const formatPeriodLabel = (period) => {
    if (timePeriod === "per-day") return `Day: ${period}`;
    if (timePeriod === "per-week") return `Week: ${period}`;
    if (timePeriod === "per-month") {
      const [year, month] = period.split("-");
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    if (timePeriod === "per-year") return `Year: ${period}`;
    return period;
  };

  // ------------------ Chatbot Callback Functions ------------------
  // Called when the chatbot bot detects a command to add a transaction.
  const handleChatAddTransaction = (amount, rounding) => {
    setNewExpense(amount);
    setTransactionRoundingType(rounding);
    handleAddTransaction();
  };

  // Called when the chatbot bot detects a command to set the time period.
  const handleChatSetTimePeriod = (period) => {
    setTimePeriod(period);
  };

  // ------------------ Render ------------------
  return (
    <div className="relative p-6 bg-indigo-100 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-black-800">
        Expense Rounding Calculator
      </h1>

      {/* Time Period Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-black-700 mb-2">
            Time Period
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="per-transaction">Per Transaction</option>
            <option value="per-day">Per Day</option>
            <option value="per-week">Per Week</option>
            <option value="per-month">Per Month</option>
            <option value="per-year">Per Year</option>
          </select>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Add New Transaction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newExpense}
              onChange={(e) => setNewExpense(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Round To
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={transactionRoundingType}
              onChange={(e) => setTransactionRoundingType(e.target.value)}
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-blue-700"
              onClick={handleAddTransaction}
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Savings Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-blue-800 mb-1">
              Total Original Expenses
            </p>
            <p className="text-2xl font-bold text-blue-900">
              $
              {transactions
                .reduce((sum, t) => sum + (t.amount || 0), 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-green-900 mb-1">
              Total Rounded Expenses
            </p>
            <p className="text-2xl font-bold text-green-900">
              $
              {(
                transactions.reduce((sum, t) => sum + (t.amount || 0), 0) +
                totalSavings
              ).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
            <p className="text-sm text-purple-800 mb-1">Total Savings</p>
            <p className="text-2xl font-bold text-purple-900">
              ${totalSavings.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 font-bold rounded-md border border-yellow-100">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Each transaction is rounded individually
            based on the selected "Round To" option.
          </p>
        </div>
      </div>

      {/* Results Display */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          {timePeriod === "per-transaction"
            ? "Transaction Results"
            : `${
                timePeriod.replace("per-", "").charAt(0).toUpperCase() +
                timePeriod.replace("per-", "").slice(1)
              } Results`}
        </h2>
        {results && results.length > 0 ? (
          <div className="max-h-[250px] overflow-y-auto">
            {timePeriod === "per-transaction" ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                      Original Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                      Rounded Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((transaction) => (
                    <tr key={transaction._id || transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${transaction.roundedAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                        ${transaction.savings?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rounded Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Savings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((group, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPeriodLabel(group.period)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {group.transactionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${group.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${group.roundedTotal?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                        ${group.savings?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No transactions to display.</p>
        )}
      </div>

      {/* All Transactions Table: Top 5 Recent */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          All Transactions (Recent 5)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions
                .slice(-5)
                .reverse()
                .map((transaction) => (
                  <tr key={transaction._id || transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction._id || transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${transaction.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-2">
            Showing the 5 most recent transactions.
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

export default Budget;
