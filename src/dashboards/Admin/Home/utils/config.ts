import { ReactNode } from "react";
import { isAbfl } from "../../../../utils/constants/endpoints";

export interface IStats {
  icon: React.ComponentType;
  title: string;
  number: number;
  filterComp?: ReactNode;
}

export interface IMetricStats {
  color: string;
  title: string;
  number: number;
}

export interface IChartData {
  title: string;
  data: IMetricStats[];
  total: number;
}

export const chartColors = isAbfl
  ? [
      "#CA212D",
      "#FFA6AD",
      "#E92F2E",
      "#A61816",
      "#FFE2E4",
      "#F0918A",
      "#F7C0B2",
    ]
  : [
      "#051A55",
      "#0D2877",
      "#173999",
      "#254CBB",
      "#3762DD",
      "#4B7AFF",
      "#7398FF",
      "#9CB6FF",
    ];
