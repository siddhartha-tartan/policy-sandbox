import { Flex } from "@chakra-ui/react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import {
  chatAtom,
  ChartConfig,
  selectedChatIndexAtom,
} from "../../../utils/atom";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

const COLORS = [
  "#3762DD",
  "#F6A623",
  "#34C759",
  "#FF3B30",
  "#AF52DE",
  "#5AC8FA",
  "#FF9500",
  "#00C7BE",
  "#FF2D55",
  "#5856D6",
];

interface PandasDataFrame {
  [column: string]: { [rowIndex: string]: unknown };
}

function parseResultData(
  resultStr: string
): { rows: Record<string, unknown>[]; columns: string[] } {
  try {
    const parsed = JSON.parse(resultStr);

    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      const cols = Object.keys(parsed);
      if (cols.length === 0) return { rows: [], columns: [] };
      const first = parsed[cols[0]];
      if (typeof first === "object" && first !== null) {
        const indices = Object.keys(first).sort(
          (a, b) => Number(a) - Number(b)
        );
        const rows = indices.map((idx) => {
          const row: Record<string, unknown> = {};
          cols.forEach((col) => {
            row[col] = (parsed as PandasDataFrame)[col]?.[idx];
          });
          return row;
        });
        return { rows, columns: cols };
      }
    }

    if (Array.isArray(parsed) && parsed.length > 0) {
      return { rows: parsed, columns: Object.keys(parsed[0]) };
    }

    return { rows: [], columns: [] };
  } catch {
    return { rows: [], columns: [] };
  }
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatValue(v: unknown): string | number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const stripped = v.replace(/[₹,%]/g, "").trim();
    const num = Number(stripped);
    if (!isNaN(num)) return num;
  }
  return String(v ?? "");
}

function buildOption(
  rows: Record<string, unknown>[],
  config: ChartConfig,
  colors: string[]
): echarts.EChartsCoreOption {
  const xField = config.x_axis;
  const yField = config.y_axis;
  const yField2 = config.y_axis_secondary;

  const xData = rows.map((r) => String(r[xField] ?? ""));
  const yData = rows.map((r) => formatValue(r[yField]));
  const yData2 = yField2 ? rows.map((r) => formatValue(r[yField2])) : null;

  const tooltipValueFormatter = (val: unknown) => {
    if (typeof val === "number") {
      return val >= 10000 ? `₹${val.toLocaleString("en-IN")}` : String(val);
    }
    return String(val);
  };

  if (config.type === "pie") {
    const pieData = rows.map((r, i) => ({
      name: String(r[xField] ?? ""),
      value: formatValue(r[yField]),
      itemStyle: { color: colors[i % colors.length] },
    }));

    return {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 20,
        top: "center",
        textStyle: { fontSize: 12, color: "#6B7280" },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          center: ["40%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 600 },
          },
          data: pieData,
        },
      ],
    };
  }

  if (config.type === "horizontal_bar") {
    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: tooltipValueFormatter,
      },
      grid: { left: 160, right: 40, top: 20, bottom: 40 },
      xAxis: {
        type: "value",
        axisLabel: { fontSize: 11, color: "#6B7280" },
        splitLine: { lineStyle: { color: "#F3F4F6" } },
      },
      yAxis: {
        type: "category",
        data: xData.reverse(),
        axisLabel: { fontSize: 11, color: "#374151", width: 140, overflow: "truncate" },
      },
      series: [
        {
          type: "bar",
          data: (yData as number[]).reverse(),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: colors[0] },
              { offset: 1, color: colors[1] || colors[0] },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
          barMaxWidth: 28,
        },
      ],
    };
  }

  // Bar / Line / Area / Scatter
  const seriesType =
    config.type === "area" ? "line" : config.type === "scatter" ? "scatter" : config.type;

  const series: echarts.EChartsCoreOption[] = [
    {
      name: formatLabel(yField),
      type: seriesType,
      data: yData,
      smooth: config.type === "line" || config.type === "area",
      areaStyle: config.type === "area" ? { opacity: 0.15 } : undefined,
      itemStyle: { color: colors[0] },
      barMaxWidth: 36,
      ...(config.type === "bar"
        ? {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: `${colors[0]}88` },
              ]),
              borderRadius: [4, 4, 0, 0],
            },
          }
        : {}),
    },
  ];

  if (yData2) {
    series.push({
      name: formatLabel(yField2!),
      type: seriesType,
      data: yData2,
      smooth: true,
      itemStyle: { color: colors[1] },
      barMaxWidth: 36,
    } as echarts.EChartsCoreOption);
  }

  const needsZoom = xData.length > 12;

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: config.type === "bar" ? "shadow" : "cross" },
      valueFormatter: tooltipValueFormatter,
    },
    legend:
      series.length > 1
        ? { top: 0, textStyle: { fontSize: 12, color: "#6B7280" } }
        : undefined,
    grid: {
      left: 60,
      right: 30,
      top: series.length > 1 ? 40 : 20,
      bottom: needsZoom ? 70 : 40,
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: {
        fontSize: 11,
        color: "#6B7280",
        rotate: xData.length > 8 ? 35 : 0,
        overflow: "truncate",
        width: 80,
      },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11, color: "#6B7280" },
      splitLine: { lineStyle: { color: "#F3F4F6" } },
    },
    dataZoom: needsZoom
      ? [{ type: "slider", start: 0, end: Math.min(100, (12 / xData.length) * 100), height: 24, bottom: 8 }]
      : undefined,
    series,
  };
}

