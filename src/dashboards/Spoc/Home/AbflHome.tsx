import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CgHashtag } from "react-icons/cg";
import { IoAt } from "react-icons/io5";
import DashboardContentBase from "../../../components/common/DashboardContentBase";
import DashboardStats from "../../../components/common/DashboardStats";
import { fallbackRender } from "../../../components/common/ErrorFallback";
import PolicyListing from "../../../components/common/PolicyListing";
import ProductCategoryFilter from "../../../components/common/ProductCategoryFilter";
import useGetDashboardAnalytics from "../../../hooks/useGetDashboardAnalytics";
import { chartColors, IChartData, IStats } from "../../Admin/Home/utils/config";

const AbflHome = () => {
  const { data, productId, setProductId } = useGetDashboardAnalytics();
  const spocData = data?.spoc_data;
  const chartStats: IChartData = useMemo(
    () => ({
      title: "Total Assessments",
      data: [
        {
          color: chartColors[0],
          title: "Live",
          number:
            spocData?.recent_assessment?.reduce(
              (acc: number, curr: any) => acc + curr.participant_attempted,
              0
            ) || 0,
        },
        {
          color: chartColors[1],
          title: "Completed",
          number:
            spocData?.recent_assessment?.reduce(
              (acc: number, curr: any) =>
                acc + curr.total_participant - curr.participant_attempted,
              0
            ) || 0,
        },
      ],
      total:
        spocData?.recent_assessment?.reduce(
          (acc: number, curr: any) => acc + curr.total_participant,
          0
        ) || 0,
    }),
    [spocData]
  );

  const stats: IStats[] = [
    {
      icon: CgHashtag,
      number: spocData?.active_policy || 0,
      title: "Total Active Policies ",
    },
    {
      icon: IoAt,
      number:
        spocData?.recent_assessment?.reduce(
          (acc: number, curr: any) => acc + curr.participant_attempted,
          0
        ) || 0,
      title: "Total Assessment Completed",
    },
    {
      icon: CgHashtag,
      number:
        spocData?.recent_assessment?.reduce(
          (acc: number, curr: any) =>
            acc + curr.total_participant - curr.participant_attempted,
          0
        ) || 0,
      title: "Total Assessment Pending",
    },
    {
      icon: CgHashtag,
      number: spocData?.passing_percentage?.toFixed(2) || 0,
      title: "Passing Percentage",
      filterComp: (
        <ProductCategoryFilter
          value={productId}
          onChange={(e) => setProductId(e)}
        />
      ),
    },
  ];

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <DashboardContentBase>
        <DashboardStats stats={stats} chartStats={chartStats} />
        <PolicyListing />
      </DashboardContentBase>
    </ErrorBoundary>
  );
};

export default AbflHome;
