import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaExchangeAlt,
  FaCreditCard,
  FaPiggyBank,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaDownload,
  FaGoogle,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";


function Profile() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  //const [lastLogin, setLastLogin] = useState("");


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const response = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Send token
        });
        console.log("API Response:", response.data); // Debug API response
        setUser(response.data); // Set the user data
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlelogout = async () =>{
    try{ await axios.post(`http://localhost:5000/logout`, {}, { withCredentials: true });

    // Remove token from localStorage
    localStorage.removeItem("token");

    console.log("Logged out successfully");
    navigate("/login"); // Redirect to login page
  } catch (error) {
    console.error("Logout failed:", error.response?.data?.message || error.message);
  }
};

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main content */}
      <div className="p-6">
        {/* Top welcome section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back! {user?.name || "Guest"}
            </h1>
            {/* <p className="text-gray-600">
              Last login: March 12, 2025 at 09:45 AM
            </p> */}
          </div>
          
        </div>


        


        {/* Profile information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 md:pr-8 mb-6 md:mb-0">
              <div className="text-center md:text-left">
                
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                {user?.name || "Guest"}
                </h2>
                <h1 className="mt-4 text-xl font-bold text-gray-800">Time to start building your financial future, one step at a time.</h1>
              </div>
            </div>


            <div className="w-full md:w-2/3 md:border-l md:pl-8 md:border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Ayushi"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Gautam"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="Ayushi.Gautam@example.com"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="(555) 123-4567"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      defaultValue="1985-06-15"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue="123 Finance Street"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      defaultValue="New York"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      defaultValue="10001"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between mt-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg mb-3 md:mb-0"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>


        {/* Security settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Security Settings
          </h3>
          <div className="space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200">
              <div>
                {/* <h4 className="font-medium text-gray-800">
                  Login Notifications
                </h4> */}
                {/* <p className="text-sm text-gray-600">
                  Receive alerts when new login is detected
                </p> */}
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                {/* <span className="mr-3 text-sm font-medium text-green-600">
                  Enabled
                </span> */}
                {/* <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-600">
                  <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white"></span>
                </button> */}
              </div>
            </div>


            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">
                  Remember This Device
                </h4>
                <p className="text-sm text-gray-600">
                  Stay logged in on this device
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                
                
              </div>
              
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg mb-3" onClick={handlelogout}>Log out</button>
          </div>
        </div>
    </div>
    </div>
  );
}


export default Profile;














