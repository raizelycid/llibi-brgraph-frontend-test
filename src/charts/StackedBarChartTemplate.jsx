import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/ThemeContext";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { chartColors } from "./ChartjsConfig";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";

// Import utilities
import { tailwindConfig, formatThousands } from "../utils/Utils";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

function StackedBarChartTemplate({
  data,
  width,
  height,
  bodySize,
  legendSize,
}) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const {
    textColor,
    gridColor,
    tooltipBodyColor,
    tooltipBgColor,
    tooltipBorderColor,
  } = chartColors;

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        ...data,
        datasets: data.datasets.map((dataset, index) => ({
          ...dataset,
        })),
      },
      options: {
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            stacked: true,
            border: {
              display: false,
            },
            beginAtZero: true,
            max: 100,
            ticks: {
              maxTicksLimit: 15,
              font: {
                size: bodySize,
              },
            },
            grid: {
              display: true,
            },
          },
          x: {
            stacked: true,
            // Remove the type and time options
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
              font: {
                size: bodySize,
              },
            },
          },
        },
        plugins: {
          datalabels: {
            backgroundColor: (context) => {
              // if the value is 0, don't show the label
              if (context.dataset.data[context.dataIndex] === 0) return "rgba(0,0,0,0)";
              return context.dataset.backgroundColor;
            },
            color: "white",
            formatter: (value, context) => {
              if(value === 0) return "";
              return value + "%";
            },
            font: {
              size: bodySize,
            },
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              padding: 16,
              font: {
                size: legendSize,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatThousands(context.parsed.y),
            },
            bodyColor: darkMode
              ? tooltipBodyColor.dark
              : tooltipBodyColor.light,
            backgroundColor: darkMode
              ? tooltipBgColor.dark
              : tooltipBgColor.light,
            borderColor: darkMode
              ? tooltipBorderColor.dark
              : tooltipBorderColor.light,
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        animation: {
          duration: 500,
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update("none");
  }, [currentTheme]);

  return (
    <div
      className="grow"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default StackedBarChartTemplate;
