import React, { useState, useEffect } from "react";
import ModalBasic from "../../components/ModalBasic";
import { FileUploader } from "react-drag-drop-files";
import { set, subYears } from "date-fns";
import DropdownClassic from "../../components/DropdownClassic";
import upload from "../../icons/upload.svg";
import OldAccount from "./OldAccount";
import NewAccount from "./NewAccount";

function SearchResult({ SearchResults, handleUpload, handleCreate }) {
  /* Uploading Variables */
  const [showUploadMasterModal, setShowUploadMasterModal] = useState(false);
  const [showUploadUtilModal, setShowUploadUtilModal] = useState(false);
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(subYears(new Date(Date.now()), 4));
  const [yearList, setYearList] = useState([]);
  const [yearListUtil, setYearListUtil] = useState([]);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedYearUtil, setSelectedYearUtil] = useState(0);
  const [existingDataList, setExistingDataList] = useState([]);

  /* Create BR Report Variables */
  const [selectedAccount, setSelectedAccount] = useState("new");
  const [selectedData, setSelectedData] = useState([]);

  const fileTypes = ["xlsx", "xls", "csv"];

  // handling File Upload
  const handleFile = (file) => {
    setFile(file);
  };

  const handleFile2 = (file) => {
    setFile2(file);
  };

  // logic for resetting modal
  const resetModal = () => {
    setFile(null);
    setSelectedYear(0);
  };

  useEffect(() => {
    if (SearchResults) {
      setExistingDataList(SearchResults[0]);
      console.log(SearchResults);
      console.log(existingDataList);
      console.log(existingDataList?.masterlist);
      if (existingDataList?.masterlist) {
        Object.keys(existingDataList?.masterlist).map((key) => {
          console.log(existingDataList?.masterlist[key]);
        });
      }
    }
  }, [SearchResults]);

 
  // creating year list for uploading masterlist
  const createYearList = () => {
    let yearList = [];
    let yearPush = [];
    console.log(startDate.getFullYear());
    console.log(endDate.getFullYear());
    let gap =
      parseInt(startDate.getFullYear()) - parseInt(endDate.getFullYear());
    console.log(gap);
    for (let i = 0; i < gap; i++) {
      let value = `${startDate.getFullYear() - i - 1}-${(
        startDate.getFullYear() - i
      )
        .toString()
        .substring(2)}`;
      Object.keys(existingDataList?.masterlist).map((key) => {
        if (value === existingDataList.masterlist[key].year) {
          value = value + " (with data)";
        }
      });
      yearList.push(value);
    }
    for (let i = 0; i < yearList.length; i++) {
      yearPush.push({ id: i, value: yearList[i] });
    }

    setYearList(yearPush);
  };

  // creating year list for uploading utilization
  const createYearListUtil = () => {
    let yearList = [];
    let yearPush = [];
    console.log(startDate.getFullYear());
    console.log(endDate.getFullYear());
    let gap =
      parseInt(startDate.getFullYear()) - parseInt(endDate.getFullYear());
    console.log(gap);
    for (let i = 0; i < gap; i++) {
      let value = `${startDate.getFullYear() - i}`;
      Object.keys(existingDataList?.utilization).map((key) => {
        if (value === existingDataList.utilization[key].year) {
          value = value + " (with data)";
        }
      });
      yearList.push(value);
    }
    for (let i = 0; i < yearList.length; i++) {
      yearPush.push({ id: i, value: yearList[i] });
    }
    console.log(yearPush);
    setYearListUtil(yearPush);
  };

  // function to return insurer based on insurer_id
  const returnInsurer = (insurer) => {
    switch (insurer) {
      case 1:
        return "Medicard";
      case 2:
        return "Philcare";
      case 3:
        return "Maxicare";
      case 4:
        return "Intellicare";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-full border-b">
        {SearchResults && (
          <div className="justify-start px-8 grid grid-cols-2 ">
            <div>
              {" "}
              <h2 className="text-3xl font-bold text-slate-950">
                {existingDataList.client_name}
              </h2>
              <h3 className="text-2xl text-slate-800">
                {existingDataList.insurer_id &&
                  returnInsurer(existingDataList.insurer_id)}
              </h3>
              {existingDataList.description ? (
                <p className="text-lg text-slate-800 my-2">
                  {existingDataList.description}
                </p>
              ) : (
                <p className="text-lg text-slate-800 my-2">
                  No description available
                </p>
              )}
            </div>
            <div className="flex justify-end flex-row">
              <div className="grid grid-cols-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadMasterModal(true);
                    createYearList();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded h-14 mt-4 mx-6 w-36 "
                >
                  Upload Masterlist
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadUtilModal(true);
                    createYearListUtil();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded h-14 mt-4 w-36"
                >
                  Upload Utilization
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {SearchResults && (
        <div className="flex flex-col justify-center w-full border-b mt-6">
          <div className="justify-start grid grid-cols-5 mx-8">
            <div className=" col-span-5">
              <h2 className="text-2xl font-bold text-slate-950">
                Create BR Report
              </h2>
              <div className="flex flex-col my-6 justify-start">
                <div>
                  <h3 className="text-lg text-slate-800">Demographics</h3>
                  <p className="text-sm text-slate-800">
                    Select if you want to generate from a New or Old Account and
                    select the year and month to generate the BR report
                  </p>

                  <div className="flex flex-row items-center">
                    <button
                      className={` font-bold px-4 rounded h-10 mt-4 w-34 mr-4 ${
                        selectedAccount === "new"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => {
                        setSelectedAccount("new");
                      }}
                    >
                      New Account
                    </button>
                    <button
                      className={` font-bold px-4 rounded h-10 mt-4 w-34 mr-4 ${
                        selectedAccount === "old"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => {
                        setSelectedAccount("old");
                      }}
                    >
                      Old Account
                    </button>
                  </div>
                </div>
              </div>
              {(selectedAccount === "new" && existingDataList?.length !== 0) ?
              <NewAccount data={existingDataList}/> : (selectedAccount === "old" && existingDataList?.length !== 0) ? <OldAccount data={existingDataList}/> : null }
              
            </div>
          </div>
          <div className="mx-8 my-4 ">
            <h2 className="text-2xl font-bold text-slate-950 mb-4">
              Existing Data
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col justify-center align-middle text-center">
                <h2 className="text-lg font-bold text-slate-800">MasterList</h2>
                <table className="table-auto w-full mt-4">
                  <thead>
                    <tr>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                        Year
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                        Insurer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingDataList?.masterlist &&
                      Object.keys(existingDataList?.masterlist).map((key) => {
                        return (
                          <tr key={key}>
                            <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                              {existingDataList?.masterlist[key].year.substring(0,4)}
                            </td>
                            <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                              {existingDataList?.masterlist[key]?.insurer_id &&
                                returnInsurer(
                                  existingDataList?.masterlist[key]?.insurer_id
                                )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col justify-center align-middle text-center">
                <h2 className="text-lg font-bold text-slate-800">
                  Utilization
                </h2>
                <table className="table-auto w-full mt-4">
                  <thead>
                    <tr>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                        Year
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                        Months
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                        Insurer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {existingDataList?.utilization &&
                      Object.keys(existingDataList?.utilization).map((key) => {
                        return (
                          <tr key={key}>
                            <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                              {existingDataList?.utilization[key].year}
                            </td>
                            <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                              {existingDataList?.utilization[key].months}
                            </td>
                            <td className="border border-slate-200 dark:border-slate-700 px-4 py-2">
                              {existingDataList?.utilization[key]?.insurer_id &&
                                returnInsurer(
                                  existingDataList?.utilization[key]?.insurer_id
                                )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <ModalBasic
        title="Upload"
        modalOpen={showUploadMasterModal}
        setModalOpen={setShowUploadMasterModal}
        resetModal={resetModal}
      >
        <div className="flex flex-col items-center my-6 h-64">
          <div>
            <span>Select Year: </span>
            <DropdownClassic
              options={yearList}
              selected={selectedYear}
              setSelected={setSelectedYear}
            />
          </div>

          <div className="mt-6">
            <FileUploader
              handleChange={handleFile}
              types={fileTypes}
              name="file"
              classes="custom-data-uploader"
              required
              label="Upload/Drop a file right here"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const yearValue = yearList.find(
                  (year) => year.id === selectedYear
                );
                const hasData = yearValue.value.includes("with data");
                console.log(hasData);
                let submitYear = yearValue.value.split(" ")[0];

                handleUpload(
                  file,
                  submitYear,
                  existingDataList.insurer_id,
                  hasData,
                  existingDataList.id,
                  "masterlist"
                );
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded h-10"
            >
              Upload
            </button>
          </div>
        </div>
      </ModalBasic>
      <ModalBasic
        title="Upload"
        modalOpen={showUploadUtilModal}
        setModalOpen={setShowUploadUtilModal}
        resetModal={resetModal}
      >
        <div className="flex flex-col items-center my-6 h-64">
          <div>
            <span>Select Year: </span>
            <DropdownClassic
              options={yearListUtil}
              selected={selectedYearUtil}
              setSelected={setSelectedYearUtil}
            />
          </div>

          <div className="mt-6">
            <FileUploader
              handleChange={handleFile2}
              types={fileTypes}
              name="file"
              classes="custom-data-uploader"
              required
              label="Upload/Drop a file right here"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const yearValue = yearListUtil.find(
                  (year) => year.id === selectedYearUtil
                );
                const hasData = yearValue.value.includes("with data");
                console.log(hasData);
                let submitYear = yearValue.value.split(" ")[0];

                handleUpload(
                  file2,
                  submitYear,
                  existingDataList.insurer_id,
                  hasData,
                  existingDataList.id,
                  "utilization"
                );
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded h-10"
            >
              Upload
            </button>
          </div>
        </div>
      </ModalBasic>
    </>
  );
}

export default SearchResult;
