import React, { useState, useEffect } from "react";
import { tailwindConfig } from "../../utils/Utils";
import DoughnutChartTemplate from "../../charts/DoughnutChartTemplate";
import StackedBarChartTemplate from "../../charts/StackedBarChartTemplate";
import HorizontalStackedBarChartTemplate from "../../charts/HorizontalStackedBarChartTemplate";

function MedicardNew({ data, tableRefs, chartRefs }) {
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);
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

  const MedicardNewPrep = async () => {
    // map through data and create charts and tables. also pass refs to tableRefs and chartRefs
    Object.keys(data).map((key) => {
      if (key === "chart1") {
        createChart1(data, colors);
      }
      if (key === "chart2") {
        createChart2(data, colors);
      }
      if (key === "chart3") {
        createChart3(data, colors);
      }
    });
  };

  const createChart1 = (in_data, colors) => {
    let labels = [];
    let data = [];
    let backgroundColor = [
      tailwindConfig().theme.colors.sky[400],
      tailwindConfig().theme.colors.sky[600],
    ];
    let hoverBackgroundColor = [
      tailwindConfig().theme.colors.sky[500],
      tailwindConfig().theme.colors.sky[700],
    ];
    let borderWidth = 0;
    let percentage = [];

    // map through medicardNew.chart1
    in_data.chart1.map((item) => {
      // before pushing label, format MEMBER_TYPE first. (e.g "A. PRINCIPAL" -> "PRINCIPAL")
      const formatted = item["MEMBER_TYPE"].split(". ").pop();
      labels.push(formatted);
      data.push(item["population"]);
      percentage.push(item["percentage"]);
    });

    let chartData = {
      labels: labels,
      datasets: [
        {
          label: "Population by Member Type",
          data: percentage,
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

    let table = (
      <>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Head Count
            </th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {in_data?.chart1?.map((item, index) => {
            return (
              <tr key={index}>
                <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                  {item["MEMBER_TYPE"].split(". ").pop()}
                </td>
                <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                  {item["population"]}
                </td>
                <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                  {parseFloat(item["percentage"]) + "%"}
                </td>H
              </tr>
            );
          })}
          <tr>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Total
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data?.chart1
                ?.map((item) => item["population"])
                .reduce((a, b) => a + b, 0)}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data?.chart1
                ?.map((item) => parseFloat(item["percentage"]))
                .reduce((a, b) => a + b, 0 * 100) + "%"}
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
  };

  const createChart2 = (in_data, colors) => {
    let labels = ["Claim Amount", "Average Claim Amount"];
    let chartData = {
      labels: labels,
      datasets: in_data.chart2.map((item, index) => {
        const formatted = item["MEMBER_TYPE"].split(". ").pop();
        const color = colors[index % colors.length]; // Use modulo to cycle through colors if there are more than 10 items
        return {
          label: formatted,
          data: [
            item.claim_amount_percentage,
            item.avg_claim_amount_percentage,
          ],
          backgroundColor: color.bg,
          hoverBackgroundColor: color.hover,
          barPercentage: 0.66,
          categoryPercentage: 0.66,
        };
      }),
    };

    let chart = (
      <StackedBarChartTemplate data={chartData} width={600} height={300} />
    );

    setCharts((charts) => [...charts, chart]);

    let table = (
      <>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Claim Amount
            </th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Average Claim Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {in_data.chart2.map((item, index) => (
            <tr key={index}>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item.MEMBER_TYPE}
              </td>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item.claim_amount}
              </td>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item.avg_claim_amount}
              </td>
            </tr>
          ))}
          <tr key="total">
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Total
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data.chart2
                ?.map((item) => item.claim_amount)
                .reduce((a, b) => a + b, 0)}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data.chart2
                ?.map((item) => item.avg_claim_amount)
                .reduce((a, b) => a + b, 0)}
            </td>
          </tr>
        </tbody>
      </>
    );

    setTables((tables) => [...tables, table]);
  };

  const createChart3 = (in_data, colors) => {
    let labels = ["Claim Count", "Claim Amount"];
    let chartData = {
      labels: labels,
      datasets: in_data.chart3.map((item, index) => {
        const color = colors[index % colors.length];
        return {
          label: item["CLAIM TYPE"],
          data: [item.claim_count_percentage, item.claim_amount_percentage],
          backgroundColor: color.bg,
          hoverBackgroundColor: color.hover,
          categoryPercentage: 0.66,
        };
      }),
    };

    let chart = (
      <HorizontalStackedBarChartTemplate
        data={chartData}
        width={600}
        height={300}
      />
    );

    setCharts((charts) => [...charts, chart]);

    let table = (
      <>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Claim Amount
            </th>
            <th className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Claim Count
            </th>
          </tr>
        </thead>
        <tbody>
          {in_data.chart3.map((item, index) => (
            <tr key={index}>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item["CLAIM TYPE"]}
              </td>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item.claim_amount}
              </td>
              <td className="border-2 border-white px-4 py-2 bg-[#dcebf6] text-black">
                {item.claim_count}
              </td>
            </tr>
          ))}
          <tr key="total">
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              Total
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data.chart3
                ?.map((item) => item.claim_amount)
                .reduce((a, b) => a + b, 0)}
            </td>
            <td className="border-2 border-white px-4 py-2 bg-[#002060] text-white">
              {in_data.chart3
                ?.map((item) => item.claim_count)
                .reduce((a, b) => a + b, 0)}
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
        MedicardNewPrep();
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
          <table
            className="table-auto w-full mx-4"
            ref={(el) => (tableRefs.current[index] = el)}
          >
            {/* Render the corresponding table for this chart */}
            {tables[index]}
          </table>
        </div>
      ))}
    </div>
  );
}
export default MedicardNew;
