import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import axios from "../../../api/axios";
import xmark from "../../../icons/xmark.svg";
import check from "../../../icons/check.svg";
import ModalBasic from "../../../components/ModalBasic";
import ModalBlank from "../../../components/ModalBlank";
import Dropzone from "react-dropzone";
import LoadingOverlay from "../../../components/LoadingOverlay";

function Decks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  {
    /* Deck Table */
  }
  const [decks, setDecks] = useState([]);
  const [headcount, setHeadcount] = useState(0);
  const [refresh, setRefresh] = useState(true);

  {
    /* Upload Deck Modal */
  }
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const handleFile = (file) => {
    if (file) {
      setFile(file);
    }
  };
  const fileTypes = ["ppt", "pptx"];
  const resetModal = () => {
    setFileName("");
    setDescription("");
    setFile(null);
    setSearchClient("");
  };

  {
    /* Delete Modals */
  }
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDeck, setDeleteDeck] = useState(null);

  {
    /* Information Modal */
  }
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [infoType, setInfoType] = useState(null);

  {
    /* Overwrite Modal */
  }
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  {
    /* Clients */
  }
  const [clients, setClients] = useState([]);
  const [searchClient, setSearchClient] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  const handleUpload = () => {
    // check if selectedClient is empty and ask to select a client
    if (!selectedClient) {
      setMessage("Please select a client");
      setInfoType("error");
      setShowInfoModal(true);
      return;
    }
    // check if file name is already in use and ask if they want to overwrite
    if (file && description) {
      setLoading(true);
      // edit file name to fileName

      let extension = file.name.split(".").pop();
      let formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("fileName", fileName.concat(".", extension));
      formData.append("user_id", user.id);
      formData.append("username", user.username);
      formData.append("client_id", selectedClient.id);

      axios
        .post("/upload-deck", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          setShowUploadModal(false);
          resetModal();
          setDecks([...decks, res.data.deck]);
          setMessage("Deck uploaded successfully");
          setInfoType("success");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setShowUploadModal(false);
          setShowOverwriteModal(false);
          setShowInfoModal(true);
          setRefresh(true);
        });
    }
  };

  const BeforeUpload = () => {
    let extension = file.name.split(".").pop();
    let fileExists = decks.find(
      (deck) => deck.name === fileName.concat(".", extension)
    );
    console.log(fileExists);
    if (fileExists) {
      setShowOverwriteModal(true);
    } else {
      handleUpload();
    }
  };

  const handleDelete = (fileName) => {
    setLoading(true);
    axios
      .delete(`/delete-deck/${fileName}`)
      .then((res) => {
        if (res.data.success) {
          setDecks(decks.filter((deck) => deck.name !== fileName));
          setMessage(res.data.success);
          setInfoType("success");
          setHeadcount(headcount - 1);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setShowDeleteModal(false);
        setShowInfoModal(true);
      });
  };

  useEffect(() => {
    if(refresh){
    setLoading(true);
    axios
      .get("/get-decks")
      .then((res) => {
        setDecks(res.data.decks);
        setHeadcount(res.data.headcount[0].headcount);
        setClients(res.data.clients);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRefresh(false);
        setLoading(false);
      });
    }
  }, [refresh]);


  // filter for map function client search
  const filterClients = () => {
    // do not return if searchClient is empty
    if (!searchClient) return [];
    // do not return if searchClient is equal to client name
    if (clients.find((client) => client.client_name === searchClient))
      return [];
    return clients.filter((client) =>
      client.client_name.toLowerCase().includes(searchClient.toLowerCase())
    );
  };

  const findClient = (id) => {
    // find id in clients and return client_name
    let client = clients.find((client) => client.id === id);
    if (!client) return "Not found";
    return client.client_name;
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
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Decks
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-row">
                  {user?.deck_upload ? (
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
                  <span className="text-base text-gray-500 ml-2">
                    Upload Decks
                  </span>
                </div>
                <div className="flex flex-row">
                  {user?.deck_view ? (
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
                  <span className="text-base text-gray-500 ml-2">
                    Can View Decks
                  </span>
                </div>
              </div>
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <button
                  className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadModal(true);
                  }}
                >
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="hidden xs:block ml-2">Upload</span>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <header className="px-5 py-4 flex justify-between">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 self-center">
                All Decks{" "}
                <span className="text-slate-800 dark:text-slate-500 font-medium text-base">
                  {headcount}
                </span>
              </h2>
              <div className="relative">
                <input
                  id="form-search"
                  className="form-input w-full pl-9"
                  type="search"
                  placeholder="Search Deck..."
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
            <div className="overflow-x-auto">
              <table className="table-auto w-full dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Client Name</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Uploaded On</th>
                    <th className="px-6 py-3 text-left">Uploaded By</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {decks.map((deck, key) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              {deck.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                              {findClient(deck.client_id)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-800 dark:text-slate-100">
                          {deck.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-800 dark:text-slate-100">
                          {new Date(deck.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-800 dark:text-slate-100">
                          {deck.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <a
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          href={`${
                            import.meta.env.VITE_DO_LLIBI_CDN_ENDPOINT
                          }/Decks/${deck.name}`}
                          target="_blank"
                        >
                          Download
                        </a>
                        <a
                          className="text-red-600 hover:text-red-900 ml-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(true);
                            setDeleteDeck(deck.name);
                          }}
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <ModalBasic
          modalOpen={showUploadModal}
          setModalOpen={setShowUploadModal}
          title={"Upload Deck"}
          resetModal={resetModal}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            {/* File Name */}
            <label htmlFor="file" className="text-sm font-medium text-gray-700">
              File Name
            </label>
            <input
              id="file"
              name="file"
              type="text"
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm  sm:text-sm ${
                fileName.length < 6
                  ? "!border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-green-500 focus:ring-green-500 focus:border-green-500"
              }`}
              placeholder="Enter a file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
            <p
              className={`mb-2 ${
                fileName.length < 6 ? "text-sm text-red-600" : "hidden"
              }`}
            >
              File name should be atleast 6 characters long
            </p>
            {/* Description */}
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={1}
              className="mt-1 mb-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/* Client Search */}
            <div className="relative mb-8">
              <label
                htmlFor="client"
                className="text-sm font-medium text-gray-700"
              >
                Input Client Name
              </label>
              <input
                id="client"
                name="client"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter a client name"
                value={searchClient}
                onChange={(e) => {
                  setSearchClient(e.target.value);
                  setSelectedClient(null);
                }}
              />
              {/* Client Search Result Container */}
              <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-36 overflow-y-auto">
                {filterClients().map((client, key) => (
                  <div
                    key={key}
                    className="flex items-center p-2 cursor-pointer  hover:bg-gray-600 hover:bg-opacity-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchClient(client.client_name);
                      setSelectedClient(client);
                    }}
                  >
                    <span className="text-sm text-gray-700 ">
                      {client.client_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* File Upload */}
            <Dropzone onDrop={(acceptedFiles) => handleFile(acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <section className="container">
                  <div
                    {...getRootProps({
                      className:
                        "border-2 border-dashed border-gray-300 p-8 rounded-md flex justify-center items-center cursor-pointer hover:border-indigo-500 transition duration-300 ease-in-out",
                    })}
                  >
                    <input
                      {...getInputProps({
                        accept: fileTypes.map((type) => `.${type}`).join(","),
                        required: true,
                      })}
                    />
                    <div className="flex flex-col items-center">
                      {file ? (
                        <div className="flex flex-col items-center">
                          <p className="text-gray-700 text-center cursor-default">
                            File "{file.name}" is uploaded.
                          </p>
                          <p className="text-gray-500 text-center mt-2 text-sm">
                            You can drag/drop a new file or click here to
                            replace it.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-gray-500 text-center cursor-pointer">
                            Drag/Drop a file or{" "}
                            <span className="text-indigo-500">click here</span>{" "}
                            to browse
                          </p>
                          {/* allowed file types */}
                          <p className="text-gray-500 text-center mt-2 text-sm">
                            Allowed file types: {fileTypes.toString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
            <button
              className={`btn self-center mt-6 ${
                file && description && fileName.length > 6
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                BeforeUpload();
              }}
              disabled={!file}
            >
              Upload
            </button>
          </div>
        </ModalBasic>
        <ModalBasic
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          title={"Delete Deck"}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            <p className="text-gray-700 text-center">
              Are you sure you want to delete <b>{deleteDeck}</b>? This action
              cannot be undone.
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="btn bg-red-500 hover:bg-red-600"
                onClick={() => handleDelete(deleteDeck)}
              >
                Delete
              </button>
              <button
                className="btn bg-gray-300 hover:bg-gray-400 ml-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBasic>
        <ModalBlank modalOpen={showInfoModal} setModalOpen={setShowInfoModal}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            <p
              className={`text-center text-${
                infoType === "success" ? "green" : "red"
              }-500 text-lg`}
            >
              {message}
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="btn bg-indigo-500 hover:bg-indigo-600"
                onClick={() => setShowInfoModal(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </ModalBlank>
        <ModalBasic
          modalOpen={showOverwriteModal}
          setModalOpen={setShowOverwriteModal}
          title={"Overwrite Deck"}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
            <p className="text-gray-700 text-center">
              A deck named <b>{fileName}</b> already uploaded. Do you want to
              overwrite it?
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="btn bg-indigo-500 hover:bg-indigo-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
              >
                Overwrite
              </button>
              <button
                className="btn bg-gray-300 hover:bg-gray-400 ml-2"
                onClick={() => setShowOverwriteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBasic>
        {loading && <LoadingOverlay />}
      </div>
    </div>
  );
}

export default Decks;
