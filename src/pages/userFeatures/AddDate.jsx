import React, { useEffect, useState } from "react";
import DropdownClassic from "../../components/DropdownClassic";

function AddDate({
  data,
  setData,
  clearData,
  nominal,
  finalData,
  setFinalData,
}) {
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [options4, setOptions4] = useState([]);
  const [selectedYearStart, setSelectedYearStart] = useState(0);
  const [selectedMonthStart, setSelectedMonthStart] = useState(0);
  const [selectedYearEnd, setSelectedYearEnd] = useState(0);
  const [selectedMonthEnd, setSelectedMonthEnd] = useState(0);
  const [selectedMasterlist, setSelectedMasterlist] = useState("");
  const [selectedData, setselectedData] = useState({});
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
    } else {
      setSelectedYearStart(0);
      setSelectedMonthStart(0);
      setSelectedYearEnd(0);
      setSelectedMonthEnd(0);
      setOptions([]);
      setOptions2([]);
      setOptions3([]);
      setOptions4([]);
      setSelectedMasterlist("");
    }
  }, [data]);

  function ordinal_suffix_of(i) {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  const getYearList = () => {
    const yearList = [];
    Object.keys(data.utilization).map((key) => {
      yearList.push({ id: key, value: data.utilization[key].year });
    });
    return yearList;
  };

  const getMonths = (start, end) => {
    const startIndex = months.indexOf(start);
    const endIndex = months.indexOf(end);
    const monthList = [];
    for (let i = startIndex; i <= endIndex; i++) {
      monthList.push(months[i]);
    }
    return monthList;
  };

  const handleSetSelectedYearStart = (id) => {
    clearData();
    setSelectedYearStart(id);
    setSelectedMonthStart(0);
    setSelectedYearEnd(0);
    setSelectedMonthEnd(0);
    setOptions2([]);
    setOptions3([]);
    setOptions4([]);
    setSelectedMasterlist("");
    resetFinalData();
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
    clearData();
    setSelectedMonthStart(id);
    setSelectedYearEnd(0);
    setSelectedMonthEnd(0);
    setOptions3([]);
    setOptions4([]);
    setSelectedMasterlist("");
    let yearList = [];
    let remainingYears = [];
    resetFinalData();
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
    setSelectedMonthEnd(0);
    setOptions4([]);
    setSelectedMasterlist("");
    let monthsList = [];
    let remainingMonths = [];
    resetFinalData();
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

  const lastday = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const handleSetSelectedMonthEnd = (id) => {
    let masterlist_name = "";
    console.log(id, options4);
    resetFinalData();
    setSelectedMonthEnd(id);

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
        `${options3[selectedYearEnd].value}-${options4[id].value}-${lastday(
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

    setselectedData({
      startDate: startDate,
      endDate: endDate,
      py: masterlist_name,
      client_id: data["id"],
      insurer: returnInsurer(
        data["utilization"][selectedYearStart]["insurer_id"]
      ),
      masterlist: masterlist_exist,
    });
  };

  useEffect(() => {
    if (options4.length > 0 && options3.length > 0 && nominal !== 3) {
      const index = data["utilization"].findIndex(
        (item) => item["year"] == options3[selectedYearEnd].value
      );
      if (index !== -1) {
        if (selectedMonthEnd === options4.length - 1) {
          let temp = structuredClone(data["utilization"].slice(index) + 1);
          const nextData = structuredClone(data);
          nextData["utilization"] = temp;
          setData(nextData);
        } else {
          let temp = structuredClone(data["utilization"].slice(index));
          const newDate = sliceDate(temp[0].months);
          temp[0].months = newDate;
          const nextData = structuredClone(data);
          nextData["utilization"] = temp;
          setData(nextData);
        }
      }
    }
  }, [selectedMonthEnd, selectedYearEnd]);

  useEffect(() => {
    if (options4.length > 0 && options3.length > 0) {
      setFinalData((prev) => [...prev, selectedData]);
    }
  }, [selectedData]);

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

  function resetFinalData() {
    return new Promise((resolve, reject) => {
      if (nominal === 1) {
        setFinalData([]);
        resolve(); // Resolve the promise when finished
      } else if (nominal === 2) {
        setFinalData(finalData.slice(0, 1));
        resolve(); // Resolve the promise when finished
      } else {
        setFinalData(finalData.slice(0, 2));
        resolve(); // Resolve the promise when finished
      }
    });
  }

  function sliceDate(date) {
    const nextMonth =
      months[months.indexOf(options4[selectedMonthEnd].value) + 1];
    return date.replace(date.substring(0, 3), nextMonth);
  }

  return (
    <>
      <div className="my-2 flex flex-col">
        <h3 className="text-base font-semibold">
          {ordinal_suffix_of(nominal)} Year
        </h3>
        <DropdownClassic
          label="Year Start"
          options={options}
          selected={selectedYearStart}
          setSelected={handleSetSelectedYearStart}
        />
      </div>
      <div className="my-2 flex flex-col">
        <h3 className="text-base font-semibold">
          {ordinal_suffix_of(nominal)} Starting Month
        </h3>
        <DropdownClassic
          label="Month Start"
          options={options2}
          selected={selectedMonthStart}
          setSelected={handleSetSelectedMonthStart}
        />
      </div>
      <div className="my-2 flex flex-col">
        <h3 className="text-base font-semibold">
          {ordinal_suffix_of(nominal)} Ending Year
        </h3>
        <DropdownClassic
          label="Year End"
          options={options3}
          selected={selectedYearEnd}
          setSelected={handleSetSelectedYearEnd}
        />
      </div>
      <div className="my-2 flex flex-col">
        <h3 className="text-base font-semibold">
          {ordinal_suffix_of(nominal)} Ending Month
        </h3>
        <DropdownClassic
          label="Month End"
          options={options4}
          selected={selectedMonthEnd}
          setSelected={handleSetSelectedMonthEnd}
        />
      </div>
      <div className="my-2 flex flex-col pointer-events-none cursor-not-allowed select-none">
        <span className="text-base font-bold ">Masterlist</span>
        <input
          type="text"
          value={selectedMasterlist}
          className="bg-gray-200 rounded form-input disabled w-36"
        />
      </div>
    </>
  );
}

export default AddDate;
