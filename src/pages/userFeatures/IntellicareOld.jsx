import React, { useState, useEffect, useRef } from "react";
import { tailwindConfig } from "../../utils/Utils";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useLocation } from "react-router-dom";
import HorizontalStackedBarChartTemplate from "../../charts/HorizontalStackedBarChartTemplate";
import BarChartCountTemplate from "../../charts/BarChartCountTemplate";
import StackedBarChartTemplate from "../../charts/StackedBarChartTemplate";
import { parse } from "date-fns";
import JSZip from "jszip";
import html2canvas from "html2canvas";

function IntellicareOld() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const data = location.state.data;
  const py = location.state.py;
  const client_id = location.state.client_id;
  const date_start = location.state.date_start;
  const date_end = location.state.date_end;
  const client_name = location.state.client_name;
  const tableRefs = useRef([]);
  const chartRefs = useRef([]);
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);
  const colors = [
    {
      bg: tailwindConfig().theme.colors.sky[500],
      hover: tailwindConfig().theme.colors.sky[600],
      header: tailwindConfig().theme.colors.sky[500],
      content: tailwindConfig().theme.colors.sky[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.sky[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.indigo[500],
      hover: tailwindConfig().theme.colors.indigo[600],
      header: tailwindConfig().theme.colors.indigo[500],
      content: tailwindConfig().theme.colors.indigo[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.indigo[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.purple[500],
      hover: tailwindConfig().theme.colors.purple[600],
      header: tailwindConfig().theme.colors.purple[500],
      content: tailwindConfig().theme.colors.purple[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.purple[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.pink[500],
      hover: tailwindConfig().theme.colors.pink[600],
      header: tailwindConfig().theme.colors.pink[500],
      content: tailwindConfig().theme.colors.pink[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.pink[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.red[500],
      hover: tailwindConfig().theme.colors.red[600],
      header: tailwindConfig().theme.colors.red[500],
      content: tailwindConfig().theme.colors.red[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.red[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.orange[500],
      hover: tailwindConfig().theme.colors.orange[600],
      header: tailwindConfig().theme.colors.orange[500],
      content: tailwindConfig().theme.colors.orange[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.orange[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.yellow[500],
      hover: tailwindConfig().theme.colors.yellow[600],
      header: tailwindConfig().theme.colors.yellow[500],
      content: tailwindConfig().theme.colors.yellow[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.yellow[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.green[500],
      hover: tailwindConfig().theme.colors.green[600],
      header: tailwindConfig().theme.colors.green[500],
      content: tailwindConfig().theme.colors.green[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.green[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.teal[500],
      hover: tailwindConfig().theme.colors.teal[600],
      header: tailwindConfig().theme.colors.teal[500],
      content: tailwindConfig().theme.colors.teal[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.teal[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.blue[500],
      hover: tailwindConfig().theme.colors.blue[600],
      header: tailwindConfig().theme.colors.blue[500],
      content: tailwindConfig().theme.colors.blue[400],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.blue[500], // Same as header
    },
    {
      bg: tailwindConfig().theme.colors.black,
      hover: tailwindConfig().theme.colors.gray[700],
      header: tailwindConfig().theme.colors.gray[800],
      content: tailwindConfig().theme.colors.gray[600],
      total: tailwindConfig().theme.colors.gray[500],
      text: tailwindConfig().theme.colors.gray[800], // Same as header
    },
  ];
  const [chartCount, setChartCount] = useState(0);
  const noCharts = [
    "Utilization by Claim Type",
    "Utilization Top Illnesses",
    "Utilization Top Providers",
  ];
  const chartNames = [
    "Demographics by Member Type",
    "Claims by Amount and Count",
    "Utilization by Claim Type",
    "Utilization by Member Type",
    "Utilization Top Illnesses",
    "Utilization Top Providers",
  ];

  useEffect(() => {
    if (charts.length === 0) {
      if (data && Object.keys(data).length > 0) {
        Object.keys(data).map((key) => {
          if (key === "chart1") {
            chart1(data[key]);
          }
          if (key === "chart2") {
            chart2(data[key]);
          }
          if (key === "chart3") {
            chart3(data[key]);
          }
          if (key === "chart4") {
            chart4(data[key]);
          }
          if (key === "chart5") {
            chart5(data[key]);
          }
          if (key === "chart6") {
            chart6(data[key]);
          }
        });
      }
    }
  }, [data]);

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  const chart1 = (data) => {
    console.log(data);
    let labels = py;
    let data3 = [];
    let data4 = [];
    const data2 = {
      ...Object.entries(data).slice(
        Object.entries(data).length - 6,
        Object.entries(data).length - 1
      ),
      ...Object.entries(data).slice(
        Object.entries(data).length - 7,
        Object.entries(data).length - 6
      ),
    };

    console.log(data2);

    Object.keys(data2).map((key) => {
      data3.push(data2[key][1]);
    });
    console.log(data3);
    const keysArray = Object.keys(data3[0]);
    const keysLength = keysArray.length;
    let dataset = data3?.map((item, index) => {
      const color = colors[index % colors.length];
      let data = [];
      if (keysLength === 6) {
        data = [
          parseInt(item["% to Total(y1)"]),
          parseInt(item["% to Total(y2)"]),
        ];
      } else {
        data = [
          parseInt(item["% to Total(y1)"]),
          parseInt(item["% to Total(y2)"]),
          parseInt(item["% to Total(y3)"]),
        ];
      }
      return {
        label: item["Member Type"],
        data: data,
        backgroundColor: color.bg,
        hoverBackgroundColor: color.hover,
      };
    });

    console.log(dataset);
    console.log(labels);

    let chartData = {
      labels: labels,
      datasets: dataset,
    };

    let chart = (
      <HorizontalStackedBarChartTemplate
        data={chartData}
        width={600}
        height={300}
      />
    );

    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Demographics by Member Type" },
    ]);

    let companies = [];
    Object.keys(data).map((key) => {
      if (data[key]["Company Name"] !== "") {
        companies.push(data[key]["Company Name"]);
      }
    });
    companies = [...new Set(companies)];
    let table_list = [];
    for (let i = 0; i < companies.length; i++) {
      let write = true;
      let color = colors[i % colors.length];
      if (i === companies.length - 1) color = colors[colors.length - 1];

      //if(companies[i] === "COMBINED")
      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr
              className={`grid ${
                keysLength === 6 ? "grid-cols-6" : "grid-cols-8"
              }`}
            >
              <th
                className="px-4 py-2 text-white col-span-2"
                style={{ backgroundColor: color.header }}
              >
                {companies[i]}
              </th>
              <th
                className="px-4 py-2 col-span-1"
                style={{ color: color.header }}
              >
                {i === 0 && py[0]}
              </th>
              <th
                className="px-4 py-2 col-span-1"
                style={{ color: color.header }}
              >
                {i === 0 && "% to Total"}
              </th>
              <th
                className="px-4 py-2 col-span-1"
                style={{ color: color.header }}
              >
                {i === 0 && py[1]}
              </th>
              <th
                className="px-4 py-2 col-span-1"
                style={{ color: color.header }}
              >
                {i === 0 && "% to Total"}
              </th>
              {keysLength === 8 && (
                <>
                  <th
                    className="px-4 py-2 col-span-1"
                    style={{ color: color.header }}
                  >
                    {i === 0 && py[2]}
                  </th>
                  <th
                    className="px-4 py-2 col-span-1"
                    style={{ color: color.header }}
                  >
                    {i === 0 && "% to Total"}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => {
              if (data[key]["Company Name"] === companies[i]) write = true;
              if (
                data[key]["Company Name"] === companies[i] ||
                data[key]["Company Name"] === ""
              ) {
                if (write) {
                  return (
                    <tr
                      className={`grid ${
                        keysLength === 6 ? "grid-cols-6" : "grid-cols-8"
                      }`}
                      style={
                        data[key]["Member Type"] === "EMPLOYEES" ||
                        data[key]["Member Type"] === "DEPENDENTS"
                          ? {
                              backgroundColor: color.content,
                              color: "white",
                            }
                          : { color: color.text }
                      }
                    >
                      <td
                        className="border px-4 py-2 col-span-2"
                        style={
                          data[key]["Member Type"] === "EMPLOYEES" ||
                          data[key]["Member Type"] === "DEPENDENTS"
                            ? {
                                backgroundColor: color.content,
                                color: "white",
                              }
                            : { color: color.text }
                        }
                      >
                        {data[key]["Member Type"]}
                      </td>
                      <td
                        className="border px-4 py-2 col-span-1"
                        style={
                          data[key]["Member Type"] === "EMPLOYEES" ||
                          data[key]["Member Type"] === "DEPENDENTS"
                            ? {
                                backgroundColor: color.content,
                                color: "white",
                              }
                            : { color: color.text }
                        }
                      >
                        {data[key]["HeadCount(y1)"]}
                      </td>
                      <td
                        className="border px-4 py-2 col-span-1"
                        style={
                          data[key]["Member Type"] === "EMPLOYEES" ||
                          data[key]["Member Type"] === "DEPENDENTS"
                            ? {
                                backgroundColor: color.content,
                                color: "white",
                              }
                            : { color: color.text }
                        }
                      >
                        {data[key]["% to Total(y1)"]}
                      </td>
                      <td
                        className="border px-4 py-2 col-span-1"
                        style={
                          data[key]["Member Type"] === "EMPLOYEES" ||
                          data[key]["Member Type"] === "DEPENDENTS"
                            ? {
                                backgroundColor: color.content,
                                color: "white",
                              }
                            : { color: color.text }
                        }
                      >
                        {data[key]["HeadCount(y2)"]}
                      </td>
                      <td
                        className="border px-4 py-2 col-span-1"
                        style={
                          data[key]["Member Type"] === "EMPLOYEES" ||
                          data[key]["Member Type"] === "DEPENDENTS"
                            ? {
                                backgroundColor: color.content,
                                color: "white",
                              }
                            : { color: color.text }
                        }
                      >
                        {data[key]["% to Total(y2)"]}
                      </td>
                      {keysLength === 8 && (
                        <>
                          <td
                            className="border px-4 py-2 col-span-1"
                            style={
                              data[key]["Member Type"] === "EMPLOYEES" ||
                              data[key]["Member Type"] === "DEPENDENTS"
                                ? {
                                    backgroundColor: color.content,
                                    color: "white",
                                  }
                                : { color: color.text }
                            }
                          >
                            {data[key]["HeadCount(y3)"]}
                          </td>
                          <td
                            className="border px-4 py-2 col-span-1"
                            style={
                              data[key]["Member Type"] === "EMPLOYEES" ||
                              data[key]["Member Type"] === "DEPENDENTS"
                                ? {
                                    backgroundColor: color.content,
                                    color: "white",
                                  }
                                : { color: color.text }
                            }
                          >
                            {data[key]["% to Total(y3)"]}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                }
              } else {
                write = false;
              }
            })}
          </tbody>
        </table>
      );
    }
    setTables((tables) => [...tables, table_list]);
  };

  const chart2 = (data) => {
    let labels = py;
    let data2 = [];
    const keysArray = Object.keys(data[0]);
    const keysLength = keysArray.length;
    let amount_data = [];
    let count_data = [];
    let dataset = []
    data.map((item, index) => { 
      if (keysLength === 6) {
        amount_data = [
          parseInt(item["ClaimAmount1"].replace(/,/g, ""), 10),
          parseInt(item["ClaimAmount2"].replace(/,/g, ""), 10),
        ];
        count_data = [
          parseInt(item["ClaimCount1"].replace(/,/g, ""), 10),
          parseInt(item["ClaimCount2"].replace(/,/g, ""), 10),
        ];
      } else {
        amount_data = [
          parseInt(item["ClaimAmount1"].replace(/,/g, ""), 10),
          parseInt(item["ClaimAmount2"].replace(/,/g, ""), 10),
          parseInt(item["ClaimAmount3"].replace(/,/g, ""), 10),
        ];
        count_data = [
          parseInt(item["ClaimCount1"].replace(/,/g, ""), 10),
          parseInt(item["ClaimCount2"].replace(/,/g, ""), 10),
          parseInt(item["ClaimCount3"].replace(/,/g, ""), 10),
        ];
      }
    });

    console.log(data)

    dataset.push({
      label: "Claim Count",
      data: count_data,
      backgroundColor: "rgba(128, 0, 0, 1)",
      borderColor: "rgba(128, 0, 0, 1)",
      tension: 0.4,
      type: "line",
      yAxisID: "y-axis-2",
    });
    
    dataset.push(
      data?.reduce((acc, item, index) => {
        const color = colors[index % colors.length];

        return {
          label: "Claim Amount",
          data: amount_data,
          backgroundColor: color.bg,
          hoverBackgroundColor: color.hover,
          yAxisID: "y",
        };
      }, {})
    );
    

    console.log(dataset);
    
    let chartData = {
      labels: labels,
      datasets: dataset,
    };

    let chart = (
      <BarChartCountTemplate data={chartData} width={600} height={300} />
    );

    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Claims by Amount and Count" },
    ]);

    // say no table for this chart
    let table = (
      <>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-center text-3xl">
              No table available
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
    
  };

  const chart3 = (data) => {
    // say no chart for this data
    let chart = (
      <div className="flex justify-center items-center h-96">
        <h1 className="text-3xl">No chart available</h1>
      </div>
    );
    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Utilization by Claim Type" },
    ]);

    let companies = [];
    Object.keys(data).map((key) => {
      if (data[key]["Company Name"] !== "") {
        companies.push(data[key]["Company Name"]);
      }
    });
    companies = [...new Set(companies)];
    let table_list = [];
    for (let i = 0; i < companies.length; i++) {
      let write = true;
      let color = colors[i % colors.length];
      if (i === companies.length - 1) color = colors[colors.length - 1];

      //if(companies[i] === "COMBINED")
      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className="grid grid-cols-7">
              {" "}
              {/* Change the number of columns to 7 */}
              <th
                className="px-4 py-2 text-white col-span-2 min-w-36"
                style={{ backgroundColor: color.header }}
              >
                {companies[i]}
              </th>
              <th
                className="px-4 py-2 text-white col-span-1"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "Claim Amount"}
              </th>
              <th
                className="px-4 py-2 text-white col-span-1"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white col-span-1"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "Claim Count"}
              </th>
              <th
                className="px-4 py-2 text-white col-span-1"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white col-span-1"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "Ave Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => {
              if (data[key]["Company Name"] === companies[i]) write = true;
              if (
                data[key]["Company Name"] === companies[i] ||
                data[key]["Company Name"] === ""
              ) {
                if (write) {
                  return (
                    <tr className="grid grid-cols-7 bg-[#f3f2f3]">
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-2">
                        {toTitleCase(data[key]["Claim Type"])}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-1">
                        {data[key]["Claim Amount"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-1">
                        {data[key]["% to Total(Amount)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-1">
                        {data[key]["Claim Count"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-1">
                        {data[key]["% to Total(Count)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3] col-span-1">
                        {data[key]["Ave Cost per Claim"]}
                      </td>
                    </tr>
                  );
                }
              } else {
                write = false;
              }
            })}
          </tbody>
        </table>
      );
    }
    setTables((tables) => [...tables, table_list]);
  };

  const chart4 = (data) => {
    console.log(data);
    let labels = ["Head Count", "Claim Count", "Claim Amount"];
    let dataset = data
      .filter((item) => item[""] !== "TOTAL")
      .map((item, index) => {
        let color = colors[index % colors.length];
        return {
          label: item[""],
          data: [
            parseInt(item["% to Total(Head Count)"]),
            parseInt(item["% to Total(Claim Count)"]),
            parseInt(item["% to Total(Claim Amount)"]),
          ],
          backgroundColor: color.bg,
          hoverBackgroundColor: color.hover,
        };
      });
    let chartData = {
      labels: labels,
      datasets: dataset,
    };

    let chart = (
      <StackedBarChartTemplate data={chartData} height={300} width={600} />
    );

    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Utilization by Member Type" },
    ]);

    let table = (
      <>
        <thead>
          <tr className="grid grid-cols-6">
            <th
              className="px-4 py-2 text-white"
            ></th>
            <th
              className="px-4 py-2 text-white"
              style={{ backgroundColor: colors[0].header }}
            >
              Head Count
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{ backgroundColor: colors[0].header }}
            >
              Claim Count
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{ backgroundColor: colors[0].header }}
            >
              Claim Amount
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{ backgroundColor: colors[0].header }}
            >
              Average Cost per Claim
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{ backgroundColor: colors[0].header }}
            >
              Average Cost per Person
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            if (item[""] !== "TOTAL") {
              return (
                <tr className="grid grid-cols-6">
                  <td className="border px-4 py-2">{item[""]}</td>
                  <td className="border px-4 py-2">{item["Head Count"]}</td>
                  <td className="border px-4 py-2">{item["Claim Count"]}</td>
                  <td className="border px-4 py-2">{item["Claim Amount"]}</td>
                  <td className="border px-4 py-2">
                    {item["Average Cost per Claim"]}
                  </td>
                  <td className="border px-4 py-2">
                    {item["Average Cost per Person"]}
                  </td>
                </tr>
              );
            }
          })}
          <tr
            className="grid grid-cols-6"
            style={{ backgroundColor: colors[0].header }}
          >
            <td className="border px-4 py-2">TOTAL</td>
            <td className="border px-4 py-2">
              {data[data.length - 1]["Head Count"]}
            </td>
            <td className="border px-4 py-2">
              {data[data.length - 1]["Claim Count"]}
            </td>
            <td className="border px-4 py-2">
              {data[data.length - 1]["Claim Amount"]}
            </td>
            <td className="border px-4 py-2">
              {data[data.length - 1]["Average Cost per Claim"]}
            </td>
            <td className="border px-4 py-2">
              {data[data.length - 1]["Average Cost per Person"]}
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
  };

  const chart5 = (data) => {
    let chart = (
      <div className="flex justify-center items-center h-96">
        <h1 className="text-3xl">No chart available</h1>
      </div>
    );
    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Utilization Top Illnesses" },
    ]);

    let memtype = [];
    Object.keys(data).map((key) => {
      if (
        data[key]["Member Type"] !== "" &&
        memtype.includes(data[key]["Member Type"]) === false
      ) {
        memtype.push(data[key]["Member Type"]);
      }
    });
    memtype = [...new Set(memtype)];
    let table_list = [];
    for (let i = 0; i < memtype.length; i++) {
      let write = true;
      let color = colors[i % colors.length];
      if (i === memtype.length - 1) color = colors[colors.length - 1];

      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className={`grid grid-cols-6`}>
              <th
                className="px-4 py-2 text-white underline"
                style={{ color: color.header }}
              >
                {memtype[i]}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Claim Amount"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Claim Count"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Average Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => {
              if (data[key]["Member Type"] === memtype[i]) write = true;
              if (
                data[key]["Member Type"] === memtype[i] ||
                data[key]["Member Type"] === ""
              ) {
                if (write) {
                  return (
                    <tr className="grid grid-cols-6 bg-[#f3f2f3]">
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {toTitleCase(data[key]["Diagnosis"])}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Claim Amount"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["% to Total(Amount)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Claim Count"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["% to Total(Count)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Average Cost Per Claim"]}
                      </td>
                    </tr>
                  );
                }
              } else {
                write = false;
              }
            })}
          </tbody>
        </table>
      );
    }

    setTables((tables) => [...tables, table_list]);
  };

  const chart6 = (data) => {
    let chart = (
      <div className="flex justify-center items-center h-96">
        <h1 className="text-3xl">No chart available</h1>
      </div>
    );
    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Utilization Top Providers" },
    ]);

    let memtype = [];
    Object.keys(data).map((key) => {
      if (
        data[key]["Member Type"] !== "" &&
        memtype.includes(data[key]["Member Type"]) === false
      ) {
        memtype.push(data[key]["Member Type"]);
      }
    });
    memtype = [...new Set(memtype)];
    let table_list = [];
    for (let i = 0; i < memtype.length; i++) {
      let write = true;
      let color = colors[i % colors.length];
      if (i === memtype.length - 1) color = colors[colors.length - 1];

      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className={`grid grid-cols-6`}>
              <th
                className="px-4 py-2 text-white underline"
                style={{ color: color.header }}
              >
                {memtype[i]}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Claim Amount"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Claim Count"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={{ backgroundColor: color.header }}
              >
                {"Average Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => {
              if (data[key]["Member Type"] === memtype[i]) write = true;
              if (
                data[key]["Member Type"] === memtype[i] ||
                data[key]["Member Type"] === ""
              ) {
                if (write) {
                  return (
                    <tr className="grid grid-cols-6 bg-[#f3f2f3]">
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {toTitleCase(data[key]["Provider_Name"])}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Claim Amount"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["% to Total(Amount)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Claim Count"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["% to Total(Count)"]}
                      </td>
                      <td className="border px-4 py-2 bg-[#f3f2f3]">
                        {data[key]["Average Cost Per Claim"]}
                      </td>
                    </tr>
                  );
                }
              } else {
                write = false;
              }
            })}
          </tbody>
        </table>
      );
    }

    setTables((tables) => [...tables, table_list]);
  };

  const handleDownload = () => {
    const zip = new JSZip();
    const folder = zip.folder("CSV Files");
    const promises = [];

    chartRefs.current.forEach((chartRef, index) => {

      // Capture the current chartRef and tableRef in the scope of each Promise
      const currentChartRef = chartRef;

      promises.push(
        html2canvas(currentChartRef, { backgroundColor: null }).then(
          (chartCanvas) => {
            zip.file(
              `${chartNames[index]}_chart.png`,
              chartCanvas.toDataURL("image/png").split(";base64,")[1],
              { base64: true }
            );
          }
        )
      );
    });

    tableRefs.current.forEach((tableRef, index) => {
      // Capture the current chartRef and tableRef in the scope of each Promise
      const currentTableRef = tableRef;

      promises.push(
        html2canvas(currentTableRef, { backgroundColor: null }).then(
          (tableCanvas) => {
            zip.file(
              `${chartNames[index]}_table.png`,
              tableCanvas.toDataURL("image/png").split(";base64,")[1],
              { base64: true }
            );
          }
        )
      );
    });

    promises.push(
      fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/intellicare/download-top-illnesses/${py[py.length-1]}/${client_id}/${date_start}/${date_end}`
      )
        .then((response) => response.blob())
        .then((blob) => {
          folder.file("Top Illnesses.csv", blob);
        })
    );

    promises.push(
      fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/intellicare/download-top-providers/${py[py.length-1]}/${client_id}/${date_start}/${date_end}`
      )
        .then((response) => response.blob())
        .then((blob) => {
          folder.file("Top Providers.csv", blob);
        })
    );

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${client_name}_${py[py.length-1]}.zip`;
        link.target = "_blank";
        link.click();
      });
    });

  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="grid grid-cols-5 w-full border-b-2 h-28">
            <div className="col-span-3 flex flex-col justify-center">
              <h2 className="text-3xl ml-4">{client_name}</h2>
            </div>
            <div className="col-span-2 flex justify-end items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={handleDownload}
              >
                Export Data
              </button>
            </div>
          </div>
          {charts.map((chartItem, index) => {
            // If noCharts includes chartItem, then just create a space for table
            if (noCharts.includes(chartItem.title)) {
              return (
                <div className="border-b-2 border-gray-200 pb-4">
                  <h2 className="my-6 text-2xl font-semibold text-gray-700 text-center">
                    {chartItem.title}
                  </h2>
                  <table
                    className="table-auto w-full mr-6"
                    ref={(el) => (tableRefs.current[index] = el)}
                  >
                    {tables[index]}
                  </table>
                </div>
              );
            }
            return (
              <div className="border-b-2 border-gray-200 pb-4">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 text-center">
                  {chartItem.title}
                </h2>
                <div>
                  <div
                    key={index}
                    ref={(el) => (chartRefs.current[index] = el)}
                  >
                    {chartItem.chart}
                  </div>
                  <table
                    className="table-auto w-full mr-6"
                    ref={(el) => (tableRefs.current[index] = el)}
                  >
                    {tables[index]}
                  </table>
                </div>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default IntellicareOld;
