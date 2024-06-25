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
import LoadingOverlay from "../../components/LoadingOverlay";
import axios from "../../api/axios";
import ModalBasic from "../../components/ModalBasic";
import Dropzone from "react-dropzone";
import chart1Design from "./Designs/Intellicare/Chart1/Chart1.json";
import table1Design from "./Designs/Intellicare/Chart1/Table1.json";
import chart2Design from "./Designs/Intellicare/Chart2/Chart2.json";
import table3Design from "./Designs/Intellicare/Chart3/Table3.json";
import chart4Design from "./Designs/Intellicare/Chart4/Chart4.json";
import table4Design from "./Designs/Intellicare/Chart4/Table4.json";
import table5Design from "./Designs/Intellicare/Chart5/Table5.json";

function IntellicareOld() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const [file, setFile] = useState(null);
  const fileTypes = ["xlsx", "xls", "csv"];
  const [toggle1, setToggle1] = useState(false);
  const [customIllnesses, setCustomIllnesses] = useState([]);
  const [useData, setUseData] = useState(data["chart5"]);
  const [showUploadIllnessModal, setShowUploadIllnessModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    console.log(date_start, date_end);
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

  useEffect(() => {
    setLoading(true);
    // check if toggle1 is true. if it is, change the data to custom illnesses
    if (toggle1) {
      setUseData(customIllnesses);
    } else {
      setUseData(data["chart5"]);
    }
  }, [toggle1]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/intellicare/get-illnesses/${client_id}/${py[py.length - 1]}`)
      .then((response) => {
        if (response.data.data.length === 0) {
          setCustomIllnesses([]);
        } else {
          setCustomIllnesses(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
      const color = chart1Design[selectedColor].color[index];
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
      let color = table1Design[selectedColor].color[i];
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
                className="px-4 py-2 col-span-1 text-white"
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
                              color: "white",
                            }
                          : data[key]["Member Type"] === "Total"
                          ? {}
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
                                color: color.text,
                                fontWeight: "bold",
                              }
                            : data[key]["Member Type"] === "Total"
                            ? {
                                backgroundColor: color.total,
                                color: color.text,
                                fontWeight: "bold",
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
                                color: color.text,
                                fontWeight: "bold",
                              }
                            : data[key]["Member Type"] === "Total"
                            ? {
                                backgroundColor: color.total,
                                color: color.text,
                                fontWeight: "bold",
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
                                color: color.text,
                                fontWeight: "bold",
                              }
                            : data[key]["Member Type"] === "Total"
                            ? {
                                backgroundColor: color.total,
                                color: color.text,
                                fontWeight: "bold",
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
                                color: color.text,
                                fontWeight: "bold",
                              }
                            : data[key]["Member Type"] === "Total"
                            ? {
                                backgroundColor: color.total,
                                color: color.text,
                                fontWeight: "bold",
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
                                color: color.text,
                                fontWeight: "bold",
                              }
                            : data[key]["Member Type"] === "Total"
                            ? {
                                backgroundColor: color.total,
                                color: color.text,
                                fontWeight: "bold",
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
                                    color: color.text,
                                    fontWeight: "bold",
                                  }
                                : data[key]["Member Type"] === "Total"
                                ? {
                                    backgroundColor: color.total,
                                    color: color.text,
                                    fontWeight: "bold",
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
                                    color: color.text,
                                    fontWeight: "bold",
                                  }
                                : data[key]["Member Type"] === "Total"
                                ? {
                                    backgroundColor: color.total,
                                    color: color.text,
                                    fontWeight: "bold",
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
    let dataset = [];
    const color = chart2Design[selectedColor].color[0];
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

    console.log(data);

    dataset.push({
      label: "Claim Count",
      data: count_data,
      backgroundColor: color.bg2,
      borderColor: color.bg2,
      tension: 0.4,
      type: "line",
      yAxisID: "y-axis-2",
    });

    dataset.push(
      data?.reduce((acc, item, index) => {
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
      let color = table3Design[selectedColor].color[i];
      console.log(color);

      //if(companies[i] === "COMBINED")
      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className={`grid grid-cols-7`}>
              <th
                className="px-4 py-2 text-white col-span-2"
                style={{ backgroundColor: color.header }}
              >
                {companies[i]}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "Claim Amount"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "Claim Count"}
              </th>
              <th
                className="px-4 py-2 text-white"
                style={i === 0 ? { color: color.header } : {}}
              >
                {i === 0 && "% to Total"}
              </th>
              <th
                className="px-4 py-2 text-white"
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
                    <tr
                      className={`grid grid-cols-7`}
                      style={
                        toTitleCase(data[key]["Claim Type"]) === "Total"
                          ? { backgroundColor: color.total }
                          : {}
                      }
                    >
                      <td
                        className="border px-4 py-2 col-span-2"
                        style={{ color: color.header }}
                      >
                        {toTitleCase(data[key]["Claim Type"])}
                      </td>
                      <td
                        className="border px-4 py-2 "
                        style={{ color: color.header }}
                      >
                        {data[key]["Claim Amount"]}
                      </td>
                      <td
                        className="border px-4 py-2 "
                        style={{ color: color.header }}
                      >
                        {data[key]["% to Total(Amount)"]}
                      </td>
                      <td
                        className="border px-4 py-2 "
                        style={{ color: color.header }}
                      >
                        {data[key]["Claim Count"]}
                      </td>
                      <td
                        className="border px-4 py-2 "
                        style={{ color: color.header }}
                      >
                        {data[key]["% to Total(Count)"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{ color: color.header }}
                      >
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
    if (data.length === 0) {
      let chart = (
        <div className="flex justify-center items-center h-96">
          <h1 className="text-3xl">No chart available</h1>
        </div>
      );
      setCharts((charts) => [
        ...charts,
        { chart: chart, title: "Utilization by Member Type" },
      ]);
      setNoCharts((noCharts) => [...noCharts, "Utilization by Member Type"]);
      let table = (
        <tbody>
          {/* tell no masterlist */}
          <tr>
            <td className="border px-4 py-2 text-center text-3xl">
              No Masterlist available
            </td>
          </tr>
        </tbody>
      );
      setTables((tables) => [...tables, table]);
      return;
    }
    console.log(data);
    let labels = ["Head Count", "Claim Count", "Claim Amount"];
    let dataset = data
      .filter((item) => item[""] !== "TOTAL")
      .map((item, index) => {
        let color = chart4Design[selectedColor].color[index];
        return {
          label: item[""],
          data: [
            parseInt(item["% to Total(Head Count)"]),
            parseInt(item["% to Total(Claim Count)"]),
            parseInt(item["% to Total(Claim Amount)"]),
          ],
          backgroundColor: color.bg,
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
            <th className="px-4 py-2 text-white"></th>
            <th
              className="px-4 py-2 text-white"
              style={{
                backgroundColor: table4Design[selectedColor].color[0].header,
              }}
            >
              Head Count
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{
                backgroundColor: table4Design[selectedColor].color[0].header,
              }}
            >
              Claim Count
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{
                backgroundColor: table4Design[selectedColor].color[0].header,
              }}
            >
              Claim Amount
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{
                backgroundColor: table4Design[selectedColor].color[0].header,
              }}
            >
              Average Cost per Claim
            </th>
            <th
              className="px-4 py-2 text-white"
              style={{
                backgroundColor: table4Design[selectedColor].color[0].header,
              }}
            >
              Average Cost per Person
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            if (item[""] !== "TOTAL") {
              return (
                <tr
                  className="grid grid-cols-6"
                  style={{
                    color: table4Design[selectedColor].color[0].header,
                  }}
                >
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
            style={{
              backgroundColor: table4Design[selectedColor].color[0].header,
            }}
          >
            <td className="border px-4 py-2 text-white">TOTAL</td>
            <td className="border px-4 py-2 text-white">
              {data[data.length - 1]["Head Count"]}
            </td>
            <td className="border px-4 py-2 text-white">
              {data[data.length - 1]["Claim Count"]}
            </td>
            <td className="border px-4 py-2 text-white">
              {data[data.length - 1]["Claim Amount"]}
            </td>
            <td className="border px-4 py-2 text-white">
              {data[data.length - 1]["Average Cost per Claim"]}
            </td>
            <td className="border px-4 py-2 text-white">
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

    let memtype = [
      ...new Set(
        useData.map((item) => item["Member Type"]).filter((type) => type !== "")
      ),
    ];
    memtype = [...new Set(memtype)];
    let table_list = [];
    for (let i = 0; i < memtype.length; i++) {
      let write = true;
      let color = table5Design[selectedColor].color[i];

      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className={`grid grid-cols-6`}>
              <th
                className="px-4 py-2 underline"
                style={{ color: color.header }}
              >
                {memtype[i]}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"Claim Amount"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"Claim Count"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"Average Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(useData).map((key) => {
              if (useData[key]["Member Type"] === memtype[i]) write = true;
              if (
                useData[key]["Member Type"] === memtype[i] ||
                useData[key]["Member Type"] === ""
              ) {
                if (write) {
                  return (
                    <tr
                      className="grid grid-cols-6"
                      style={{
                        backgroundColor:
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? color.header
                            : undefined,
                      }}
                    >
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {toTitleCase(useData[key]["Diagnosis"])}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {useData[key]["Claim Amount"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {useData[key]["% to Total(Amount)"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {useData[key]["Claim Count"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {useData[key]["% to Total(Count)"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {useData[key]["Average Cost Per Claim"]}
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
      let color = table5Design[selectedColor].color[i];
      table_list.push(
        <table className="table-auto w-full mx-4">
          <thead>
            <tr className={`grid grid-cols-6`}>
              <th
                className="px-4 py-2 underline"
                style={{ color: color.header }}
              >
                {memtype[i]}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"Claim Amount"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"Claim Count"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
              >
                {"% to Total"}
              </th>
              <th
                className="px-4 py-2"
                style={{ backgroundColor: color.header, color: color.text }}
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
                    <tr
                      className="grid grid-cols-6"
                      style={{
                        backgroundColor:
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? color.header
                            : undefined,
                      }}
                    >
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {toTitleCase(data[key]["Provider_Name"])}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {data[key]["Claim Amount"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {data[key]["% to Total(Amount)"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {data[key]["Claim Count"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
                        {data[key]["% to Total(Count)"]}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{
                          color:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.text
                              : color.header,
                          backgroundColor:
                            toTitleCase(useData[key]["Diagnosis"]) === "Total"
                              ? color.header
                              : undefined,
                        }}
                      >
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
    setLoading(true);
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
        }/api/intellicare/download-top-illnesses/${
          py[py.length - 1]
        }/${client_id}/${date_start}/${date_end}`
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
        }/api/intellicare/download-top-providers/${
          py[py.length - 1]
        }/${client_id}/${date_start}/${date_end}`
      )
        .then((response) => response.blob())
        .then((blob) => {
          folder.file("Top Providers.csv", blob);
        })
    );

    Promise.all(promises)
      .then(() => {
        zip.generateAsync({ type: "blob" }).then((content) => {
          const url = window.URL.createObjectURL(content);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${client_name}_${py[py.length - 1]}.zip`;
          link.target = "_blank";
          link.click();
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const downloadTopIllnesses = () => {
    setLoading(true);
    // fetch api and download csv file
    fetch(
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/intellicare/download-top-illnesses/${
        py[py.length - 1]
      }/${client_id}/${date_start}/${date_end}`
    )
      .then((response) => response.blob())
      .then((excelBlob) => {
        const url = window.URL.createObjectURL(excelBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Top Illnesses.csv`;
        link.target = "_blank";
        link.click();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const uploadTopIllnesses = () => {
    //
    setLoading(true);
    let formData = new FormData();
    formData.append("file", file);
    formData.append("py", py[py.length - 1]);
    formData.append("client_id", client_id);

    axios
      .post("/intellicare/upload-illnesses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          setCustomIllnesses(response.data.data);
        } else {
          alert(response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setShowUploadIllnessModal(false);
        resetModal();
        setLoading(false);
      });
  };

  const resetModal = () => {
    setFile(null);
  };

  const handleFile = (file) => {
    setFile(file);
  };

  const changeChart5 = () => {
    console.log(useData);
    for (let i = 0; i < tableRefs.current[4].children.length; i++) {
      for (
        let j = 0;
        j < tableRefs.current[4].children[i].children[1].children.length;
        j++
      ) {
        let row = useData[j];
        let keys = Object.keys(row);
        if (i == 1) {
          row = useData[6 + j];
        }
        for (let k = 1; k < keys.length; k++) {
          if (k === 7) {
            break;
          }
          let temp = row[keys[k]];
          if (k - 1 === 0) {
            temp = toTitleCase(temp);
          } else if (k === 5 || k === 3) {
            // round off to 2 decimal places
            temp = parseFloat(temp).toFixed(2).toString() + "%";
          } else {
            // add commas to numbers
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          tableRefs.current[4].children[i].children[1].children[j].children[
            k - 1
          ].textContent = temp;
        }
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    if (useData.length !== 0 && charts.length > 0) {
      changeChart5();
    }
    setLoading(false);
  }, [useData]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="grid grid-cols-5 w-full border-b-2 py-6">
            <div className="col-span-3 flex flex-col justify-center">
              <h2 className="text-3xl ml-4">{client_name}</h2>
            </div>
            <div className="col-span-2 flex justify-end items-center">
              <div className="grid grid-cols-2 gap-4 mr-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={downloadTopIllnesses}
                >
                  Download Top Illnesses
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadIllnessModal(true);
                  }}
                >
                  Upload Top Illnesses
                </button>
                <div className="flex items-center justify-center">
                  <div className="form-switch">
                    <input
                      type="checkbox"
                      id="switch-1"
                      className="sr-only"
                      checked={toggle1}
                      onChange={() => setToggle1(!toggle1)}
                      disabled={customIllnesses.length === 0}
                    />
                    <label
                      className="bg-slate-400 dark:bg-slate-700"
                      htmlFor="switch-1"
                    >
                      <span
                        className="bg-white shadow-sm"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">Switch label</span>
                    </label>
                  </div>
                  <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">
                    {toggle1 ? "Use Custom Data" : "Use Default Data"}
                  </div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={handleDownload}
                >
                  Export Data
                </button>
              </div>
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
          <ModalBasic
            title="Upload"
            modalOpen={showUploadIllnessModal}
            setModalOpen={setShowUploadIllnessModal}
            resetModal={resetModal}
          >
            <div className="flex flex-col items-center my-6 h-64">
              <div className="mt-6">
                <Dropzone
                  onDrop={(acceptedFiles) => handleFile(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="container">
                      <div
                        {...getRootProps({
                          className:
                            "border-2 border-dashed border-gray-300 p-8 rounded-md flex justify-center items-center cursor-pointer hover:border-indigo-500 transition duration-300 ease-in-out",
                        })}
                      >
                        <input
                          {...getInputProps({
                            accept: fileTypes
                              .map((type) => `.${type}`)
                              .join(","),
                            required: true,
                          })}
                        />
                        <div className="flex flex-col items-center">
                          {file ? (
                            <div className="flex flex-col items-center">
                              <p className="text-gray-700 text-center cursor-default">
                                File "{file.name}" is uploaded.
                              </p>
                              <p className="text-gray-500 text-center mt-2 text-sm">
                                You can drag/drop a new file or click here to
                                replace it.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-gray-500 text-center cursor-pointer">
                                Drag/Drop a file or{" "}
                                <span className="text-indigo-500">
                                  click here
                                </span>{" "}
                                to browse
                              </p>
                              {/* allowed file types */}
                              <p className="text-gray-500 text-center mt-2 text-sm">
                                Allowed file types: {fileTypes.toString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded h-10 ${
                    !file ? "!bg-gray-500 !cursor-not-allowed" : ""
                  }`}
                  disabled={!file}
                  onClick={uploadTopIllnesses}
                >
                  Upload
                </button>
              </div>
            </div>
          </ModalBasic>
        </main>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
}

export default IntellicareOld;
