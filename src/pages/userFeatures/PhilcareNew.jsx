import React, { useState, useEffect } from "react";
import { tailwindConfig } from "../../utils/Utils";
import DoughnutChartTemplate from "../../charts/DoughnutChartTemplate";
import StackedBarChartTemplate from "../../charts/StackedBarChartTemplate";
import HorizontalStackedBarChartTemplate from "../../charts/HorizontalStackedBarChartTemplate";
import CountLineChartTemplate from "../../charts/CountLineChartTemplate";

function PhilcareNew({ data, tableRefs, chartRefs }) {
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);
  const [dependent, setDependent] = useState({});

  let colors = [
    {
      bg: tailwindConfig().theme.colors.sky[500],
      hover: tailwindConfig().theme.colors.sky[600],
    },
    {
      bg: tailwindConfig().theme.colors.indigo[500],
      hover: tailwindConfig().theme.colors.indigo[600],
    },
    {
      bg: tailwindConfig().theme.colors.purple[500],
      hover: tailwindConfig().theme.colors.purple[600],
    },
    {
      bg: tailwindConfig().theme.colors.pink[500],
      hover: tailwindConfig().theme.colors.pink[600],
    },
    {
      bg: tailwindConfig().theme.colors.red[500],
      hover: tailwindConfig().theme.colors.red[600],
    },
    {
      bg: tailwindConfig().theme.colors.orange[500],
      hover: tailwindConfig().theme.colors.orange[600],
    },
    {
      bg: tailwindConfig().theme.colors.yellow[500],
      hover: tailwindConfig().theme.colors.yellow[600],
    },
    {
      bg: tailwindConfig().theme.colors.green[500],
      hover: tailwindConfig().theme.colors.green[600],
    },
    {
      bg: tailwindConfig().theme.colors.teal[500],
      hover: tailwindConfig().theme.colors.teal[600],
    },
    {
      bg: tailwindConfig().theme.colors.blue[500],
      hover: tailwindConfig().theme.colors.blue[600],
    },
  ];

  const philcareNewPrep = async () => {
    Object.keys(data).forEach((key, index) => {
      if (key === "chart1" && data[key].length > 0) {
        createChart1(data, colors);
      }
      if (key === "chart2" && data[key].length > 0) {
        createChart2(data, colors);
      }
    });
  };

  const createChart1 = (in_data, colors) => {
    let labels = [];
    let data = [];
    let backgroundColor = [];
    let hoverBackgroundColor = [];
    let borderWidth = 0;
    let percentage = [];

    in_data.chart1.map((item, index) => {
      if (item["Relation"] === "Principal Member")
        item["Relation"] = "Employee";
      if (item["Relation"] === "Dependent Children") item["Relation"] = "Child";
      labels.push(item["Relation"]);
      data.push(item["population"]);
      backgroundColor.push(colors[index].bg);
      hoverBackgroundColor.push(colors[index].hover);
      borderWidth = 1;
      percentage.push(item["percentage"]);
    });

    let chartData = {
      labels: labels,
      datasets: [
        {
          label: "Population by Member Type",
          data: data,
          percentage: percentage,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor,
          borderWidth: borderWidth,
        },
      ],
    };

    let chart = (
      <DoughnutChartTemplate data={chartData} width={600} height={300} />
    );

    setCharts((charts) => [...charts, chart]);

    // add relation "Dependent", calculate the population by summing up other except "Employee"
    let dependent_population = 0;
    let dependent_percentage = 0;
    in_data.chart1.map((item, index) => {
      if (item["Relation"] !== "Employee") {
        dependent_population += item["population"];
        dependent_percentage += parseFloat(item["percentage"]);
      }
    });
    dependent["population"] = dependent_population;
    dependent["percentage"] =
      (Math.round(dependent_percentage * 100) / 100).toString() + "%";

    let table = (
      <>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2 border-2 border-white bg-[#002060] text-white">
              Headcount
            </th>
            <th className="px-4 py-2 border-2 border-white bg-[#002060] text-white">
              % to total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              Employee
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {in_data.chart1[0].population}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {in_data.chart1[0].percentage + "%"}
            </td>
          </tr>
          <tr>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              Dependent
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {dependent["population"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {dependent["percentage"]}
            </td>
          </tr>
          {in_data?.chart1?.map((item, index) => {
            if (item["Relation"] !== "Employee") {
              return (
                <tr key={index}>
                  <td className="border-2 border-white px-4 py-2 text-black bg-white">
                    {item["Relation"]}
                  </td>
                  <td className="border-2 border-white px-4 py-2 text-black bg-white">
                    {item["population"]}
                  </td>
                  <td className="border-2 border-white px-4 py-2 text-black bg-white">
                    {item["percentage"] + "%"}
                  </td>
                </tr>
              );
            }
          })}
          <tr>
            <td className="px-4 py-2 border-2 border-white bg-[#002060] text-white">
              Total
            </td>
            <td className="px-4 py-2 border-2 border-white bg-[#002060] text-white">
              {in_data?.chart1
                ?.map((item) => parseInt(item["population"]))
                .reduce((a, b) => a + b)}
            </td>
            <td className="px-4 py-2 border-2 border-white bg-[#002060] text-white">
              {in_data?.chart1
                ?.map((item) => parseFloat(item["percentage"]))
                .reduce((a, b) => a + b) + "%"}
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
  };

  const createChart2 = (in_data, colors) => {
    let labels = [];
    let data = [];
    let rawData = {};

    rawData = in_data.chart2[0];

    for (const key in rawData) {
      if (!key.includes("percentage")) {
        labels.push(key);
        data.push(parseInt(rawData[key]));
      }
    }

    const chartData = {
      title: "Headcount by Age",
      labels: labels,
      datasets: [
        {
          data: data,
          fill: false,
          borderColor: "#002060",
          tension: 0.1,
        },
      ],
    };

    console.log(rawData);

    let chart = (
      <CountLineChartTemplate data={chartData} width={600} height={300} />
    );

    setCharts((charts) => [...charts, chart]);

    let table = (
      <>
        <thead>
          <tr>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              20 below
            </th>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              21 - 30
            </th>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              31 - 40
            </th>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              41 - 50
            </th>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              51 - 60
            </th>
            <th className="whitespace-nowrap px-2 py-2 border-2 border-white bg-[#002060] text-white">
              61 above
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["20 below"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["21 - 30"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["31 - 40"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["41 - 50"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["51 - 60"]}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
              {rawData["61 above"]}
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
  };

  useEffect(() => {
    if (charts.length === 0) {
      if (Object.keys(data).length > 0) {
        console.log(Object.keys(data).length);
        philcareNewPrep();
      }
    }
  }, [data]);

  return (
    <div>
      {charts.map((chart, index) => (
        <div className="grid grid-cols-2 gap-4 mb-14">
          <div key={index} ref={(el) => (chartRefs.current[index] = el)}>
            {chart}
          </div>
          <div className="flex flex-col w-full">
            <table
              className="table-auto w-full mx-4"
              ref={(el) => (tableRefs.current[index] = el)}
            >
              {/* Render the corresponding table for this chart */}
              {tables[index]}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhilcareNew;
