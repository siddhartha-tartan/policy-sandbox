import { useMemo } from "react";
import { CgHashtag } from "react-icons/cg";
import { IoAt } from "react-icons/io5";
import { MdOutlineQuestionMark } from "react-icons/md";
import DashboardContentBase from "../../../components/common/DashboardContentBase";
import DashboardStats from "../../../components/common/DashboardStats";
import PolicyListing from "../../../components/common/PolicyListing";
import useGetDashboardAnalytics from "../../../hooks/useGetDashboardAnalytics";
import { chartColors, IChartData, IStats } from "./utils/config";
import ProductCategoryFilter from "../../../components/common/ProductCategoryFilter";
import { userStore } from "../../../store/userStore";
import { FeatureIdentifiers } from "../../../utils/constants/constants";

const Home = () => {
  const { data, productId, setProductId } = useGetDashboardAnalytics();
  const { enabledFeature } = userStore();
  const adminData = data?.admin_data;
  const { total, categories } = useMemo(() => {
    let totalCount = 0;

    const transformedCategories = (
      adminData?.policies_diff?.policy_information_list || []
    )?.map((item: any, index: number) => {
      const count = item?.count || 0;
      totalCount += count;

      return {
        title: item?.name || "",
        number: count,
        color: chartColors[index % chartColors.length],
      };
    });

    return {
      total: totalCount,
      categories: transformedCategories,
    };
  }, [adminData]);

  const adminChartStats: IChartData = useMemo(
    () => ({
      title: "Policies in Product Categories",
      data: categories,
      total: total,
    }),
    [adminData],
  );

  const adminStats: IStats[] = useMemo(
    () => [
      {
        icon: CgHashtag,
        number: adminData?.total_policy || 0,
        title: "Total Active Policies",
      },
      {
        icon: IoAt,
        number: adminData?.total_staff_users || 0,
        title: "Total Active Users",
      },

      {
        icon: MdOutlineQuestionMark,
        number: adminData?.passing_percentage?.toFixed(2) || 0,
        title: "Passing Percentage",
        filterComp: (
          <ProductCategoryFilter
            value={productId}
            onChange={(e) => setProductId(e)}
          />
        ),
      },
    ],
    [adminData, productId],
  );

  return (
    <DashboardContentBase>
      <DashboardStats stats={adminStats} chartStats={adminChartStats} />
      {enabledFeature?.includes(FeatureIdentifiers.POLICIES_ABFL) && (
        <PolicyListing />
      )}
    </DashboardContentBase>
  );
};

export default Home;
