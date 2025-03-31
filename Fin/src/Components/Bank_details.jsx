import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Trash2,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";
import VoiceAssistant from "./Voice_assistance";

const BankDetails = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseValue, setExpenseValue] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("General");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timePeriod, setTimePeriod] = useState("month"); // 'week', 'month', or 'year'
  const [chartData, setChartData] = useState([]);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const balance = income - totalExpenses;

  // Categories with their colors
  const categories = {
    Food: "#4F46E5",
    Transport: "#818CF8",
    Housing: "#A5B4FC",
    Entertainment: "#C7D2FE",
    Utilities: "#E0E7FF",
    General: "#6B7280",
  };

  // Generate chart data based on actual expense dates and selected time period
  useEffect(() => {
    if (expenses.length === 0) {
      setChartData([]);
      return;
    }

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Group expenses based on time period
    let groupedData = {};
    let incomeData = {}; // For storing income per period

    // Function to get the period key based on date and time period
    const getPeriodKey = (dateStr) => {
      const date = new Date(dateStr);

      if (timePeriod === "week") {
        // Group by day of week
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayNames[date.getDay()];
      } else if (timePeriod === "month") {
        // Group by week of month
        const day = date.getDate();
        if (day <= 7) return "Week 1";
        if (day <= 14) return "Week 2";
        if (day <= 21) return "Week 3";
        return "Week 4";
      } else if (timePeriod === "year") {
        // Group by month
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return monthNames[date.getMonth()];
      }
    };

    // Calculate the number of distinct periods for income distribution
    const getDistinctPeriodCount = () => {
      const periodSet = new Set();

      expenses.forEach((expense) => {
        const key = getPeriodKey(expense.date);
        periodSet.add(key);
      });

      return periodSet.size || 1; // Avoid division by zero
    };

    // Calculate income per period (distribute income evenly)
    const incomePerPeriod = income / getDistinctPeriodCount();

    // Group expenses by period
    expenses.forEach((expense) => {
      const key = getPeriodKey(expense.date);

      if (!groupedData[key]) {
        groupedData[key] = 0;
        incomeData[key] = 0;
      }

      groupedData[key] += expense.value;

      // Only add income once per period
      if (incomeData[key] === 0) {
        incomeData[key] = incomePerPeriod;
      }
    });

    // Prepare final data for the chart
    let finalData = [];

    // Order periods appropriately based on time period
    let orderedKeys = [];

    if (timePeriod === "week") {
      // Order days of week
      const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      orderedKeys = dayOrder.filter((day) =>
        Object.keys(groupedData).includes(day)
      );
    } else if (timePeriod === "month") {
      // Order weeks
      const weekOrder = ["Week 1", "Week 2", "Week 3", "Week 4"];
      orderedKeys = weekOrder.filter((week) =>
        Object.keys(groupedData).includes(week)
      );
    } else if (timePeriod === "year") {
      // Order months
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      orderedKeys = monthOrder.filter((month) =>
        Object.keys(groupedData).includes(month)
      );
    }

    // Create final data array
    orderedKeys.forEach((key) => {
      finalData.push({
        name: key,
        expenses: groupedData[key] || 0,
        income: incomeData[key] || 0,
        balance: (incomeData[key] || 0) - (groupedData[key] || 0),
      });
    });

    setChartData(finalData);
  }, [expenses, income, timePeriod]);

  const addExpense = () => {
    if (expenseName && expenseValue && parseFloat(expenseValue) > 0) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          name: expenseName,
          value: parseFloat(expenseValue),
          category: expenseCategory,
          date: expenseDate, // Use the date from the date picker
        },
      ]);
      setExpenseName("");
      setExpenseValue("");
      // Keep the selected date as is for convenience when adding multiple expenses
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const getExpensesByCategory = () => {
    const categoryMap = {};
    expenses.forEach((expense) => {
      if (!categoryMap[expense.category]) {
        categoryMap[expense.category] = 0;
      }
      categoryMap[expense.category] += expense.value;
    });

    return Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category],
    }));
  };

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get appropriate title based on time period
  const getTimeSeriesTitle = () => {
    switch (timePeriod) {
      case "week":
        return "Weekly Income vs Expenses (Based on Transaction Dates)";
      case "month":
        return "Monthly Income vs Expenses (Based on Transaction Dates)";
      case "year":
        return "Yearly Income vs Expenses (Based on Transaction Dates)";
      default:
        return "Income vs Expenses";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* <h1 className="text-2xl font-bold text-indigo-600">Financial Dashboard</h1> */}
            {/* <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div> */}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-4 font-medium ${
                activeTab === "dashboard"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity size={18} />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-4 font-medium ${
                activeTab === "transactions"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <CreditCard size={18} />
                <span>Transactions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-4 font-medium ${
                activeTab === "history"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>History</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Current Balance
                    </h3>
                    <p
                      className={`text-3xl font-bold mt-1 ${
                        balance >= 0 ? "text-gray-800" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(balance)}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${
                      balance >= 0 ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {balance >= 0 ? (
                      <TrendingUp className="text-green-600" />
                    ) : (
                      <TrendingDown className="text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Income
                    </h3>
                    <p className="text-3xl font-bold mt-1 text-green-600">
                      {formatCurrency(income)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Total Expenses
                    </h3>
                    <p className="text-3xl font-bold mt-1 text-red-600">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-red-100">
                    <TrendingDown className="text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Forms Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Expense Breakdown Chart */}
              <div className="bg-white rounded-xl shadow p-6 lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Expense Breakdown
                </h3>
                <div className="h-64">
                  {expenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getExpensesByCategory()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {getExpensesByCategory().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={categories[entry.name] || "#6B7280"}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <PieChart size={48} />
                      <p className="mt-2">No expenses yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Forms */}
              <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Income Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Update Income
                    </h3>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="number"
                        value={income || ""}
                        onChange={(e) =>
                          setIncome(parseFloat(e.target.value) || 0)
                        }
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter Income"
                      />
                    </div>
                  </div>

                  {/* Expense Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Add Expense
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Expense Name"
                      />
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="number"
                          value={expenseValue}
                          onChange={(e) => setExpenseValue(e.target.value)}
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Amount"
                        />
                      </div>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {Object.keys(categories).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {/* Add date picker for expense */}
                      <input
                        type="date"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={addExpense}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <PlusCircle size={18} />
                        <span>Add Expense</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Income vs Expenses Chart with Time Period Toggle */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <div className="flex flex-wrap justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {getTimeSeriesTitle()}
                </h3>

                <div className="flex border rounded-lg overflow-hidden mt-2 sm:mt-0">
                  <button
                    onClick={() => setTimePeriod("week")}
                    className={`px-4 py-2 text-sm ${
                      timePeriod === "week"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimePeriod("month")}
                    className={`px-4 py-2 text-sm ${
                      timePeriod === "month"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimePeriod("year")}
                    className={`px-4 py-2 text-sm ${
                      timePeriod === "year"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="h-72">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="income" fill="#4F46E5" name="Income" />
                      <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Activity size={48} />
                    <p className="mt-2">Add expenses to see the chart</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Transactions
            </h2>

            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Sort expenses by date in descending order (most recent first) */}
                    {[...expenses]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {expense.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className="px-2 py-1 text-xs font-medium rounded-full"
                              style={{
                                backgroundColor: `${
                                  categories[expense.category]
                                }20`,
                                color: categories[expense.category],
                              }}
                            >
                              {expense.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {formatCurrency(expense.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => removeExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No transactions yet. Add an expense to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab - Added a simple calendar view of expenses */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Expense History by Date
            </h2>

            {expenses.length > 0 ? (
              <div>
                {/* Group expenses by date */}
                {Object.entries(
                  expenses.reduce((acc, expense) => {
                    if (!acc[expense.date]) {
                      acc[expense.date] = [];
                    }
                    acc[expense.date].push(expense);
                    return acc;
                  }, {})
                )
                  .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // Sort by date descending
                  .map(([date, expensesOnDate]) => {
                    const totalForDay = expensesOnDate.reduce(
                      (sum, exp) => sum + exp.value,
                      0
                    );

                    return (
                      <div key={date} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-700">
                            {formatDate(date)}
                          </h3>
                          <span className="text-red-600 font-medium">
                            {formatCurrency(totalForDay)}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {expensesOnDate.map((expense) => (
                            <div
                              key={expense.id}
                              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                            >
                              <div className="flex items-center">
                                <span
                                  className="w-3 h-3 rounded-full mr-3"
                                  style={{
                                    backgroundColor:
                                      categories[expense.category],
                                  }}
                                ></span>
                                <span className="text-gray-800">
                                  {expense.name}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-red-600 font-medium mr-4">
                                  {formatCurrency(expense.value)}
                                </span>
                                <button
                                  onClick={() => removeExpense(expense.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>
                  No history yet. Add expenses to see your spending patterns
                  over time.
                </p>
              </div>
            )}
          </div>
        )}
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

export default BankDetails;
