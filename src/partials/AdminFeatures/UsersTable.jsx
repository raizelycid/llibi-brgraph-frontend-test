import React, { useState, useEffect } from 'react';
import Users from './UsersTableItem';

import Image01 from '../../images/icon-01.svg';
import Image02 from '../../images/icon-02.svg';
import Image03 from '../../images/icon-03.svg';

function UsersTable({
  selectedItems
}) {

  const users = [
    {
      id: '0',
      email: 'johndoe@llibi.com',
      username: 'johndoe',
      permissions: [['Upload','Create'],['Upload','View']]
    },
  ];

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(users);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4 flex justify-between">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 self-center">All Users <span className="text-slate-400 dark:text-slate-500 font-medium">442</span></h2>
        <div className="relative">
                          <input id="form-search" className="form-input w-full pl-9" type="search" placeholder='Search User...' />
                          <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                            <svg
                              className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-3 mr-2"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                            </svg>
                          </button>
                        </div>
      </header>
      <div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Email</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Username</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Permissions</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            {
              list.map(user => {
                return (
                  <Users
                    key={user.id}
                    id={user.id}
                    email={user.email}
                    username={user.username}
                    permissions={user.permissions}
                    
                  />
                )
              })
            }
          </table>

        </div>
      </div>
    </div>
  );
}

export default UsersTable;
