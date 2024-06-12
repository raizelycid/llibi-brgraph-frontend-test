import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Sidebar from "../../../partials/Sidebar";
import Header from "../../../partials/Header";
import axios from "../../../api/axios";
import LoadingOverlay from "react-loading-overlay-nextgen";
import FadeLoader from "react-spinners/FadeLoader";
import xmark from "../../../icons/xmark.svg";
import check from "../../../icons/check.svg";
import ModalBasic from "../../../components/ModalBasic";
import ModalBlank from "../../../components/ModalBlank";
import Dropzone from "react-dropzone";

function Decks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  {
    /* Deck Table */
  }
  const [decks, setDecks] = useState([]);
  const [headcount, setHeadcount] = useState(0);

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
    setFile(null);
  };

  const handleUpload = () => {
    if (file && description) {
      // edit file name to fileName

      let extension = file.name.split(".").pop();
      let formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("fileName", fileName.concat(".", extension));

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
          alert(res.data.success);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (fileName) => {
    window.confirm("Are you sure you want to delete this deck?") &&
      axios
        .delete(`/delete-deck/${fileName}`)
        .then((res) => {
          if (res.data.success) {
            setDecks(decks.filter((deck) => deck.name !== fileName));
            alert(res.data.success);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  useEffect(() => {
    if (file) {
      console.log(file);
    }
  }, [file]);

  useEffect(() => {
    if (file) {
      let extension = file.name.split(".").pop()[1];
    }
  }, [fileName]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get-decks")
      .then((res) => {
        setDecks(res.data.decks);
        setHeadcount(res.data.headcount[0].headcount);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [decks]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <LoadingOverlay active={loading} spinner={<FadeLoader />}>
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
                <table className="table-auto w-full dark:text-slate-300 divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Description</th>
                      <th className="px-6 py-3 text-left">Uploaded On</th>
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
                          <div className="text-sm text-slate-800 dark:text-slate-100">
                            {deck.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-800 dark:text-slate-100">
                            {new Date(deck.created_at).toLocaleDateString()}
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
                            onClick={() => handleDelete(deck.name)}
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
              <label
                htmlFor="file"
                className="text-sm font-medium text-gray-700"
              >
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
              <Dropzone
                onDrop={(acceptedFiles) => handleFile(acceptedFiles[0])}
              >
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
                        <p className="text-gray-500 text-center cursor-pointer">
                          Drag/Drop a file or{" "}
                          <span className="text-indigo-500">click here</span> to
                          browse
                        </p>
                        {/* allowed file types */}
                        <p className="text-gray-500 text-center mt-2 text-sm">
                          Allowed file types: {fileTypes.toString()}
                        </p>
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
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </button>
            </div>
          </ModalBasic>
        </LoadingOverlay>
      </div>
    </div>
  );
}

export default Decks;
