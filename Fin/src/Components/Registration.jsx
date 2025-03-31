import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Card() {
  const [data, setdata] = useState({ name: "", email: "", password: "" });


  function handlechange(e) {
    setdata({ ...data, [e.target.name]: e.target.value });
  }
  const savedata = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post("http://localhost:5000/register", data);
    } catch (err) {
      console.error("Axios Error:", err); // ✅ Log full error
      alert("Error: " + err.response.data.error);
    }
  };
  return (
    <div>
      <div className="p-10">
        <h1 className="mb-8 font-extrabold text-4xl">Sign-Up</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={savedata}>
            <div>
              <label className="block font-semibold" htmlFor="name">
                Name
              </label>
              <input
                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                onChange={handlechange}
                id="name"
                type="text"
                name="name"
                required="required"
                autoFocus="autoFocus"
              />
            </div>


            <div className="mt-4">
              <label className="block font-semibold" htmlFor="email">
                Email
              </label>
              <input
                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                onChange={handlechange}
                id="email"
                type="email"
                name="email"
                required="required"
              />
            </div>


            <div className="mt-4">
              <label className="block font-semibold" htmlFor="password">
                Password
              </label>
              <input
                className="w-full shadow-inner bg-gray-100 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1"
                onChange={handlechange}
                id="password"
                type="password"
                name="password"
                required="required"
                autoComplete="new-password"
              />
            </div>


            <div className="flex items-center justify-between mt-8">
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Register
              </button>
              <Link to="/login" className="font-semibold">
                Already registered?
              </Link>
            </div>
          </form>


          <aside className="">
            <div className="bg-gray-100 p-8 rounded">
              <h2 className="font-bold text-2xl">Instructions</h2>
              <ul className="list-disc mt-4 list-inside">
                <li>
                  All users must provide a valid email address and password to
                  create an account.
                </li>
                <li>
                  Users must not use offensive, vulgar, or otherwise
                  inappropriate language in their username or profile
                  information
                </li>
                <li>
                  Users must not create multiple accounts htmlFor the same
                  person.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}



