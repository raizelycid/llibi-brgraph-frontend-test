import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";

function Header({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleSignout = async () => {
    try {
      const res = await axios.post("/logout");
      if (res.status === 200) {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/signin";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-[#182235] border-b border-slate-200 dark:border-slate-700 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          {/*If user is logged in, change this to Hi, <username> */}
          <div>
            {user ? (
              <div className="flex items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400 hidden lg:flex mx-2">
                  Hi, {user.username}
                </span>
                <button
                  className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500"
                  onClick={handleSignout}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center">
                <button
                  className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-indigo-500"
                  onClick={() => {
                    navigate("/signin");
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
