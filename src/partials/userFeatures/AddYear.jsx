import React, { useState, useEffect } from "react";
import DropdownClassic from "../../components/DropdownClassic";
import { set } from "date-fns";

function AddYear({
  data,
  compareData,
  setCompareData,
  setCompareCount,
  compareCount,
}) {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [remainingOptions, setRemainingOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedYearEnd, setSelectedYearEnd] = useState(0);
  const [selectedMonthEnd, setSelectedMonthEnd] = useState(0);
  const [options, setOptions] = useState([]);

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

  useEffect(() => {
    console.log(data);
    console.log(options);
    setOptions(
      data.map((year, index) => ({
        id: index,
        value: year.value,
      }))
    );
  }, [data]);

  // after selecting a year and month create a list of remaining years and months
  useEffect(() => {
    let remainingYear = [];
    let remainingMonths = [];
    if (selectedMonth !== 0) {
      console.log("something");
      // check if the selected month is the last month of the year
      if (selectedMonth === data[selectedYear]?.months.length - 1) {
        remainingYear = data.slice(selectedYear + 1);
        console.log(remainingYear);
      } else {
        remainingYear = data.slice(selectedYear);
        remainingMonths = remainingYear[selectedYear].months.slice(
          selectedMonth + 1
        );
        console.log(remainingYear);
      }
      setRemainingOptions(remainingYear);
      setYearOptions(
        remainingYear.map((year, index) => ({ id: index, value: year.value }))
      );
      setMonthOptions(
        remainingMonths.map((month, index) => ({
          id: index,
          value: month.value,
        }))
      );
      console.log(
        remainingYear.map((year, index) => ({ id: index, value: year.value }))
      );
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (remainingOptions?.length > 0) {
        console.log("bago ang lahat");
        console.log("bilang: ",compareCount);
        console.log("haba: ",compareData?.length);
      if (compareCount === 1 && compareData?.length <= 1) {
        console.log("una");
        setCompareData((prev) => [
          ...prev,
          {
            year1: data[selectedYear].value,
            month1: data[selectedYear].months[selectedMonth].value,
            year2: yearOptions[selectedYearEnd].value,
            month2: monthOptions[selectedMonthEnd].value,
          },
        ]);
      }
      if (compareCount === 2 && compareData?.length <= 2) {
        console.log("pangalawa");
        setCompareData((prev) => [
          ...prev,
          {
            year1: data[selectedYear].value,
            month1: data[selectedYear].months[selectedMonth].value,
            year2: yearOptions[selectedYearEnd].value,
            month2: monthOptions[selectedMonthEnd].value,
          },
        ]);
      }
      if (compareCount === 3 && compareData?.length <= 3) {
        setCompareData((prev) => [
          ...prev,
          {
            year1: data[selectedYear].value,
            month1: data[selectedYear].months[selectedMonth].value,
            year2: yearOptions[selectedYearEnd].value,
            month2: monthOptions[selectedMonthEnd].value,
          },
        ]);
      }
      console.log({
        year1: data[selectedYear]?.value,
        month1: data[selectedYear]?.months[selectedMonth].value,
        year2: yearOptions[selectedYearEnd]?.value,
        month2: monthOptions[selectedMonthEnd]?.value,
      });
    }
  }, [selectedMonthEnd]);

  useEffect(() => {
    if (
      options[selectedYear]?.value !== remainingOptions[selectedYearEnd]?.value
    ) {
      setMonthOptions(
        remainingOptions[selectedYearEnd].months.map((month, index) => ({
          id: index,
          value: month.value,
        }))
      );
    }
  }, [selectedYearEnd]);

  return (
    <>
      <div className="flex flex-col my-6 justify-start">
        <span className="text-sm text-slate-600 dark:text-slate-400 mr-4 mt-4">
          Select {ordinal_suffix_of(compareCount)} Year:
        </span>
        <DropdownClassic
          options={options}
          selected={selectedYear}
          setSelected={setSelectedYear}
        />
        <span className="text-sm text-slate-600 dark:text-slate-400 mr-4 mt-4">
          Select {ordinal_suffix_of(compareCount)} Starting Month:
        </span>
        <DropdownClassic
          options={data[selectedYear]?.months}
          selected={selectedMonth}
          setSelected={setSelectedMonth}
        />
        <>
          <span className="text-sm text-slate-600 dark:text-slate-400 mr-4 mt-4">
            Select {ordinal_suffix_of(compareCount)} Ending Year:
          </span>
          <DropdownClassic
            options={yearOptions}
            selected={selectedYearEnd}
            setSelected={setSelectedYearEnd}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400 mr-4 mt-4">
            Select {ordinal_suffix_of(compareCount)} Ending Month:
          </span>
          <DropdownClassic
            options={monthOptions}
            selected={selectedMonthEnd}
            setSelected={setSelectedMonthEnd}
          />
        </>
      </div>
    </>
  );
}

export default AddYear;
