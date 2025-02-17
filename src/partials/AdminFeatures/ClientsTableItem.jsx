import React, { useState } from "react";

function ClientsTableItem(props) {
  const insurers = [
    "Philcare",
    "Maxicare",
    "Medicard",
    "Intellicare",
  ]
  return (
    <tbody className="text-sm">
      {/* Row */}
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="flex items-center text-slate-800">
            <div className="font-medium text-sky-500">{props.client}</div>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div>{props?.insurer === null ? "None" : insurers[props.insurer - 1]}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white" onClick={(e) => {
            e.stopPropagation();
            props.setSelectedData(props.id);
            props.setModalOpen(true)}}>
            Update Insurer
          </button>{" "}
        </td>
      </tr>
    </tbody>
  );
}

export default ClientsTableItem;
