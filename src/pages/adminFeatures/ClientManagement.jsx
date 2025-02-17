import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import ClientsTable from '../../partials/AdminFeatures/ClientsTable';
import { useAuth } from '@/contexts/AuthContext';

function ClientManagement() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Client Management - " + import.meta.env.VITE_APP_NAME;
    // check if user is logged in and allowed to access the page
    if (user) {
      if (!user.admin) {
        // navigate to 404 page
        navigate('/404');
      }
    }else{
      // navigate to login page
      navigate('/signin');
    }
  },[]);



  return (
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Client Management</h1>
            </div>
            {/* Right: Actions */}
      

          </div>
          {/*Table */}
          <ClientsTable />
        </div>
        </main>

      </div>

    </div>
  );
}

export default ClientManagement;