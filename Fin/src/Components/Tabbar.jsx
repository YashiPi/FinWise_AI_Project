import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
// import GetStarted from './Components/GET_started';

export default function Tabbar() {
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center ">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V10"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 3L22 9H2L12 3Z"
                fill="#4F46E5"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-xl text-indigo-600">FinWise</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link
            to="/account"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Account
          </Link>
          <Link
            to="/budget"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Budget
          </Link>
          <Link
            to="/micro"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Micro-Investment
          </Link>
          <Link
            to="/goal"
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Goals
          </Link>
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* <button className="p-2 text-gray-500 hover:text-indigo-600">
            <Settings className="w-5 h-5" />
          </button> */}
          <div className="flex space-x-2">
            <Link className="flex flex-row" to="/profile">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                P
              </div>
              <span className="text-gray-700 m-1"> Profile</span>
            </Link>
          </div>
          {/* <button className="p-2 text-gray-500 hover:text-indigo-600">
            <LogOut className="w-5 h-5" />
          </button> */}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>
    </div>
  );
}
