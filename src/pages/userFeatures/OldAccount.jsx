import React, { useState, useEffect, useRef } from "react";
import DropdownClassic from "../../components/DropdownClassic";
import ModalBasic from "../../components/ModalBasic";
import { set, subYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import AddDate from "./AddDate";
import axios from "../../api/axios";

function OldAccount({ data }) {
  const [options, setOptions] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const showData = () => {
    console.log(data);
  };

  useEffect(()=>{
    console.log(finalData)
  },[finalData])

  const clearData2 = () => {
    return new Promise((resolve,reject) => {
      setData2([])
      resolve();
    })
  }
  const clearData3 = () => {
    return new Promise((resolve, reject) => {
      setData3([]);
      resolve();
    });
  };
  const clearData4 = () => {
  };

  const handleCreate = () => {
    console.log(finalData);
    if(finalData.length === 2){
      axios.post('/create-account-old',finalData).then((res) => {
        if (res.data.success){
          
          alert('Report Created')
          switch (finalData[finalData.length - 1]["insurer"]) {
            case "Intellicare": {
              navigate('/user/intellicare-old', { state: { data: res.data.data, py: res.data.py, client_name: res.data.client_name, client_id: res.data.client_id, date_start: res.data.date_start, date_end: res.data.date_end} });
            }
        }
        
      }
      else{
        alert('Failed to create report')
      }
    })
    }
  };

  return (
    <div className="grid grid-cols-4 my-6">
      <div
        className={`border-r-2 flex flex-col items-center transition ${
          finalData?.length > 0 ? "bg-green-300" : "bg-slate-300"
        }`}
      >
        <AddDate
          data={data}
          setData={setData2}
          clearData={clearData2}
          nominal={1}
          finalData={finalData}
          setFinalData={setFinalData}
        />
      </div>
      <div
        className={`border-r-2 flex flex-col items-center transition ${
          finalData?.length > 1 ? "bg-green-300" : "bg-slate-300"
        }`}
      >
        <AddDate
          data={Object.keys(data2).length > 0 ? data2 : null}
          setData={setData3}
          clearData={clearData3}
          nominal={2}
          finalData={finalData}
          setFinalData={setFinalData}
        />
      </div>
      <div
        className={`border-r-2 flex flex-col items-center transition ${
          finalData?.length > 2 ? "bg-green-300" : "bg-slate-300"
        }`}
      >
        <AddDate
          data={Object.keys(data3).length > 0 ? data3 : null}
          setData={setData3}
          clearData={clearData4}
          nominal={3}
          finalData={finalData}
          setFinalData={setFinalData}
        />
      </div>
      <div className="border-r-2 flex flex-col items-center justify-center">
        {finalData.map((item) => {
          console.log(item.length);
          return (
            <>
              <h3 className="text-base text-center my-2">
                {item.startDate}, {item.endDate}, {item.py}
              </h3>
            </>
          );
        })}
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition ${
            finalData.length <= 1
              ? "bg-slate-300 text-white p-2 rounded-md my-2"
              : null
          }`}
          onClick={handleCreate}
          disabled={finalData.length <= 1}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default OldAccount;
