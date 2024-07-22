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
  ChartDataLabels
);

function HorizontalStackedBarChartTemplate({
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
    const newChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        indexAxis: "y",
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            // get the last value of the x-axis and add 50px
            right: data.datasets[0].data[data.datasets[0].data.length - 1] + 50,
          },
        },
        scales: {
          y: {
            stacked: true,
            type: "category",
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              autoSkipPadding: 48,
              color: darkMode ? textColor.dark : textColor.light,
              font: {
                size: bodySize,
              },
            },
          },
          x: {
            max: 100,
            stacked: true,
            border: {
              display: false,
            },
            ticks: {
              maxTicksLimit: 3,
              align: "end",
              callback: (value) => formatThousands(value),
              color: darkMode ? textColor.dark : textColor.light,
              size: bodySize,
            },
            grid: {
              color: darkMode ? gridColor.dark : gridColor.light,
            },
          },
        },
        plugins: {
          datalabels: {
            backgroundColor: (context) => {
              return context.dataset.backgroundColor;
            },
            color: "white",
            formatter: (value, context) => {
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
              font: {
                size: legendSize,
              },
            },
          },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatThousands(context.parsed.x),
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
      chart.options.scales.x.grid.color = gridColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.x.grid.color = gridColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
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
      <canvas ref={canvas} id="myCanvas"></canvas>
    </div>
  );
}

export default HorizontalStackedBarChartTemplate;
