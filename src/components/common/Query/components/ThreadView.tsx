import { Flex, Image } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ThreadIcon from "../../../../../src/assets/Images/thread.png";
import useGetUserType from "../../../../hooks/useGetUserType";
import { UserType } from "../../../../utils/constants/constants";
import { isSameDate } from "../../../../utils/helpers";
import { formatDateString } from "../../../../utils/helpers/formatDate";
import { systemColors } from "../../../DesignSystem/Colors/SystemColors";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import useGetThread, { IThread } from "../hooks/useGetThread";
import CreateFaqModal from "./CreateFaqModal";
import ReplyBar from "./ReplyBar";
import RestrictAnswer from "./RestrictAnswer";
import ThreadBox from "./ThreadBox";

function groupByDate(threads: IThread[]) {
  const groupedThreads = new Map<string, IThread[]>();

  threads.forEach((thread) => {
    const isToday = isSameDate(new Date(thread.created_at), new Date());
    const date = formatDateString(new Date(thread.created_at));
    const localDate = isToday ? "Today" : date;
    if (!groupedThreads.has(localDate)) {
      groupedThreads.set(localDate, []);
    }
    groupedThreads.get(localDate)!.push(thread);
  });

  // Convert Map to an array of objects if needed
  const result = Array.from(groupedThreads.entries()).map(
    ([localDate, threads]) => ({
      date: localDate,
      threads,
    })
  );

  return result;
}
export default function ThreadView() {
  const userType = useGetUserType();
  const { id } = useParams<{ id: string }>();
  const { data } = useGetThread(id || "");
  const filteredData = data ? groupByDate(data) : [];
  const [reply, setReply] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
      });
    }
  }, [ref.current]);

  return (
    <Flex
      flexDir={"column"}
      overflowY={"auto"}
      justifyContent={"flex-end"}
      h={"full"}
      borderRadius={"16px"}
      w={"full"}
      pb={"20px"}
      px={"20px"}
      bgColor={systemColors.white.absolute}
    >
      {filteredData.length === 0 && (
        <Flex
          h={"full"}
          flexGrow={1}
          className="items-center justify-center flex-col gap-3"
        >
          <Image className="w-[44px]" src={ThreadIcon} />
          <CustomText stylearr={[16, 25, 700]}>No Active thread</CustomText>
        </Flex>
      )}
      <Flex
        py={"20px"}
        ref={ref}
        overflowY={"auto"}
        flexDir={"column"}
        gap={"24px"}
      >
        {filteredData?.reverse()?.map((row, id) => {
          return (
            <React.Fragment key={`${id}-thread`}>
              <Flex gap={3} alignItems={"center"} w={"full"}>
                <Flex
                  flexGrow={1}
                  h={"1px"}
                  bgColor={systemColors.black[100]}
                />
                <CustomText
                  stylearr={[14, 22, 600]}
                  color={systemColors.black[400]}
                >
                  {row.date}
                </CustomText>
                <Flex
                  flexGrow={1}
                  h={"1px"}
                  bgColor={systemColors.black[100]}
                />
              </Flex>
              {row.threads?.reverse()?.map((thread, id) => (
                <ThreadBox key={id} data={thread} />
              ))}
            </React.Fragment>
          );
        })}
      </Flex>
      {userType === UserType.STAFF_USER ? (
        <RestrictAnswer />
      ) : userType === UserType.QUERY_STAFF_USER ? (
        <ReplyBar val={reply} setVal={setReply} showFaqCta />
      ) : (
        <React.Fragment />
      )}
      <CreateFaqModal />
    </Flex>
  );
}
