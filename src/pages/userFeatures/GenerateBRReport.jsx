import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";
import xmark from "../../icons/xmark.svg";
import check from "../../icons/check.svg";

import SearchClient from "./SearchClient";
import SearchResult from "./SearchResult";

function GenerateBRReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [searchClient, setSearchClient] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [search, setSearch] = useState(false);
  const [searchResults, setSearchResults] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClientSearch = () => {
    // use axios to /search-client and send SearchClient
    const res = axios.get(`/search-client/${searchClient}`).then((res) => {
      if (res.data.success) {
        setSearchResults(res.data.client);
        setSearchClient("");
      } else {
        alert(res.data.message);
      }
    });
  };

  useEffect(() => {
    if (user) {
      if (user.br_upload) {
        setCanUpload(true);
      }
      if (user.br_create) {
        setCanCreate(true);
      }
    } else {
      if (!user) {
        navigate("/404");
      }
    }
  }, [user]);

  useEffect(() => {
    if (search) {
      setSearch(false);
      handleClientSearch();
    }
  }, [search]);

  const handleUpload = (file, year, insurer, hasData, client_id, type) => {
    // check if file is valid and exists. extension should be xlsx
    if (file && file.name) {
      if (file.name.split(".").pop() !== "xlsx") {
        alert("Invalid file type");
        return;
      }
    } else {
      alert("No file uploaded");
      return;
    }
    if (hasData) {
      if (
        confirm("Data already exists for this year. Do you want to overwrite?")
      ) {
        // overwrite data
        console.log("Overwrite data");
        handleUpload2(file, year, insurer, client_id, type);
      } else {
        // do nothing
        return;
      }
    } else {
      // upload data
      console.log("Upload data");
      handleUpload2(file, year, insurer, client_id, type);
    }
  };

  const handleUpload2 = (file, year, insurer, client_id, type) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("year", year);
    formData.append("insurer_id", insurer);
    formData.append("client_id", client_id);
    // create a switch case for insurer
    switch (insurer) {
      case 1: {
        console.log(file);
        axios
          .post("/upload-medicare-data", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.data.success) {
              alert("Data uploaded successfully");
            } else {
              alert(`${res.data.message} \n${res.data.error}`);
            }
          });
        break;
      }

      case 2: {
        axios
          .post("/upload-philcare-data", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.data.success) {
              alert("Data uploaded successfully");
              window.location.reload();
            } else {
              alert(`${res.data.message} \n${res.data.error}`);
            }
          });

        break;
      }

      case 4:
        {
          if (type === "masterlist") {
            axios
              .post("/upload-intellicare-masterlist", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                if (res.data.success) {
                  alert("Data uploaded successfully");
                  window.location.reload();
                } else {
                  alert(`${res.data.message} \n${res.data.error}`);
                }
              });
          } else {
            axios
              .post("/upload-intellicare-data", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                if (res.data.success) {
                  alert("Data uploaded successfully");
                  window.location.reload();
                } else {
                  alert(`${res.data.message} \n${res.data.error}`);
                }
              });
          }

          break;
        }

        defaul: null;
    }
  };

  const handleCreate = (data) => {
    console.log(data);
    navigate("/user/generated-result", { state: { data } });
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 pt-8 w-full mx-auto ">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8 border-b dark:border-slate-700 w-full ">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Generate BR Report
                </h1>
              </div>
              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Permissions Checker */}
                <div className="flex items-center p-4 bg-white dark:bg-slate-800">
                  <div className="flex items-center mr-4">
                    {canUpload ? (
                      <img
                        src={check}
                        alt="check"
                        className="w-6 h-6 text-green-500"
                      />
                    ) : (
                      <img
                        src={xmark}
                        alt="xmark"
                        className="w-6 h-6 text-red-500"
                      />
                    )}
                    <span className="text-sm text-gray-500">
                      Can Upload BR Reports
                    </span>
                  </div>
                  <div className="flex items-center">
                    {canCreate ? (
                      <img
                        src={check}
                        alt="check"
                        className="w-6 h-6 text-green-500"
                      />
                    ) : (
                      <img
                        src={xmark}
                        alt="xmark"
                        className="w-6 h-6 text-red-500"
                      />
                    )}
                    <span className="text-sm text-gray-500">
                      Can Create BR Reports
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {isVisible && (
              <SearchClient
                setSearchClient={setSearchClient}
                setIsVisible={setIsVisible}
                setSearch={setSearch}
              />
            )}
            {searchResults !== "" && (
              <SearchResult
                SearchResults={searchResults}
                handleCreate={handleCreate}
                handleUpload={handleUpload}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GenerateBRReport;
