import React from "react";
import BarChart from "../../charts/BarChart04";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";

function AnalyticsCard04() {
  const backendData = [
    {
      "CLAIM TYPE": "APE",
      claim_amount: 10685,
      claim_amount_percentage: 0.0749,
      claim_count: 22,
      claim_count_percentage: "0.4394",
      avg_claim: 485.68,
      avg_claim_percentage: 17.0572,
    },
    {
      "CLAIM TYPE": "DENTAL",
      claim_amount: 903250,
      claim_amount_percentage: 6.3356,
      claim_count: 717,
      claim_count_percentage: "14.3200",
      avg_claim: 1259.76,
      avg_claim_percentage: 44.2429,
    },
    {
      "CLAIM TYPE": "EMERGENCY CARE",
      claim_amount: 1243350.2,
      claim_amount_percentage: 8.7211,
      claim_count: 190,
      claim_count_percentage: "3.7947",
      avg_claim: 6543.95,
      avg_claim_percentage: 229.8236,
    },
    {
      "CLAIM TYPE": "INPATIENT CARE",
      claim_amount: 3938042.92,
      claim_amount_percentage: 27.6222,
      claim_count: 75,
      claim_count_percentage: "1.4979",
      avg_claim: 52507.24,
      avg_claim_percentage: 1844.0551,
    },
    {
      "CLAIM TYPE": "OUTPATIENT CARE",
      claim_amount: 8089966.1,
      claim_amount_percentage: 56.7445,
      claim_count: 3661,
      claim_count_percentage: "73.1176",
      avg_claim: 2209.77,
      avg_claim_percentage: 77.6071,
    },
    {
      "CLAIM TYPE": "TELEMEDICINE",
      claim_amount: 71532.46,
      claim_amount_percentage: 0.5017,
      claim_count: 342,
      claim_count_percentage: "6.8304",
      avg_claim: 209.16,
      avg_claim_percentage: 7.3457,
    },
  ];

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

  const labels = ["Claim Count", "Claim Amount"]

  const chartData = {
    labels: labels,
    datasets: backendData.map((item, index) => {
      const color = colors[index % colors.length];
      return {
        label: item["CLAIM TYPE"],
        data: [
          item.claim_count_percentage,
          item.claim_amount_percentage
        ],
        backgroundColor: color.bg,
        hoverBackgroundColor: color.hover,
        categoryPercentage: 0.66,
      }
    })
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Audience Overview
        </h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <BarChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default AnalyticsCard04;
