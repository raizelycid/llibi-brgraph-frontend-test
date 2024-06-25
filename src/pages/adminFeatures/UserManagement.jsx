import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import axios2 from "axios";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import UsersTable from "../../partials/AdminFeatures/UsersTable";
import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";
import ModalBasic2 from "../../components/ModalBasic2";

import LoadingOverlay from "react-loading-overlay-nextgen";
import FadeLoader from "react-spinners/FadeLoader";

function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");
  {
    /* Add User Modal */
  }
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    brReportsUpload: false,
    brReportsCreate: false,
    decksUpload: false,
    decksView: false,
  });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  {
    /* Edit User Modal */
  }
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [updateCheckboxState, setUpdateCheckboxState] = useState({
    brReportsUpload: false,
    brReportsCreate: false,
    decksUpload: false,
    decksView: false,
  });
  const [selectedKey, setSelectedKey] = useState(0);
  const [refreshCheckbox, setRefreshCheckbox] = useState(false);

  {
    /* Delete User Modal */
  }
  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [text, setText] = useState("");

  {
    /* Table Header and Contents */
  }
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);

  const resetModal = () => {
    setEmail("");
    setCheckboxState({
      brReportsUpload: false,
      brReportsCreate: false,
      decksUpload: false,
      decksView: false,
    });
    setAddUserModalOpen(false);
  };

  const addUser = () => {
    axios
      .post(`/add-user`, {
        email: email,
        br_upload: checkboxState.brReportsUpload,
        br_create: checkboxState.brReportsCreate,
        deck_upload: checkboxState.decksUpload,
        deck_view: checkboxState.decksView,
      })
      .then((response) => {
        setAddUserModalOpen(false);
        setInfoModalOpen(false);
        setSuccessModalOpen(true);
      })
      .catch((error) => {
        setAddUserModalOpen(false);
        setInfoModalOpen(false);
        setErrorModalOpen(true);
      });
  };

  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    axios2
      .get("https://portal.llibi.app/server/api/healthdash/emails")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("done");
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get-users")
      .then((res) => {
        if (res.data.success) {
          setUserCount(res.data.data["data1"][0]["headcount"]);
          setUsers(res.data.data["data2"]);
        } else {
          console.log("not done");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (users.length > 0) resetModalEdit();
  }, [selectedKey]);

  const permissions = (upload1, create, upload2, view) => {
    let permission = "";
    if (upload1 || create) {
      permission = permission.concat("BR: ");
    }
    if (upload1) {
      permission = permission.concat("Upload ");
    }
    if (create) {
      permission = permission.concat("Create ");
    }
    if (upload1 || create) {
      permission = permission.concat("\n");
    }
    if (upload2 || view) {
      permission = permission.concat("Decks: ");
    }
    if (upload2) {
      permission = permission.concat("Upload ");
    }
    if (view) {
      permission = permission.concat("View ");
    }
    return permission;
  };

  const resetModalEdit = () => {
    console.log("start loading");
    setLoading2(true);
    setUpdateCheckboxState({
      brReportsUpload: users[selectedKey]["br_upload"],
      brReportsCreate: users[selectedKey]["br_create"],
      decksUpload: users[selectedKey]["deck_upload"],
      decksView: users[selectedKey]["deck_view"],
    });
  };

  useEffect(() => {
    console.log("end loading");
    setLoading2(false);
  }, [updateCheckboxState]);

  const handleEditUser = () => {
    console.log(users[selectedKey]["id"], updateCheckboxState);
    axios
      .post(`/update-user`, {
        id: users[selectedKey]["id"],
        br1: updateCheckboxState.brReportsUpload,
        br2: updateCheckboxState.brReportsCreate,
        deck1: updateCheckboxState.decksUpload,
        deck2: updateCheckboxState.decksView,
      })
      .then((res) => {
        if (res.data.success) {
          alert("User permissions updated successfully");
          setUsers((prev) => {
            let temp = [...prev];
            temp[selectedKey] = {
              ...temp[selectedKey],
              br_upload: updateCheckboxState.brReportsUpload,
              br_create: updateCheckboxState.brReportsCreate,
              deck_upload: updateCheckboxState.decksUpload,
              deck_view: updateCheckboxState.decksView,
            };
            return temp;
          });
        } else {
          alert("An error occurred while updating user permissions");
        }
      });
  };

  const removeUser = () => {
    setLoading(true);
    axios
      .post("/delete-user", { id: users[selectedKey]["id"] })
      .then((res) => {
        if (res.data.success) {
          alert("User removed successfully");
          setUsers((prev) => {
            let temp = [...prev];
            temp.splice(selectedKey, 1);
            return temp;
          });
        } else {
          alert("An error occurred while removing the user");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    setRemoveUserModalOpen(false);
  };

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
              {/* Page header */}
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                {/* Left: Title */}
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                    User Management
                  </h1>
                </div>
                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <button
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    aria-controls="scrollbar-modal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddUserModalOpen(true);
                    }}
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Add User</span>
                  </button>
                  <ModalBasic
                    id="add-user-modal"
                    modalOpen={addUserModalOpen}
                    setModalOpen={setAddUserModalOpen}
                    title="Add User"
                    resetModal={resetModal}
                  >
                    {/* Modal content */}
                    <div className="px-5 py-4">
                      <div className="space-y-2">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="mandatory"
                        >
                          Input Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="email"
                          value={email}
                          className="form-input w-full"
                          type="text"
                          placeholder="ex. johndoe@llibi.com"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className=" py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex justify-between items-center">
                            <div className="font-semibold text-slate-800 dark:text-slate-100">
                              Permissions
                            </div>
                          </div>
                        </div>
                        {/* Permissions */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="brReports"
                            >
                              BR Reports
                            </label>
                            <div className="flex flex-col">
                              <label className="inline-flex items-center">
                                <input
                                  id="brReportsUpload"
                                  checked={checkboxState.brReportsUpload}
                                  className="form-checkbox"
                                  type="checkbox"
                                  onChange={(e) =>
                                    setCheckboxState({
                                      ...checkboxState,
                                      brReportsUpload: e.target.checked,
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-800 mx-2">
                                  Upload
                                </span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  id="brReportsCreate"
                                  className="form-checkbox"
                                  type="checkbox"
                                  checked={checkboxState.brReportsCreate}
                                  onChange={(e) =>
                                    setCheckboxState({
                                      ...checkboxState,
                                      brReportsCreate: e.target.checked,
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-800 mx-2">
                                  Create
                                </span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="decks"
                            >
                              Decks
                            </label>
                            <div className="flex flex-col">
                              <label className="inline-flex items-center">
                                <input
                                  id="decksUpload"
                                  className="form-checkbox"
                                  type="checkbox"
                                  checked={checkboxState.decksUpload}
                                  onChange={(e) =>
                                    setCheckboxState({
                                      ...checkboxState,
                                      decksUpload: e.target.checked,
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-800 mx-2">
                                  Upload
                                </span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  id="decksView"
                                  className="form-checkbox"
                                  type="checkbox"
                                  checked={checkboxState.decksView}
                                  onChange={(e) =>
                                    setCheckboxState({
                                      ...checkboxState,
                                      decksView: e.target.checked,
                                    })
                                  }
                                />
                                <span className="text-sm text-slate-800 mx-2">
                                  View
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Modal footer */}
                    <div className="sticky bottom-0 px-5 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap justify-end space-x-2">
                        <button
                          className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddUserModalOpen(false);
                            resetModal();
                          }}
                        >
                          Close
                        </button>
                        <button
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                          aria-controls="info-modal"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInfoModalOpen(true);
                          }}
                        >
                          Add User
                        </button>
                        <ModalBlank
                          id="info-modal"
                          modalOpen={infoModalOpen}
                          setModalOpen={setInfoModalOpen}
                        >
                          <div className="p-5 flex space-x-4">
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-500/30">
                              <svg
                                className="w-4 h-4 shrink-0 fill-current text-indigo-500"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
                              </svg>
                            </div>
                            {/* Content */}
                            <div>
                              {/* Modal header */}
                              <div className="mb-2">
                                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                  Confirmation
                                </div>
                              </div>
                              {/* Modal content */}
                              <div className="text-sm mb-10">
                                <div className="space-y-2">
                                  <span className="text-slate-800 dark:text-slate-100">
                                    Are you sure you want to add{" "}
                                    <span className="font-semibold">
                                      {email}
                                    </span>{" "}
                                    as a new user with the following
                                    permissions?
                                  </span>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-slate-800 dark:text-slate-100">
                                        BR Reports
                                      </div>
                                      <div className="text-slate-800 dark:text-slate-100">
                                        <p className="font-semibold">
                                          Upload:{" "}
                                          {checkboxState.brReportsUpload
                                            ? "Granted"
                                            : "Not Granted"}
                                        </p>
                                        <p className="font-semibold">
                                          Create:{" "}
                                          {checkboxState.brReportsCreate
                                            ? "Granted"
                                            : "Not Granted"}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-slate-800 dark:text-slate-100">
                                        Decks
                                      </div>
                                      <div className="text-slate-800 dark:text-slate-100">
                                        <p className="font-semibold">
                                          Upload:{" "}
                                          {checkboxState.decksUpload
                                            ? "Granted"
                                            : "Not Granted"}
                                        </p>
                                        <p className="font-semibold">
                                          View:{" "}
                                          {checkboxState.decksView
                                            ? "Granted"
                                            : "Not Granted"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Modal footer */}
                              <div className="flex flex-wrap justify-end space-x-2">
                                <button
                                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setInfoModalOpen(false);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                  onClick={addUser}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        </ModalBlank>
                      </div>
                    </div>
                  </ModalBasic>
                  <ModalBlank
                    id="success-modal"
                    modalOpen={successModalOpen}
                    setModalOpen={setSuccessModalOpen}
                  >
                    <div className="p-5">
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Success
                      </div>
                      <div className="text-sm">
                        A registration mail was sent to the user.
                      </div>
                    </div>
                  </ModalBlank>

                  <ModalBlank
                    id="error-modal"
                    modalOpen={errorModalOpen}
                    setModalOpen={setErrorModalOpen}
                  >
                    <div className="p-5">
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Error
                      </div>
                      <div className="text-sm">
                        An error occurred while adding the user.
                      </div>
                    </div>
                  </ModalBlank>
                </div>
              </div>
              {/*Table */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-4 flex justify-between">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100 self-center">
                    All Users{" "}
                    <span className="text-slate-800 dark:text-slate-500 font-medium text-base">
                      {userCount}
                    </span>
                  </h2>
                  <div className="relative">
                    <input
                      id="form-search"
                      className="form-input w-full pl-9"
                      type="search"
                      placeholder="Search User..."
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
                    {/* Table header */}
                    <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-semibold text-center">Email</div>
                        </th>
                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Username
                          </div>
                        </th>
                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Permissions
                          </div>
                        </th>
                        <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-semibold text-left">Actions</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item, key) => {
                        return (
                          <tr
                            className="border-b-2 first:pl-5 px-2 last:pr-5 "
                            key={key}
                          >
                            <td className=" text-center">{item.email}</td>
                            <td className=" text-center">{item.username}</td>
                            <td className=" text-center">
                              <pre className="text-lg">
                                {permissions(
                                  item.br_upload,
                                  item.br_create,
                                  item.deck_upload,
                                  item.deck_view
                                )}
                              </pre>
                            </td>
                            <td>
                              <button
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                aria-controls="scrollbar-modal"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedKey(key);
                                  setEditModalOpen(true);
                                  resetModalEdit();
                                }}
                              >
                                Update Permissions
                              </button>
                              {"    "}
                              <button
                                className="btn bg-rose-500 hover:bg-rose-600 text-white"
                                aria-controls="remove-user-modal"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedKey(key);
                                  setRemoveUserModalOpen(true);
                                }}
                              >
                                Remove User
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </LoadingOverlay>
      </div>
      <ModalBasic2
        id="update-permissions-modal"
        modalOpen={editModalOpen}
        setModalOpen={setEditModalOpen}
        title="Update Permissions"
        resetModal={resetModalEdit}
      >
        <div className="px-5 py-4">
          <LoadingOverlay active={loading2} spinner={<FadeLoader />}>
            <div className="space-y-2">
              <div className="py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    Permissions
                  </div>
                </div>
              </div>
              {/* Permissions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="brReportsUpload"
                    name="brReportsUpload"
                    checked={
                      users.length > 0
                        ? updateCheckboxState["brReportsUpload"]
                        : false
                    }
                    onChange={(e) => {
                      setUpdateCheckboxState({
                        ...updateCheckboxState,
                        brReportsUpload: e.target.checked,
                      });
                    }}
                    className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                  />
                  <label
                    htmlFor="brReportsUpload"
                    className="text-slate-800 dark:text-slate-100"
                  >
                    Upload BR Reports
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="brReportsCreate"
                    name="brReportsCreate"
                    checked={
                      users.length > 0
                        ? updateCheckboxState["brReportsCreate"]
                        : false
                    }
                    onChange={(e) =>
                      setUpdateCheckboxState({
                        ...updateCheckboxState,
                        brReportsCreate: e.target.checked,
                      })
                    }
                    className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                  />
                  <label
                    htmlFor="brReportsCreate"
                    className="text-slate-800 dark:text-slate-100"
                  >
                    Create BR Reports
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="decksUpload"
                    name="decksUpload"
                    checked={
                      users.length > 0
                        ? updateCheckboxState["decksUpload"]
                        : false
                    }
                    onChange={(e) =>
                      setUpdateCheckboxState({
                        ...updateCheckboxState,
                        decksUpload: e.target.checked,
                      })
                    }
                    className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                  />
                  <label
                    htmlFor="decksUpload"
                    className="text-slate-800 dark:text-slate-100"
                  >
                    Upload Decks
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="decksView"
                    name="decksView"
                    checked={
                      users.length > 0
                        ? updateCheckboxState["decksView"]
                        : false
                    }
                    onChange={(e) =>
                      setUpdateCheckboxState({
                        ...updateCheckboxState,
                        decksView: e.target.checked,
                      })
                    }
                    className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                  />
                  <label
                    htmlFor="decksView"
                    className="text-slate-800 dark:text-slate-100"
                  >
                    View Decks
                  </label>
                </div>
              </div>
            </div>
          </LoadingOverlay>
        </div>

        {/* Modal footer */}
        <div className="sticky bottom-0 px-5 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(false);
                resetModal();
              }}
            >
              Cancel
            </button>
            <button
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
              aria-controls="info-modal"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmEditModalOpen(true);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </ModalBasic2>
      <ModalBlank
        id="info-modal"
        modalOpen={confirmEditModalOpen}
        setModalOpen={setConfirmEditModalOpen}
      >
        <div className="p-5 flex space-x-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-500/30">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
            </svg>
          </div>
          {/* Content */}
          <div>
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Confirmation
              </div>
            </div>
            {/* Modal content */}
            <div className="text-sm mb-10">
              <div className="space-y-2">
                <span className="text-slate-800 dark:text-slate-100">
                  Are you sure you want to update the permissions?
                </span>
                {/* ... */}
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmEditModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmEditModalOpen(false);
                  setEditModalOpen(false);
                  handleEditUser();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
      <ModalBlank
        id="remove-user-modal"
        modalOpen={removeUserModalOpen}
        setModalOpen={setRemoveUserModalOpen}
      >
        <div className="p-5 flex space-x-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-rose-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          {/* Content */}
          <div>
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Remove User?
              </div>
            </div>
            {/* Modal content */}
            <div className="text-sm mb-10">
              <div className="space-y-2">
                <p>Type "DELETE USER" to confirm.</p>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="DELETE USER"
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setRemoveUserModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                disabled={deleteConfirmation !== "DELETE USER"}
                onClick={removeUser}
              >
                Yes, Remove User
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
}

export default UserManagement;
