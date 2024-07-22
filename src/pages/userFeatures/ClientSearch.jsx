import React, { useState } from "react";
import axios from "@/api/axios";
import Sidebar from "@/partials/Sidebar";
import Header from "@/partials/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "@/images/logo.svg";

function ClientSearch() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [searchClient, setSearchClient] = useState("");
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="flex flex-col justify-center items-center h-full pb-6 lg:pb-0 md:px-6 lg:px-0">
            <img src={Logo} alt="Logo" className="lg:w-72 lg:h-36 md:w-60 md:h-24 sm:w-48 sm:h-24 w-36 h-24" />
            <div className="flex flex-col items-center justify-center">
              <input
                type="text"
                placeholder="Input Client Name"
                className="w-96 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 md:w-80 md:h-10 sm:w-72 sm:h-8"
                onChange={(e) => {
                  setSearchClient(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick();
                  }
                }}
              />
              <button className="h-10 w-32 flex justify-center px-6 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                <span className="text-center mt-auto mb-auto">Search</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ClientSearch;
