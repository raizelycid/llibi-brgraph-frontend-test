import React, { useState, useEffect, useRef } from "react";
import { tailwindConfig } from "../../utils/Utils";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useLocation } from "react-router-dom";
import HorizontalStackedBarChartTemplate from "../../charts/HorizontalStackedBarChartTemplate";
import BarChartCountTemplate from "../../charts/BarChartCountTemplate";
import StackedBarChartTemplate from "../../charts/StackedBarChartTemplate";
import { parse, set } from "date-fns";
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
import table6Design from "./Designs/Intellicare/Chart6/Table6.json";

import { createRoot } from "react-dom/client";

import domtoimage from "dom-to-image-more";
import c from "dom-to-image-more";

function IntellicareOld() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [toggle2, setToggle2] = useState(false);
  const [customIllnesses, setCustomIllnesses] = useState([]);
  const [customIllnessesSorted, setCustomIllnessesSorted] = useState([]);
  const [useData, setUseData] = useState(data["chart5"]);
  const [showUploadIllnessModal, setShowUploadIllnessModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const table_counts = [3, 1, 3, 1, 2, 2];

  // chart data
  const [chart1Data, setChart1Data] = useState(null);
  const [chart2Data, setChart2Data] = useState(null);
  const [chart4Data, setChart4Data] = useState(null);

  const roundOff = (value) => {
    // make sure that it is a string first
    value = value.toString();
    // check first if it has percentage sign. if it has, remove it
    if (value.includes("%")) {
      value = value.replace("%", "");
    }
    // if it is greater than 0 and less than 1 return it as float with 2 decimal places and add percentage sign
    if (value > 0 && value < 1) {
      return parseFloat(value).toFixed(1) + "%";
    } else {
      return parseInt(Math.round(parseFloat(value))) + "%";
    }
  };

  useEffect(() => {
    const processCharts = async () => {
      setLoading(true);

      if (charts.length === 0 && data && Object.keys(data).length > 0) {
        for (const key of Object.keys(data)) {
          if (key === "chart1") {
            await chart1(data[key]);
          }
          if (key === "chart2") {
            await chart2(data[key]);
          }
          if (key === "chart3") {
            await chart3(data[key]);
          }
          if (key === "chart4") {
            await chart4(data[key]);
          }
          if (key === "chart5") {
            await chart5(data[key], data["chart7"]);
          }
          if (key === "chart6") {
            await chart6(data[key]);
          }
        }
      }

      setLoading(false);
    };

    processCharts();
  }, [data]);

  useEffect(() => {
    // check if toggle1 is true. if it is, change the data to custom illnesses
    if (toggle1 && !toggle2) {
      console.log(customIllnesses);
      setUseData(customIllnesses);
    } else if (toggle1 && toggle2) {
      console.log(customIllnessesSorted);
      setUseData(customIllnessesSorted);
      // disable toggle1
    } else if (!toggle1 && toggle2) {
      setUseData(data["chart7"]);
    } else {
      setUseData(data["chart5"]);
    }
  }, [toggle1, toggle2]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/intellicare/get-illnesses/${client_id}/${py[py.length - 1]}`)
      .then((response) => {
        if (response.data.data.length === 0) {
          setCustomIllnesses([]);
        } else {
          setCustomIllnesses(response.data.data);
          setCustomIllnessesSorted(response.data.data2);
          console.log(response.data.data2);
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

  const chart1 = async (data) => {
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
          parseFloat(item["% to Total(y1)"]),
          parseFloat(item["% to Total(y2)"]),
        ];
      } else {
        data = [
          parseFloat(item["% to Total(y1)"]),
          parseFloat(item["% to Total(y2)"]),
          parseFloat(item["% to Total(y3)"]),
        ];
      }
      return {
        label: item["Member Type"],
        data: data,
        backgroundColor: color.bg,
        hoverBackgroundColor: color.hover,
        barPercentage: 0.5,
      };
    });

    let chartData = {
      labels: labels,
      datasets: dataset,
    };

    setChart1Data(chartData);

    let chart = (
      <HorizontalStackedBarChartTemplate
        data={chartData}
        width={1458}
        height={1164}
        bodySize={"56px"}
        legendSize={"46px"}
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
    const remainingColumns = keysLength === 8 ? 6 : 4;
    let remainingWidth =
      remainingColumns === 4 ? 60 / remainingColumns : 72 / remainingColumns;
    remainingWidth = `${remainingWidth}%`;
    let firstColumnWidth = remainingColumns === 4 ? "40%" : "18%";
    for (let i = 0; i < companies.length; i++) {
      let write = true;
      let color = table1Design[selectedColor].color[i];

      //if(companies[i] === "COMBINED")
      table_list.push(
        <table
          className={`p-0 m-0 text-center align-middle border-collapse border-hidden`}
          style={{
            fontFamily: "Aptos",
            width: "2048px",
            height: "675px",
            fontSize: "62px",
          }}
          ref={(el) => {
            tableRefs.current.push(el);
          }}
        >
          <thead>
            <tr>
              <th
                className="text-white p-0 m-0 border border-white"
                style={{
                  backgroundColor: color.header,
                  width: firstColumnWidth,
                }}
              >
                {
                  // if split and has "-" in the company name, only display the first part
                  companies[i].includes("-") &&
                  companies[i].split("-")[0].length > 6
                    ? companies[i].split("-")[0]
                    : companies[i]
                }
              </th>
              <th
                style={{ color: color.header, width: remainingWidth }}
                className="border border-white"
              >
                {py[0]}
              </th>
              <th
                style={{ color: color.header, width: remainingWidth }}
                className="border border-white"
              >
                {"% to Total"}
              </th>
              <th
                style={{ color: color.header, width: remainingWidth }}
                className="border border-white"
              >
                {py[1]}
              </th>
              <th
                style={{ color: color.header, width: remainingWidth }}
                className="border border-white"
              >
                {"% to Total"}
              </th>
              {keysLength === 8 && (
                <>
                  <th style={{ color: color.header, width: remainingWidth }}>
                    {py[2]}
                  </th>
                  <th style={{ color: color.header, width: remainingWidth }}>
                    {"% to Total"}
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
                          : {
                              color: color.text,
                              backgroundColor: color.default,
                            }
                      }
                    >
                      <td
                        className="border border-white"
                        style={{ width: "20%" }}
                      >
                        {data[key]["Member Type"]}
                      </td>
                      <td
                        className="border border-white"
                        style={{ width: remainingWidth }}
                      >
                        {data[key]["HeadCount(y1)"]}
                      </td>
                      <td
                        className="border border-white"
                        style={{ width: remainingWidth }}
                      >
                        {data[key]["% to Total(y1)"]}
                      </td>
                      <td
                        className="border border-white"
                        style={{ width: remainingWidth }}
                      >
                        {data[key]["HeadCount(y2)"]}
                      </td>
                      <td
                        className="border border-white"
                        style={{ width: remainingWidth }}
                      >
                        {data[key]["% to Total(y2)"]}
                      </td>
                      {keysLength === 8 && (
                        <>
                          <td
                            className="border"
                            style={{ width: remainingWidth }}
                          >
                            {data[key]["HeadCount(y3)"]}
                          </td>
                          <td
                            className="border"
                            style={{ width: remainingWidth }}
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

  const chart2 = async (data) => {
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
          barPercentage: 0.5,
        };
      }, {})
    );

    console.log(dataset);

    let chartData = {
      labels: labels,
      datasets: dataset,
    };

    let chart = (
      <BarChartCountTemplate
        data={chartData}
        width={1800}
        height={1600}
        bodySize={"56px"}
        legendSize={"46px"}
      />
    );

    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Claims by Amount and Count" },
    ]);

    // say no table for this chart
    let table = (
      <table
        ref={(el) => {
          tableRefs.current.push(el);
        }}
      >
        <tbody>
          <tr>
            <td className="border  text-center text-3xl">No table available</td>
          </tr>
        </tbody>
      </table>
    );

    setTables((tables) => [...tables, table]);
  };

  const chart3 = async (data) => {
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

      //if(companies[i] === "COMBINED")
      table_list.push(
        <table
          className="p-0 m-0 text-center align-middle border-collapse border-hidden"
          ref={(el) => {
            tableRefs.current.push(el);
          }}
          style={{
            fontFamily: "Aptos",
            width: "3584px",
            height: "675px",
            fontSize: "52px",
          }}
        >
          <thead>
            <tr className="h-[120px]">
              <th
                className=" text-white"
                style={{
                  backgroundColor: color.header,
                  width: "25%",
                  fontWeight: "bold",
                }}
              >
                {
                  // if split and has "-" in the company name, only display the first part
                  companies[i].includes("-") && companies[i].length > 30
                    ? companies[i].split("-")[0]
                    : companies[i]
                }
              </th>
              <th className=" text-white" style={{ color: color.header }}>
                {"Claim Amount"}
              </th>
              <th className=" text-white" style={{ color: color.header }}>
                {"% to Total"}
              </th>
              <th className=" text-white" style={{ color: color.header }}>
                {"Claim Count"}
              </th>
              <th className=" text-white" style={{ color: color.header }}>
                {"% to Total"}
              </th>
              <th className=" text-white" style={{ color: color.header }}>
                {"Ave Cost per Claim"}
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
                      style={
                        toTitleCase(data[key]["Claim Type"]) === "Total"
                          ? { backgroundColor: color.total }
                          : { backgroundColor: color.content }
                      }
                    >
                      <td
                        className="border border-white "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
                      >
                        {toTitleCase(data[key]["Claim Type"])}
                      </td>
                      <td
                        className="border border-white  "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
                      >
                        {data[key]["Claim Amount"]}
                      </td>
                      <td
                        className="border border-white  "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
                      >
                        {roundOff(data[key]["% to Total(Amount)"])}
                      </td>
                      <td
                        className="border border-white  "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
                      >
                        {data[key]["Claim Count"]}
                      </td>
                      <td
                        className="border border-white  "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
                      >
                        {roundOff(data[key]["% to Total(Count)"])}
                      </td>
                      <td
                        className="border border-white "
                        style={{
                          color: color.header,
                          backgroundColor: color.content,
                        }}
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

  const chart4 = async (data) => {
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
            <td className="border  text-center text-3xl">
              No Masterlist available
            </td>
          </tr>
        </tbody>
      );
      setTables((tables) => [...tables, table]);
      return;
    }
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
      <StackedBarChartTemplate
        data={chartData}
        height={1550}
        width={1500}
        bodySize={"62px"}
        legendSize={"54px"}
      />
    );

    setCharts((charts) => [
      ...charts,
      { chart: chart, title: "Utilization by Member Type" },
    ]);

    let color = table4Design[selectedColor].color[0];
    const firstColumnWidth = "20%";
    const remainingWidth = (100 - parseInt(firstColumnWidth)) / 5 + "%";

    let table = (
      <table
        className={`p-0 m-0 text-center align-middle border-collapse border-hidden`}
        style={{
          fontFamily: "Aptos",
          width: "2048px",
          height: "1100px",
          fontSize: "62px",
        }}
        ref={(el) => {
          tableRefs.current.push(el);
        }}
      >
        <thead>
          <tr className=" text-center align-middle">
            <th
              className=" text-white"
              style={{
                width: firstColumnWidth,
              }}
            ></th>
            <th
              className=" text-white "
              style={{
                backgroundColor: color.header,
                width: remainingWidth,
              }}
            >
              Head Count
            </th>
            <th
              className=" text-white "
              style={{
                backgroundColor: color.header,
                width: remainingWidth,
              }}
            >
              Claim Count
            </th>
            <th
              className=" text-white "
              style={{
                backgroundColor: color.header,
                width: remainingWidth,
              }}
            >
              Claim Amount
            </th>
            <th
              className=" text-white "
              style={{
                backgroundColor: color.header,
                width: remainingWidth,
              }}
            >
              Average Cost per Claim
            </th>
            <th
              className=" text-white "
              style={{
                backgroundColor: color.header,
                width: remainingWidth,
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
                  className="text-center align-middle"
                  style={{
                    color: color.header,
                  }}
                >
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item[""]}
                  </td>
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item["Head Count"]}
                  </td>
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item["Claim Count"]}
                  </td>
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item["Claim Amount"]}
                  </td>
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item["Average Cost per Claim"]}
                  </td>
                  <td
                    className="border "
                    style={
                      (index + 1) % 2 === 0
                        ? { backgroundColor: color.content_even }
                        : { backgroundColor: color.content_odd }
                    }
                  >
                    {item["Average Cost per Person"]}
                  </td>
                </tr>
              );
            }
          })}
          <tr
            className="text-center align-middle"
            style={{
              backgroundColor: color.header,
            }}
          >
            <td className="border  text-white">TOTAL</td>
            <td className="border  text-white">
              {data[data.length - 1]["Head Count"]}
            </td>
            <td className="border  text-white">
              {data[data.length - 1]["Claim Count"]}
            </td>
            <td className="border  text-white">
              {data[data.length - 1]["Claim Amount"]}
            </td>
            <td className="border  text-white">
              {data[data.length - 1]["Average Cost per Claim"]}
            </td>
            <td className="border  text-white">
              {data[data.length - 1]["Average Cost per Person"]}
            </td>
          </tr>
        </tbody>
      </table>
    );

    setTables((tables) => [...tables, table]);
  };

  const chart5 = async (data, data2) => {
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
    const firstColumnWidth = "35%";
    const remainingWidth = (100 - parseInt(firstColumnWidth)) / 5 + "%";
    for (let i = 0; i < memtype.length; i++) {
      let write = true;
      let color = table5Design[selectedColor].color[i];

      table_list.push(
        <table
          className={`p-0 m-0 text-center align-middle border-collapse border-hidden`}
          style={{
            fontFamily: "Aptos",
            width: "3584px",
            height: "675px",
            fontSize: "62px",
          }}
          ref={(el) => {
            tableRefs.current.push(el);
          }}
        >
          <thead>
            <tr>
              <th
                className=" text-white underline text-start border border-white table-fixed"
                style={{ color: color.header, width: firstColumnWidth }}
              >
                {memtype[i].toUpperCase()}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Claim Amount"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"% to Total"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Claim Count"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"% to Total"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Average Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(useData).map((key, index) => {
              console.log(index);
              if (useData[key]["Member Type"] === memtype[i]) write = true;
              if (
                useData[key]["Member Type"] === memtype[i] ||
                useData[key]["Member Type"] === ""
              ) {
                if (write) {
                  return (
                    <tr>
                      <td
                        className="border  text-start border-white"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {toTitleCase(useData[key]["Diagnosis"])}
                      </td>
                      <td
                        className="border border-white "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {useData[key]["Claim Amount"]
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td
                        className="border border-white "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {roundOff(useData[key]["% to Total(Amount)"])}
                      </td>
                      <td
                        className="border border-white "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {useData[key]["Claim Count"]
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td
                        className="border border-white "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {roundOff(useData[key]["% to Total(Count)"])}
                      </td>
                      <td
                        className="border border-white "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {useData[key]["Average Cost Per Claim"]
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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

  const chart6 = async (data) => {
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
    const firstColumnWidth = "35%";
    const remainingWidth = (100 - parseInt(firstColumnWidth)) / 5 + "%";
    for (let i = 0; i < memtype.length; i++) {
      let write = true;
      let color = table6Design[selectedColor].color[i];

      table_list.push(
        <table
          className={`p-0 m-0 text-center align-middle border-collapse border-hidden`}
          style={{
            fontFamily: "Aptos",
            width: "3584px",
            height: "675px",
            fontSize: "62px",
          }}
          ref={(el) => {
            tableRefs.current.push(el);
          }}
        >
          <thead>
            <tr>
              <th
                className="text-white underline text-start border border-white"
                style={{ color: color.header, width: firstColumnWidth }}
              >
                {memtype[i].toUpperCase()}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Claim Amount"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"% to Total"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Claim Count"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"% to Total"}
              </th>
              <th
                className=" text-white border border-white"
                style={{ backgroundColor: color.header, width: remainingWidth }}
              >
                {"Average Cost per Claim"}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key, index) => {
              if (data[key]["Member Type"] === memtype[i]) write = true;
              if (
                data[key]["Member Type"] === memtype[i] ||
                data[key]["Member Type"] === ""
              ) {
                if (write) {
                  return (
                    <tr className="bg-[#f3f2f3]">
                      <td
                        className="border border-white text-start"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {toTitleCase(data[key]["Provider_Name"])}
                      </td>
                      <td
                        className="border "
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {data[key]["Claim Amount"]}
                      </td>
                      <td
                        className="border border-white"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {roundOff(data[key]["% to Total(Amount)"])}
                      </td>
                      <td
                        className="border border-white"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {data[key]["Claim Count"]}
                      </td>
                      <td
                        className="border border-white"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
                      >
                        {roundOff(data[key]["% to Total(Count)"])}
                      </td>
                      <td
                        className="border border-white"
                        style={
                          toTitleCase(useData[key]["Diagnosis"]) === "Total"
                            ? {
                                backgroundColor: color.header,
                                color: "white",
                              }
                            : (index + 1) % 2 === 0
                            ? { backgroundColor: color.content_even }
                            : { backgroundColor: color.content_odd }
                        }
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

  const handleDownload = async () => {
    setLoading(true);
    const zip = new JSZip();
    const folder = zip.folder("CSV Files");
    const promises = [];
    const scale = 5;

    chartRefs.current.forEach((chartRef, index) => {
      // Capture the current chartRef and tableRef in the scope of each Promise

      const currentChartRef = chartRef;
      const canvas = currentChartRef.querySelector("canvas");
      const image = canvas.toDataURL("image/png", 1);

      promises.push(
        new Promise((resolve, reject) => {
          try {
            // Add chart image to zip
            const base64Data = image.split(";base64,")[1];
            zip.file(`${chartNames[index]}_chart.png`, base64Data, {
              base64: true,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        })
      );

      console.log("prep tables");
      let tables = tableRefs.current;
      for (let i = 0; i < table_counts.length; i++) {
        console.log(chartNames[i]);
        let iterator = 0;
        for (let q = 0; q < i; q++) {
          iterator += table_counts[q];
        }
        for (let j = 0; j < table_counts[i]; j++) {
          const table = tables[iterator + j];
          console.log(table);

          const scale = 5;
          const style = {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left",
            width: table.offsetWidth + "px",
            height: table.offsetHeight + "px",
            backgroundColor: "white",
            border: 0,
            outline: 0,
            borderStyle: "hidden",
            imageRendering: "pixelated", // Try adding this to improve sharpness
          };

          const param = {
            height: table.offsetHeight * scale,
            width: table.offsetWidth * scale,
            quality: 1,
            style,
            filter: (node) => {
              // Ensure fonts are properly embedded
              if (
                node.tagName === "LINK" &&
                node.getAttribute("rel") === "stylesheet"
              ) {
                const href = node.getAttribute("href");
                if (href && href.includes("fonts.googleapis.com")) {
                  return false;
                }
              }
              return true;
            },
          };

          promises.push(
            domtoimage
              .toPng(table, param)
              .then(function (dataUrl) {
                zip.file(
                  `${chartNames[i]}_table_${j + 1}.png`,
                  dataUrl.split(";base64,")[1],
                  { base64: true }
                );
              })
              .catch((error) => {
                console.log(error);
              })
          );
        }
      }
      console.log("done prepping tables");

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
    });

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
    try {
      for (
        let i = 0;
        i < tableRefs.current[8].children[1].children.length;
        i++
      ) {
        let row = useData[i];
        let keys = Object.keys(row);
        for (let j = 0; j < keys.length - 1; j++) {
          console.log(tableRefs.current[8].children[1].children[i].children[j]);
          if (j + 1 === 1) {
            tableRefs.current[8].children[1].children[i].children[
              j
            ].textContent = toTitleCase(row[keys[j + 1]]);
          } else if (j + 1 === 2 || j + 1 === 4 || j + 1 === 6) {
            // format thousands
            tableRefs.current[8].children[1].children[i].children[
              j
            ].textContent = row[keys[j + 1]]
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else if (j + 1 === 3 || j + 1 === 5) {
            // format percentage
            let temp = roundOff(row[keys[j + 1]]);

            tableRefs.current[8].children[1].children[i].children[
              j
            ].textContent = temp;
          } else {
            console.log(row[keys[j + 1]]);
          }
        }
      }

      // slice data
      let remainingData = useData.slice(6);
      console.log(remainingData);

      for (
        let i = 0;
        i < tableRefs.current[9].children[1].children.length;
        i++
      ) {
        let row = remainingData[i];
        let keys = Object.keys(row);
        for (let j = 0; j < keys.length - 1; j++) {
          if (j + 1 === 1) {
            tableRefs.current[9].children[1].children[i].children[
              j
            ].textContent = toTitleCase(row[keys[j + 1]]);
          } else if (j + 1 === 2 || j + 1 === 4 || j + 1 === 6) {
            // format thousands
            tableRefs.current[9].children[1].children[i].children[
              j
            ].textContent = row[keys[j + 1]]
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else if (j + 1 === 3 || j + 1 === 5) {
            // format percentage
            let temp = row[keys[j + 1]].toString().includes("%")
              ? row[keys[j + 1]]
              : row[keys[j + 1]];

            // ensure that it is only 2 decimal places
            temp = parseFloat(temp).toFixed(1) + "%";
            tableRefs.current[9].children[1].children[i].children[
              j
            ].textContent = temp;
          } else {
            console.log(row[keys[j + 1]]);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (useData.length !== 0 && charts.length > 0) {
      changeChart5();
    }
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

                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={handleDownload}
                >
                  Export Data
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={() => {
                    const link = document.createElement("a");
                    const chart = chartRefs.current[0];
                    // get the canvas with id of "myCanvas"
                    const canvas = chart.querySelector("canvas");
                    // convert canvas to image
                    const image = canvas.toDataURL("image/png", 1);
                    // create a temporary link
                    link.href = image;
                    link.download = "image.png";
                    // trigger the download
                    link.click();
                  }}
                >
                  Test Button
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mx-6">
            {charts.map((chartItem, index) => {
              return (
                <>
                  <div className="border-b-2 border-gray-200 pb-4 w-full justify-center">
                    <h2 className="my-6 text-2xl font-semibold text-gray-700 text-center ">
                      {chartItem.title}
                    </h2>

                    {chartItem.title === "Utilization Top Illnesses" && (
                      <div className="mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 w-full">
                        <header className="px-5 py-4">
                          <div className="flex items-center justify-start">
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
                            <div className="form-switch ml-4">
                              <input
                                type="checkbox"
                                id="switch-2"
                                className="sr-only"
                                checked={toggle2}
                                onChange={() => {
                                  setToggle2(!toggle2);
                                }}
                                disabled={customIllnesses.length === 0}
                              />
                              <label
                                className="bg-slate-400 dark:bg-slate-700"
                                htmlFor="switch-2"
                              >
                                <span className="bg-white shadow-sm"></span>
                                <span className="sr-only">Switch label</span>
                              </label>
                            </div>
                            <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">
                              {toggle2
                                ? "Sort by Claim Count"
                                : "Sort by Claim Amount"}
                            </div>
                          </div>
                        </header>
                      </div>
                    )}
                    {noCharts.includes(chartItem.title) ? (
                      <div className="hidden">
                        <span className="text-3xl">No chart available</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          zoom: 0.3,
                        }}
                        className="overflow-auto"
                      >
                        <div
                          key={index}
                          style={
                            {
                              //zoom: 0.3,
                            }
                          }
                          className="overflow-auto"
                          ref={(el) => (chartRefs.current[index] = el)}
                        >
                          {chartItem.chart}
                        </div>
                      </div>
                    )}
                    <div
                      className="flex flex-col"
                      style={{
                        zoom: 0.3,
                      }}
                    >
                      {tables[index]}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
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
