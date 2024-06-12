import React, { useState, useEffect } from "react";
import DropdownClassic from "../../components/DropdownClassic";
import ModalBasic from "../../components/ModalBasic";
import { parse, set, subYears } from "date-fns";
import AddYear from "../../partials/userFeatures/AddYear";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function NewAccount({ data }) {
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [options4, setOptions4] = useState([]);
  const [selectedYearStart, setSelectedYearStart] = useState(0);
  const [selectedMonthStart, setSelectedMonthStart] = useState(0);
  const [selectedYearEnd, setSelectedYearEnd] = useState(0);
  const [selectedMonthEnd, setSelectedMonthEnd] = useState(0);
  const [selectedMasterlist, setSelectedMasterlist] = useState("");
  const [finalData, setFinalData] = useState({});
  const navigate = useNavigate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (data) {
      setOptions(getYearList());
    }
  }, [data]);

  const getYearList = () => {
    const yearList = [];
    Object.keys(data.utilization).map((key) => {
      yearList.push({ id: key, value: data.utilization[key].year });
    });
    console.log(yearList);
    return yearList;
  };

  const getMonths = (start, end) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startIndex = months.indexOf(start);
    const endIndex = months.indexOf(end);
    const monthList = [];
    for (let i = startIndex; i <= endIndex; i++) {
      monthList.push(months[i]);
    }
    return monthList;
  };

  const handleSetSelectedYearStart = (id) => {
    setSelectedYearStart(id);
    setSelectedMonthStart(0);
    setSelectedYearEnd(0);
    setSelectedMonthEnd(0);
    setOptions2([]);
    setOptions3([]);
    setOptions4([]);
    setSelectedMasterlist("");
    const startingMonth = data?.utilization[id].months.split("-")[0];
    const endingMonth = data?.utilization[id].months.split("-")[1];
    const months = getMonths(startingMonth, endingMonth);
    let monthsList = [];
    for (let i = 0; i < months.length; i++) {
      monthsList.push({ id: i, value: months[i] });
    }
    setOptions2(monthsList);
  };

  const handleSetSelectedMonthStart = (id) => {
    setSelectedMonthStart(id);
    setSelectedYearEnd(0);
    setSelectedMonthEnd(0);
    setOptions3([]);
    setOptions4([]);
    setSelectedMasterlist("");
    let yearList = [];
    let remainingYears = [];
    if (options2[id].value === options2[options2.length - 1].value) {
      remainingYears = options.slice(
        parseInt(selectedYearStart) + 1,
        parseInt(selectedYearStart) + 2
      );
      setOptions3([{ id: 0, value: remainingYears[0].value }]);
    } else {
      remainingYears = options.slice(
        parseInt(selectedYearStart),
        parseInt(selectedYearStart) + 2
      );
      Object.keys(remainingYears).map((key) => {
        yearList.push({ id: key, value: remainingYears[key].value });
      });
      setOptions3(yearList);
    }
  };

  const handleSetSelectedYearEnd = (id) => {
    setSelectedYearEnd(id);
    console.log(options3[id].value);
    setSelectedMonthEnd(0);
    setOptions4([]);
    setSelectedMasterlist("");
    let monthsList = [];
    let remainingMonths = [];
    if (options[selectedYearStart].value === options3[id].value) {
      remainingMonths = options2.slice(parseInt(selectedMonthStart) + 1);
      for (let i = 0; i < remainingMonths.length; i++) {
        monthsList.push({ id: i, value: remainingMonths[i].value });
      }
      setOptions4(monthsList);
    } else {
      const year = data.utilization.find(
        (year) => year.year === options3[id].value
      );
      const startingMonth = year.months.split("-")[0];
      const endingMonth = year.months.split("-")[1];
      remainingMonths = getMonths(startingMonth, endingMonth);
      for (let i = 0; i < remainingMonths.length; i++) {
        monthsList.push({ id: i, value: remainingMonths[i] });
      }
      setOptions4(monthsList);
    }
  };

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

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const lastday = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const handleSetSelectedMonthEnd = (id) => {
    let masterlist_name = "";
    setSelectedMonthEnd(id);
    console.log(data.masterlist);
    const masterlist = data.masterlist.find((masterlist) => {
      if (
        masterlist.year.substring(0, 4) === options[selectedYearStart].value
      ) {
        return masterlist;
      }
    });
    if (masterlist) {
      masterlist_name = `${
        masterlist.year.substring(0, 4) +
        " - " +
        returnInsurer(masterlist.insurer_id)
      }`;

      setSelectedMasterlist(masterlist_name);
    } else {
      masterlist_name = `${options[selectedYearStart].value} - None`;
      setSelectedMasterlist(masterlist_name);
    }

    let startDate = formatDate(
      new Date(
        `${options[selectedYearStart].value}-${options2[selectedMonthStart].value}-01`
      )
    );
    let endDate = formatDate(
      new Date(
        `${options3[selectedYearEnd].value}-${
          options4[id].value
        }-${lastday(
          options3[selectedYearEnd].value,
          months.indexOf(options4[id].value)
        )}`
      )
    );
    const masterlist_exist = (() => {
      if (masterlist_name.includes("None")) {
        return false;
      } else {
        return true;
      }
    })();
    masterlist_name = masterlist_name
      .substring(0, 4)
      .concat("-", parseInt(masterlist_name.substring(2, 4)) + 1);
    setFinalData({
      startDate: startDate,
      endDate: endDate,
      py: masterlist_name,
      client_id: data.id,
      insurer: returnInsurer(
        data["utilization"][selectedYearStart]["insurer_id"]
      ),
      masterlist: masterlist_exist,
    });
  };

  const handleCreate = () => {
    console.log(finalData);
    
    axios.post("/create-account-new", finalData).then((res) => {
      if (res.data.success) {
        alert("Reports created successfully");
        console.log(res.data.data);
        switch (res.data.insurer) {
          case "Intellicare": {
            navigate(`/user/intellicare-new`, {
              state: {
                data: res.data.data,
                py: res.data.py,
                client_name: res.data.client_name,
                client_id: res.data.client_id,
                start_date: res.data.start_date,
                end_date: res.data.end_date
              },
            });
          }
        }
      } else {
        alert(`${res.data.message} \n${res.data.error}`);
      }
    });
  };

  return (
    <div className="flex flex-row my-6">
      <div className="flex flex-col">
        <span className="text-sm font-bold">Starting Year</span>
        <DropdownClassic
          options={options}
          selected={selectedYearStart}
          setSelected={handleSetSelectedYearStart}
        />
      </div>
      <div className="flex flex-col mx-4">
        <span className="text-sm font-bold">Starting Month</span>
        <DropdownClassic
          options={options2}
          selected={selectedMonthStart}
          setSelected={handleSetSelectedMonthStart}
        />
      </div>
      <div className="flex flex-col mx-4">
        <span className="text-sm font-bold">Ending Year</span>
        <DropdownClassic
          options={options3}
          selected={selectedYearEnd}
          setSelected={handleSetSelectedYearEnd}
        />
      </div>
      <div className="flex flex-col mx-4">
        <span className="text-sm font-bold">Ending Month</span>
        <DropdownClassic
          options={options4}
          selected={selectedMonthEnd}
          setSelected={handleSetSelectedMonthEnd}
        />
      </div>
      <div className="flex flex-col mx-4 pointer-events-none cursor-not-allowed select-none">
        <span className="text-sm font-bold ">Masterlist</span>
        <input
          type="text"
          value={selectedMasterlist}
          className="bg-gray-200 rounded form-input disabled w-36"
        />
      </div>
      <div className="flex flex-col mx-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition ${
            selectedMasterlist === ""
              ? "cursor-not-allowed bg-slate-400 !text-slate-600"
              : "cursor-pointer"
          }`}
          onClick={handleCreate}
          disabled={selectedMasterlist === ""}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default NewAccount;
