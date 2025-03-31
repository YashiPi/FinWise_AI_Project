import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Bank_details from "./Components/Bank_details";
import Registration from "./Components/Registration"
import Tabbar from "./Components/Tabbar"
import Login from "./Components/Login"
import GetStarted from "./Components/GET_started";
import Features from "./Components/Features";
import Budget from "./Components/Budget";
import Micro_investment from "./Components/Micro_investment";
import Goal from "./Components/Goal";
import Profile from "./Components/Profile";
import AboutUs from "./Components/AboutUs";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          {/* <Tabbar /> */}
          <GetStarted />

          
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          
          <Login />
        </>
      ),
    },
    {
      path: "/register",
      element: (
        <>
          
          <Registration />
        </>
      ),
    },
    {
      path: "/account",
      element: (
        <>
          <Tabbar />
          <Bank_details />
        </>
      ),
    },
    {
      path: "/features",
      element: (
        <>
          {/* <Tabbar /> */}
          <Features />
        </>
      ),
    },
    {
      path: "/budget",
      element: (
        <>
          <Tabbar />
          <Budget />
        </>
      ),
    },

    {
      path: "/micro",
      element: (
        <>
          <Tabbar />
          <Micro_investment />
        </>
      ),
    },
    {
      path: "/goal",
      element: (
        <>
          <Tabbar />
          <Goal />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <Tabbar />
          <Profile />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          
          <AboutUs />
        </>
      ),
    },
    

  ]);

  return (
    <>
      <RouterProvider router={router} />
      
      </>
  )
}

export default App;
