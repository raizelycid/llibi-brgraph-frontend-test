import React from "react";
import LineChart from "../../charts/LineChart03";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

function AnalyticsCard01() {
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

  const rawData = {
    "20 below": "28",
    "20_below_percentage": "19.86",
    "21 - 30": "29",
    "21_30_percentage": "20.57",
    "31 - 40": "41",
    "31_40_percentage": "29.08",
    "41 - 50": "18",
    "41_50_percentage": "12.77",
    "51 - 60": "15",
    "51_60_percentage": "10.64",
    "61 above": "10",
    "61_above_percentage": "7.09",
  };

  const labels = [];
  const data = [];

  for (const key in rawData) {
    if (!key.includes("percentage")) {
      labels.push(key);
      data.push(parseInt(rawData[key]));
    }
  }

  const chartData = {
    title: "Headcount by Age: Number",
    labels: labels,
    datasets: [
      {
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 h-full">
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={800} height={300} />
      </div>
    </div>
  );
}

export default AnalyticsCard01;
