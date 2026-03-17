import { atom } from "jotai";

export const queryAtom = atom<string>("");
export const isLoadingAtom = atom<boolean>(false);

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter" | "horizontal_bar";
  title?: string;
  x_axis: string;
  y_axis: string;
  /** Optional secondary y-axis field */
  y_axis_secondary?: string;
  series_labels?: string[];
  color_palette?: string[];
}

export interface ChatMessage {
  query: string;
  executed_at_ms: string;
  /** Conversational reply shown in the chat bubble */
  message: string;
  /** Short title used as header in chart / result panels */
  title: string;
  sql_query: string;
  /** JSON-stringified result data (Pandas DataFrame format) */
  result: string;
  /** When present the response can be visualised as a chart */
  chart_config?: ChartConfig;
  insights?: string;
}

export const chatAtom = atom<ChatMessage[]>([]);

export type ResultTab = "sql" | "result" | "chart";
export const activeTabAtom = atom<ResultTab>("sql");

export const selectedDbSourceAtom = atom<string>("");
export const selectedChatIndexAtom = atom<number | null>(null);