export default function ChartTab() {
  const chat = useAtomValue(chatAtom);
  const selectedChatIndex = useAtomValue(selectedChatIndexAtom);
  const effectiveIndex =
    selectedChatIndex !== null ? selectedChatIndex : chat.length - 1;
  const selectedMessage = chat[effectiveIndex];

  const chartConfig = selectedMessage?.chart_config;

  const option = useMemo(() => {
    if (!selectedMessage?.result || !chartConfig) return null;
    const { rows } = parseResultData(selectedMessage.result);
    if (rows.length === 0) return null;
    return buildOption(rows, chartConfig, chartConfig.color_palette || COLORS);
  }, [selectedMessage?.result, chartConfig]);

  if (!chartConfig) {
    return (
      <Flex className="flex-1 items-center justify-center">
        <CustomText stylearr={[14, 20, 500]} color="#9CA3AF">
          No chart available for this query
        </CustomText>
      </Flex>
    );
  }

  if (!option) {
    return (
      <Flex className="flex-1 items-center justify-center">
        <CustomText stylearr={[14, 20, 500]} color="#9CA3AF">
          Unable to render chart
        </CustomText>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" w="100%" h="100%" overflow="hidden">
      <Flex className="h-[56px] w-full py-3 px-5 items-center justify-between border-b border-[#E4E7EC]" flexShrink={0}>
        <CustomText stylearr={[14, 20, 600]} color="#111827">
          {chartConfig.title || selectedMessage?.title || "Chart"}
        </CustomText>
        <CustomText stylearr={[12, 16, 400]} color="#9CA3AF">
          {formatLabel(chartConfig.x_axis)} vs {formatLabel(chartConfig.y_axis)}
        </CustomText>
      </Flex>
      {selectedMessage?.insights && (
        <Flex className="px-5 py-3 bg-[#FFFBF0] border-b border-[#F6E5B8]" flexShrink={0}>
          <CustomText stylearr={[13, 20, 500]} color="#92640D">
            {selectedMessage.insights}
          </CustomText>
        </Flex>
      )}
      <Flex flex={1} p={4} overflow="hidden">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ width: "100%", height: "100%" }}
          notMerge
          lazyUpdate
        />
      </Flex>
    </Flex>
  );
}
