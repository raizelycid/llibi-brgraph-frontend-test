import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { tailwindConfig } from "../../utils/Utils";
import DoughnutChartTemplate from "../../charts/DoughnutChartTemplate";
import JSZip from "jszip";
import html2canvas from "html2canvas";

{
  /* Sections */
}
import MedicardNew from "./MedicardNew";
import PhilcareNew from "./PhilcareNew";

function GeneratedResult() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicardNew, setMedicardNew] = useState(false);
  const [medicardOld, setMedicardOld] = useState(false);
  const [philcareNew, setPhilcareNew] = useState(false);
  const [philcareOld, setPhilcareOld] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState({});
  const tableRefs = useRef([]);
  const chartRefs = useRef([]);

  /* References */

  const checkState = async (user) => {
    if (user) {
      if (!location.state) {
        navigate("/404");
      } else {
        //
      }
    } else {
      navigate("/404");
    }
  };

  const generateChart = async () => {
    let mode = location.state.data.mode;

    if (mode === "new") {
      let data = location.state.data[0];

      switch (data["insurer"]) {
        case "Medicard": {
          axios
            .post("/medicard/generate-data-new", location.state)
            .then((res) => {
              if (res.data.success) {
                setMedicardNew(true);
                setData(res.data.data);
              } else {
                console.log(res.data.message);
              }
            })
            .finally(() => {});
          break;
        }

        case "PhilCare": {
          axios
            .post("/philcare/generate-data-new", location.state)
            .then((res) => {
              if (res.data.success) {
                setPhilcareNew(true);
                console.log(res.data.data);
                setData(res.data.data);
              } else {
                console.log(res.data.message);
              }
            });
        }

        default: {
          console.log("Invalid insurer: ".concat(data["insurer"]));
          break;
        }
      }
    } else {
    }
  };

  const handleDownload = () => {
    // Create a new zip file
    const zip = new JSZip();

    // Capture the content of each chart and table as images
    const promises = [];

    chartRefs.current.forEach((chartRef, index) => {
      const tableRef = tableRefs.current[index];

      promises.push(
        html2canvas(chartRef, { backgroundColor: null }).then((chartCanvas) => {
          zip.file(
            `chart_${index}.png`,
            chartCanvas.toDataURL("image/png").split(";base64,")[1],
            { base64: true }
          );
        })
      );

      promises.push(
        html2canvas(tableRef, { backgroundColor: null }).then((tableCanvas) => {
          zip.file(
            `table_${index}.png`,
            tableCanvas.toDataURL("image/png").split(";base64,")[1],
            { base64: true }
          );
        })
      );
    });

    // Wait for all promises to resolve and then download the zip file
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = "charts_and_tables.zip";
        link.click();
      });
    });
  };

  useEffect(() => {
    checkState(user);
    generateChart();
  }, [user]);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 pt-8 w-full mx-auto ">
            {/* Page header */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8 pb-4 border-b dark:border-slate-700 w-full ">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">
                  Generated Reports
                </h1>
              </div>
              {/* Right: Actions */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  className="btn bg-[#002060] text-white"
                  onClick={handleDownload}
                >
                  Export Charts
                </button>
              </div>
            </div>
            <div>
              {medicardNew && (
                <MedicardNew
                  data={data}
                  tableRefs={tableRefs}
                  chartRefs={chartRefs}
                />
              )}
              {philcareNew && (
                <PhilcareNew
                  data={data}
                  tableRefs={tableRefs}
                  chartRefs={chartRefs}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GeneratedResult;
