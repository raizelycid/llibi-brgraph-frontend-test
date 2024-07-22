import React, { useState } from "react";
import axios from "@/api/axios";
import Sidebar from "@/partials/Sidebar";
import Header from "@/partials/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Client() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow"> Hello</main>
      </div>
    </div>
  );
}

export default Client;
