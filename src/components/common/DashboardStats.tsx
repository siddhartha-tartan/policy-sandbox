import { Center, Divider, Flex, SimpleGrid } from "@chakra-ui/react";
import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { IChartData, IStats } from "../../dashboards/Admin/Home/utils/config";
import { isAbfl } from "../../utils/constants/endpoints";
import { abflColors, systemColors } from "../DesignSystem/Colors/SystemColors";
import CustomText from "../DesignSystem/Typography/CustomText";
import StatsBox from "./StatsBox";
const MotionFlex = motion(Flex);

const DashboardStats = ({
  stats,
  chartStats,
}: {
  stats: IStats[];
  chartStats: IChartData;
}) => {
  const options = useMemo(() => {
    const seriesData = chartStats?.data?.map((item) => ({
      value: item.number,
      name: item.title,
      itemStyle: { color: item.color },
    }));

    return {
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          type: "pie",
          radius: ["55%", "75%"],
          avoidLabelOverlap: true,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          startAngle: 180,
          data: seriesData,
        },
      ],
      graphic: {
        elements: [
          {
            type: "group",
            left: "center",
            top: "center",
            children: [
              {
                type: "rect",
                z: 100,
                left: "center",
                top: "middle",
                shape: {
                  width: 120,
                  height: 120,
                  r: 1000,
                },
                style: {
                  fill: "#ffffff",
                  stroke: "#cccccc",
                  lineWidth: 0.1,
                  shadowBlur: 8,
                  shadowOffsetX: 3,
                  shadowOffsetY: 3,
                  shadowColor: "rgba(0,0,0,0.1)",
                },
              },
              {
                type: "text",
                z: 100,
                left: "center",
                top: "middle",

                style: {
                  text: `${chartStats?.total}\nTotal`,
                  fontSize: "22px",
                  fontWeight: 600,
                  textVerticalAlign: "middle",
                  textAlign: "center",
                  fontFamily: "Manrope",
                },
              },
            ],
          },
        ],
      },
    };
  }, [chartStats]);

  return (
    <Flex
      borderRadius={"16px"}
      flexDir={"row"}
      gridGap={"24px"}
      bg={systemColors.white.absolute}
    >
      <Flex padding={"16px 0 16px 16px"} flexGrow={1} flexShrink={1}>
        <SimpleGrid columns={2} gap={3} w={"100%"} flexGrow={1}>
          {stats?.map((item, index) => (
            <MotionFlex
              key={item.title}
              borderRadius={"24px"}
              flexDir={"column"}
              gridGap={"16px"}
              border={"1px solid rgba(55, 98, 221, 0.12)"}
              padding={"24px"}
              color={systemColors.primary}
              bg={
                isAbfl
                  ? abflColors.secondary
                  : `linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)`
              }
              initial={{ opacity: 0, y: 20 }} // Entry animation (fade-in and slide-up)
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1, // Staggered animation for each card
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.01, // Slight zoom on hover
                boxShadow: "0px 4px 8px rgba(55, 98, 221, 0.2)", // Subtle shadow
                transition: { duration: 0.2 },
              }}
            >
              <StatsBox data={item} />
            </MotionFlex>
          ))}
        </SimpleGrid>
      </Flex>

      <Center>
        <Divider orientation="vertical" h={"420px"} />
      </Center>

      <Flex
        flexDir={"column"}
        p={"24px"}
        justifyContent={"space-between"}
        flexShrink={2}
        minWidth={{ base: "100px", md: "200px", lg: "280px", xl: "400px" }}
      >
        <Flex flexDir={"row"} justifyContent={"space-between"}>
          <CustomText stylearr={[20, 28, 700]} color={systemColors.primary}>
            {chartStats.title}
          </CustomText>
        </Flex>
        {options && <ReactECharts option={options} />}{" "}
      </Flex>
    </Flex>
  );
};

export default DashboardStats;
