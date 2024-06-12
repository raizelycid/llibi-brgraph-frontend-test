import React, { useEffect, useState } from "react";

import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import AdminsTable from "../../partials/AdminFeatures/AdminsTable";
import axios from "../../api/axios";
import LoadingOverlay from "react-loading-overlay-nextgen";
import FadeLoader from "react-spinners/FadeLoader";

import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";
import ModalBasic2 from "../../components/ModalBasic2";

function AdminManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(0);
  {
    /* Add Admin Modal */
  }
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    add: false,
    edit: false,
    remove: false,
  });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  {
    /* Edit User Modal */
  }
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [updateCheckboxState, setUpdateCheckboxState] = useState({
    add: false,
    edit: false,
    remove: false,
  });

  {
    /* Delete User Modal */
  }
  const [removeAdminModalOpen, setRemoveAdminModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get-admins")
      .then((res) => {
        console.log(res?.data?.data);
        setAdminCount(res?.data?.data["data1"][0]["headcount"]);
        setAdmins(res?.data?.data["data2"]);
      })
      .catch((err) => {
        console.log(err);
      })
    axios
      .get("/get-users")
      .then((res) => {
        setUsers(res.data.data["data2"]);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    if(admins.length > 0 && users.length > 0) {
      setLoading(false);
    }
  }, [admins, users]);

  const permissions = (add, edit, remove) => {
    let permission = "";
    if (add) {
      permission += "Add ";
    }
    if (edit) {
      permission += "Edit ";
    }
    if (remove) {
      permission += "Remove";
    }
    // replace spaces with space and comma
    if (permission.split(" ").length > 1 && permission.split(" ")[1] !== "") {
      let temp = permission.split(" ").filter((item) => item !== "");
      if (temp.length === 2) {
        permission = temp[0] + ", " + temp[1];
      } else if (temp.length === 3) {
        permission = temp[0] + ", " + temp[1] + ", " + temp[2];
      } else {
        permission = temp[0];
      }
    }
    return permission;
  };

  const resetModal = () => {
    setEmail("");
    setCheckboxState({
      add: false,
      edit: false,
      remove: false,
    });
    setAddAdminModalOpen(false);
  };

  const addAdmin = () => {
    setLoading(true);
    console.log(email, checkboxState);
    let find = users.find((user) => user.email === email);
    if (find) {
      axios
        .post("/add-admin", {
          id: find.id,
          user_admin: true,
          a: checkboxState.add,
          e: checkboxState.edit,
          r: checkboxState.remove,
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setSuccessModalOpen(true);
            resetModal();
            setAdmins([
              ...admins,
              {
                email: email,
                username: find.username,
                can_add: checkboxState.add,
                can_edit: checkboxState.edit,
                can_remove: checkboxState.remove,
              },
            ]);
            setAdminCount(adminCount + 1);
          } else {
            setErrorModalOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorModalOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert("User not found");
      setLoading(false);
    }
  };

  const resetModalEdit = () => {
    console.log("start loading");
    setLoading(true);
    setUpdateCheckboxState({
      add: admins[selectedKey]["can_add"],
      edit: admins[selectedKey]["can_edit"],
      remove: admins[selectedKey]["can_remove"],
    });
  };

  useEffect(() => {
    console.log("end loading");
    setLoading(false);
  }, [updateCheckboxState]);

  const editAdmin = () => {
    setLoading(true);
    axios
      .post("/update-admin", {
        id: users[selectedKey].id,
        a: updateCheckboxState.add,
        e: updateCheckboxState.edit,
        r: updateCheckboxState.remove,
      })
      .then((res) => {
        if (res.data.success) {
          setAdmins(
            admins.map((item, key) => {
              if (key === selectedKey) {
                return {
                  ...item,
                  can_add: updateCheckboxState.add,
                  can_edit: updateCheckboxState.edit,
                  can_remove: updateCheckboxState.remove,
                };
              }
              return item;
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeAdmin = () => {
    setLoading(true);
    axios
      .post("/delete-admin", { id: admins[selectedKey]["id"] })
      .then((res) => {
        if (res.data.success) {
          setAdmins(admins.filter((item, key) => key !== selectedKey));
          setAdminCount(adminCount - 1);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    setRemoveAdminModalOpen(false);
  }

  const removeAdminModal = () => {
    setDeleteConfirmation("");
  }

  useEffect(() => {
    if (admins.length > 0) resetModalEdit();
  }, [selectedKey]);

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
                    Admin Management
                  </h1>
                </div>
                {/* Right: Actions */}
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <button
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={() => setAddAdminModalOpen(true)}
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Add Admin</span>
                  </button>
                </div>
              </div>
              {/*Table */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
                <header className="px-5 py-4 flex justify-between">
                  <h2 className="font-semibold text-slate-800 dark:text-slate-100 self-center">
                    All Admin{" "}
                    <span className="text-slate-800 dark:text-slate-500 font-medium text-base">
                      {adminCount}
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
                      {admins.map((item, key) => {
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
                                  item.can_add,
                                  item.can_edit,
                                  item.can_remove
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
                                  setRemoveAdminModalOpen(true);
                                }}
                              >
                                Remove Admin
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
          <ModalBasic
            id="add-user-modal"
            modalOpen={addAdminModalOpen}
            setModalOpen={setAddAdminModalOpen}
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
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="adminPermissions"
                    >
                      Admin Permissions
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <label className="inline-flex items-center">
                        <input
                          id="add"
                          checked={checkboxState.add}
                          className="form-checkbox"
                          type="checkbox"
                          onChange={(e) =>
                            setCheckboxState({
                              ...checkboxState,
                              add: e.target.checked,
                            })
                          }
                        />
                        <span className="text-sm text-slate-800 mx-2">
                          Add Users
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          id="edit"
                          className="form-checkbox"
                          type="checkbox"
                          checked={checkboxState.edit}
                          onChange={(e) =>
                            setCheckboxState({
                              ...checkboxState,
                              edit: e.target.checked,
                            })
                          }
                        />
                        <span className="text-sm text-slate-800 mx-2">
                          Edit User Permissions
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          id="remove"
                          checked={checkboxState.remove}
                          className="form-checkbox"
                          type="checkbox"
                          onChange={(e) =>
                            setCheckboxState({
                              ...checkboxState,
                              remove: e.target.checked,
                            })
                          }
                        />
                        <span className="text-sm text-slate-800 mx-2">
                          Remove Users
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
                    setAddAdminModalOpen(false);
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
                            <span className="font-semibold">{email}</span> as a
                            new admin with the following permissions?
                          </span>
                          <div className="flex flex-col my-6">
                            <div className="text-slate-800 dark:text-slate-100">
                              <p className="font-semibold">
                                Add Users:{" "}
                                {checkboxState.add ? "Granted" : "Not Granted"}
                              </p>
                              <p className="font-semibold">
                                Edit User Permissions:{" "}
                                {checkboxState.edit ? "Granted" : "Not Granted"}
                              </p>
                              <p className="font-semibold">
                                Remove Users:{" "}
                                {checkboxState.remove
                                  ? "Granted"
                                  : "Not Granted"}
                              </p>
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
                          onClick={addAdmin}
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
              <div className="text-sm">The user is now added as an admin.</div>
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
                An error occurred while adding the admin.
              </div>
            </div>
          </ModalBlank>
          <ModalBasic
            id="update-permissions-modal"
            modalOpen={editModalOpen}
            setModalOpen={setEditModalOpen}
            title="Update Permissions"
            resetModal={resetModalEdit}
          >
            <div className="px-5 py-4">
              <div className="space-y-2">
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      Permissions
                    </div>
                  </div>
                </div>
                {/* Permissions */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="add"
                      name="addUsers"
                      checked={
                        admins.length > 0 ? updateCheckboxState.add : false
                      }
                      onChange={(e) => {
                        setUpdateCheckboxState({
                          ...updateCheckboxState,
                          add: e.target.checked,
                        });
                      }}
                      className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                    />
                    <label
                      htmlFor="addUsers"
                      className="text-slate-800 dark:text-slate-100"
                    >
                      Add Users
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit"
                      name="editUsers"
                      checked={
                        users.length > 0 ? updateCheckboxState.edit : false
                      }
                      onChange={(e) =>
                        setUpdateCheckboxState({
                          ...updateCheckboxState,
                          edit: e.target.checked,
                        })
                      }
                      className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                    />
                    <label
                      htmlFor="editUsers"
                      className="text-slate-800 dark:text-slate-100"
                    >
                      Edit User Permissions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remove"
                      name="removeUsers"
                      checked={
                        users.length > 0 ? updateCheckboxState.remove : false
                      }
                      onChange={(e) =>
                        setUpdateCheckboxState({
                          ...updateCheckboxState,
                          remove: e.target.checked,
                        })
                      }
                      className="w-4 h-4 border border-slate-200 dark:border-slate-700 rounded"
                    />
                    <label
                      htmlFor="removeUsers"
                      className="text-slate-800 dark:text-slate-100"
                    >
                      Remove Users
                    </label>
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
          </ModalBasic>
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
                      editAdmin();
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
            modalOpen={removeAdminModalOpen}
            setModalOpen={setRemoveAdminModalOpen}
            resetModal={removeAdminModal}
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
                    Remove Admin?
                  </div>
                </div>
                {/* Modal content */}
                <div className="text-sm mb-10">
                  <div className="space-y-2">
                    <p>Type "REMOVE ADMIN" to confirm.</p>
                    <input
                      type="text"
                      className="form-input w-full"
                      placeholder="REMOVE ADMIN"
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      value={deleteConfirmation}
                    />
                  </div>
                </div>
                {/* Modal footer */}
                <div className="flex flex-wrap justify-end space-x-2">
                  <button
                    className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRemoveAdminModalOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                    disabled={deleteConfirmation !== "REMOVE ADMIN"}
                    onClick={removeAdmin}
                  >
                    Yes, Remove Admin
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>
        </LoadingOverlay>
      </div>
    </div>
  );
}

export default AdminManagement;
