import React, { useState, useEffect } from "react";
import ModalBasic from "../../components/ModalBasic";
import ModalBlank from "../../components/ModalBlank";

function UsersTableItem(props) {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [checkboxState, setCheckboxState] = useState({
    brReportsUpload: false,
    brReportsCreate: false,
    decksUpload: false,
    decksView: false,
  });

  //reset modal returns the checkbox state to the initial state based on the props
  const resetModal = (key) => {

    setCheckboxState({
      brReportsUpload: users[key]["br_upload"],
      brReportsCreate: users[key]["br_create"],
      decksUpload: users[key]["deck_upload"],
      decksView: users[key]["deck_view"],
    });
  };

  const removeUser = () => {
    console.log("User removed");
    setRemoveUserModalOpen(false);
  };

  useEffect(() => {
    resetModal();
  }, [props.permissions]);

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
      case "Refunded":
        return "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    }
  };

  const typeIcon = (type) => {
    switch (type) {
      case "Subscription":
        return (
          <svg
            className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 shrink-0 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M4.3 4.5c1.9-1.9 5.1-1.9 7 0 .7.7 1.2 1.7 1.4 2.7l2-.3c-.2-1.5-.9-2.8-1.9-3.8C10.1.4 5.7.4 2.9 3.1L.7.9 0 7.3l6.4-.7-2.1-2.1zM15.6 8.7l-6.4.7 2.1 2.1c-1.9 1.9-5.1 1.9-7 0-.7-.7-1.2-1.7-1.4-2.7l-2 .3c.2 1.5.9 2.8 1.9 3.8 1.4 1.4 3.1 2 4.9 2 1.8 0 3.6-.7 4.9-2l2.2 2.2.8-6.4z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 shrink-0 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M11.4 0L10 1.4l2 2H8.4c-2.8 0-5 2.2-5 5V12l-2-2L0 11.4l3.7 3.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3l3.7-3.7L7.4 10l-2 2V8.4c0-1.7 1.3-3 3-3H12l-2 2 1.4 1.4 3.7-3.7c.4-.4.4-1 0-1.4L11.4 0z" />
          </svg>
        );
    }
  };

  return (
    <tbody className="text-sm">
      {/* Row */}
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center text-slate-800">
            <div className="font-medium text-sky-500">{props.email}</div>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div>{props.username}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-slate-800 dark:text-slate-100">
            {props.permissions.map((permission, index) => (
              <div key={index}>
                {index !== 0 && ""}
                {index === 1 && "Decks: "}
                {permission.join(", ")}
              </div>
            ))}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <button
            className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
            aria-controls="scrollbar-modal"
            onClick={(e) => {
              e.stopPropagation();
              setEditModalOpen(true);
            }}
          >
            Update Permissions
          </button>
          <ModalBasic
            id="update-permissions-modal"
            modalOpen={editModalOpen}
            setModalOpen={setEditModalOpen}
            title="Update Permissions"
            resetModal={resetModal}
          >
            {/* Modal content */}
            <div className="px-5 py-4">
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
                      checked={checkboxState.brReportsUpload}
                      onChange={(e) =>
                        setCheckboxState({
                          ...checkboxState,
                          brReportsUpload: e.target.checked,
                        })
                      }
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
                      checked={checkboxState.brReportsCreate}
                      onChange={(e) =>
                        setCheckboxState({
                          ...checkboxState,
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
                      checked={checkboxState.decksUpload}
                      onChange={(e) =>
                        setCheckboxState({
                          ...checkboxState,
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
                      checked={checkboxState.decksView}
                      onChange={(e) =>
                        setCheckboxState({
                          ...checkboxState,
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
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </ModalBlank>{" "}
          <button
            className="btn bg-rose-500 hover:bg-rose-600 text-white"
            aria-controls="remove-user-modal"
            onClick={(e) => {
              e.stopPropagation();
              setRemoveUserModalOpen(true);
            }}
          >
            Remove User
          </button>
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
        </td>
      </tr>
    </tbody>
  );
}

export default UsersTableItem;
