import React, { useState, useEffect } from "react";
import Clients from "./ClientsTableItem";
import axios from "@/api/axios";
import LoadingOverlay from "@/components/LoadingOverlay";
import ReactPaginate from "react-paginate";
import ModalBasic from "@/components/ModalBasic";
import UpdateInsurer from "@/partials/AdminFeatures/Modals/UpdateInsurer";

function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  {
    /* Pagination */
  }
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const offset = currentPage * itemsPerPage;
  const currentItems = clients.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(clients.length / itemsPerPage);
  {
    /* Update Insurer Modal */
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  useEffect(() => {
    setLoading(true);
    axios
      .get("/get-clients")
      .then((res) => {
        if (res.data.success) {
          setClients(res.data.clients);
        } else {
          alert(
            "Failed to fetch clients. Refresh the page or Contact MIS Department"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Failed to fetch clients. Refresh the page or Contact MIS Department"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedData) {
      const selected = clients.find((client) => client.id === selectedData);
      setSelectedClient(selected);
    }
  }, [selectedData]);

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-4 flex justify-between">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 self-center">
          All Clients{" "}
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            {clients?.length}
          </span>
        </h2>
        <div className="relative">
          <input
            id="form-search"
            className="form-input w-full pl-9"
            type="search"
            placeholder="Search client..."
          />
          <button
            className="absolute inset-0 right-auto group"
            type="submit"
            aria-label="Search"
          >
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
                  <div className="font-semibold text-left">Client</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Insurer</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            {currentItems.map((client) => {
              return (
                <Clients
                  key={client.id}
                  id={client.id}
                  client={client.client_name}
                  insurer={client.insurer_id}
                  setModalOpen={setModalOpen}
                  setSelectedData={setSelectedData}
                />
              );
            })}
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {clients.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="flex justify-center gap-2 w-1/2 mb-4"
              pageClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
              activeClassName="bg-blue-500 text-white"
              previousClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
              nextClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
              disabledClassName="opacity-50 cursor-not-allowed"
              breakClassName="px-3 py-1 border rounded-md"
            />
          )}
        </div>
        <ModalBasic
          title="Update Insurer"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          {selectedClient && (
            <UpdateInsurer
              id={selectedClient.id}
              name={selectedClient.client_name}
              insurer_id={selectedClient.insurer_id}
              setLoading={setLoading}
              setModalOpen={setModalOpen}
              setClients={setClients}
              set
            />
          )}
        </ModalBasic>
        {loading && <LoadingOverlay />}
      </div>
    </div>
  );
}

export default ClientsTable;
