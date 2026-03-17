import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventBus from "../../../EventBus";
import { userStore } from "../../../store/userStore";
import { BASE_ROUTES } from "../../../utils/constants/constants";
import { IS_HR_PORTAL } from "../../../utils/constants/endpoints";
import { getHrPortalColorConfig } from "../../../utils/getHrPortalColorConfig";
import AnimatedSkeleton from "../../PolicyGen/pages/ThreadView/components/AnimatedSkeleton";
import useGetConversations from "../hooks/useGetConversations";
import {
  isLoadingAtom,
  queryAtom,
  selectedCategoryIdAtom,
  selectedPoliciesAtom,
} from "../polygptAtom";

export const EVENT_OPEN_CONVERSATION = "EVENT_OPEN_CONVERSATION";
export default function ThreadsBox() {
  const hrPortalColorConfig = getHrPortalColorConfig();
  const { id } = useParams<{ id: string }>();
  const [isHovered, setIsHovered] = useState(false);
  const { data, isLoading } = useGetConversations();
  const setQuery = useSetAtom(queryAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setSelectedPolicy = useSetAtom(selectedPoliciesAtom);
  const setSelectedCategory = useSetAtom(selectedCategoryIdAtom);

  useEffect(() => {
    const handleOpenConversation = () => setIsHovered(true);
    EventBus.getInstance().addListener(
      EVENT_OPEN_CONVERSATION,
      handleOpenConversation
    );
    return () => EventBus.getInstance().removeListener(handleOpenConversation);
  }, []);

  const navigate = useNavigate();
  const { userType } = userStore();

  const handleNewChat = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedPolicy(null);
    setIsLoading(false);
    navigate(`${BASE_ROUTES[userType]}/polygpt`);
  };

  return (
    <div className="h-full w-max absolute top-0 left-0 z-[100]">
      <div
        className={`h-full relative overflow-hidden  ${
          isHovered
            ? IS_HR_PORTAL
              ? "bg-white border-r-[1px] border-b-[1px] shadow-md drop-shadow-sm"
              : "bg-white border-r-[1px] border-b-[1px] border-[#E9EAEC] shadow-md drop-shadow-sm"
            : ""
        }`}
        style={{
          ...(isHovered && IS_HR_PORTAL
            ? { borderColor: hrPortalColorConfig.border }
            : {}),
          width: isHovered ? "280px" : "60px",
          transition: "width 0.5s ease-in-out",
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full flex flex-col p-4">
          {/* New Chat Row */}
          <div
            className="flex items-center mb-2 mt-2 rounded-[8px] transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = IS_HR_PORTAL
                ? hrPortalColorConfig.secondary
                : "linear-gradient(95deg, rgba(55, 98, 221, 0.06) -1.14%, rgba(29, 53, 119, 0.06) 158.31%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center  flex-shrink-0 ${
                isHovered
                  ? ""
                  : IS_HR_PORTAL
                  ? "rounded-[8px] border cursor-pointer"
                  : "bg-[#F5F9FF] rounded-[8px] border cursor-pointer"
              }`}
              style={{
                ...(!isHovered && IS_HR_PORTAL
                  ? { backgroundColor: hrPortalColorConfig.backgroundLight }
                  : {}),
              }}
              onClick={handleNewChat}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1223 7.84594 17.2654 5.78088 15.7423 4.25773C14.2191 2.73457 12.1541 1.87769 10 1.875ZM13.125 10.625H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H9.375V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V9.375H13.125C13.2908 9.375 13.4497 9.44085 13.5669 9.55806C13.6842 9.67527 13.75 9.83424 13.75 10C13.75 10.1658 13.6842 10.3247 13.5669 10.4419C13.4497 10.5592 13.2908 10.625 13.125 10.625Z"
                  fill="url(#paint0_linear_new_chat)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_new_chat"
                    x1="1.875"
                    y1="-0.381944"
                    x2="29.8795"
                    y2="2.12258"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      stop-color={
                        IS_HR_PORTAL ? hrPortalColorConfig.primary : "#3762DD"
                      }
                    />
                    <stop
                      offset="1"
                      stop-color={
                        IS_HR_PORTAL
                          ? hrPortalColorConfig.primaryLight
                          : "#1D3577"
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div
              className="overflow-hidden cursor-pointer"
              style={{
                width: isHovered ? "auto" : "0px",
                transition: "width 0.3s ease-in-out",
              }}
              onClick={handleNewChat}
            >
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  IS_HR_PORTAL ? "" : "text-[#3762DD]"
                }`}
                style={{
                  ...(IS_HR_PORTAL
                    ? { color: hrPortalColorConfig.textPrimary }
                    : {}),
                }}
              >
                New Chat
              </span>
            </div>
          </div>

          {/* Recents Row */}
          <div
            className="flex items-center mb-3 rounded-[8px] transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = IS_HR_PORTAL
                ? hrPortalColorConfig.secondary
                : "linear-gradient(95deg, rgba(55, 98, 221, 0.06) -1.14%, rgba(29, 53, 119, 0.06) 158.31%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center  flex-shrink-0 ${
                isHovered
                  ? ""
                  : IS_HR_PORTAL
                  ? "rounded-[8px] border cursor-pointer"
                  : "bg-[#F5F9FF] rounded-[8px] border cursor-pointer"
              }`}
              style={{
                ...(!isHovered && IS_HR_PORTAL
                  ? { backgroundColor: hrPortalColorConfig.backgroundLight }
                  : {}),
              }}
              onMouseEnter={() => setIsHovered(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.5 10C17.5 11.4649 17.0711 12.8978 16.2661 14.1217C15.4611 15.3456 14.3153 16.3069 12.9701 16.887C11.625 17.4672 10.1394 17.6407 8.69683 17.3861C7.25421 17.1316 5.91772 16.4602 4.85234 15.4547C4.79263 15.3983 4.74462 15.3307 4.71105 15.2557C4.67748 15.1807 4.65901 15.0998 4.65668 15.0177C4.65436 14.9356 4.66824 14.8538 4.69752 14.7771C4.7268 14.7003 4.77092 14.6301 4.82734 14.5704C4.9413 14.4498 5.0985 14.3794 5.26435 14.3747C5.34648 14.3724 5.42825 14.3863 5.50501 14.4155C5.58177 14.4448 5.65201 14.4889 5.71172 14.5454C6.60527 15.3883 7.72742 15.9493 8.93796 16.1582C10.1485 16.367 11.3938 16.2145 12.5181 15.7197C13.6425 15.2249 14.5961 14.4097 15.2598 13.376C15.9236 12.3424 16.2679 11.136 16.25 9.90769C16.232 8.67939 15.8524 7.48362 15.1587 6.46981C14.465 5.45599 13.488 4.66907 12.3496 4.20739C11.2112 3.7457 9.96203 3.62972 8.75812 3.87394C7.5542 4.11815 6.44895 4.71174 5.58047 5.58052C5.30469 5.85942 5.04531 6.13364 4.79297 6.4063L6.06719 7.68286C6.1547 7.77027 6.2143 7.88168 6.23846 8.00298C6.26261 8.12428 6.25023 8.25003 6.20289 8.36429C6.15554 8.47856 6.07536 8.5762 5.97249 8.64487C5.86962 8.71354 5.74869 8.75014 5.625 8.75005H2.5C2.33424 8.75005 2.17527 8.6842 2.05806 8.56699C1.94085 8.44978 1.875 8.29081 1.875 8.12505V5.00005C1.8749 4.87636 1.91151 4.75543 1.98017 4.65256C2.04884 4.54969 2.14649 4.4695 2.26076 4.42216C2.37502 4.37481 2.50076 4.36243 2.62207 4.38659C2.74337 4.41075 2.85478 4.47035 2.94219 4.55786L3.90625 5.52348C4.15781 5.25083 4.41719 4.97661 4.69219 4.69927C5.74069 3.64897 7.07723 2.93336 8.53262 2.643C9.98801 2.35264 11.4968 2.50059 12.8681 3.06811C14.2394 3.63564 15.4114 4.59724 16.236 5.83119C17.0605 7.06514 17.5004 8.51597 17.5 10ZM10 5.62505C9.83424 5.62505 9.67527 5.69089 9.55806 5.8081C9.44085 5.92531 9.375 6.08429 9.375 6.25005V10C9.37497 10.1079 9.40287 10.214 9.45599 10.3079C9.50911 10.4019 9.58563 10.4804 9.67812 10.536L12.8031 12.411C12.8735 12.4533 12.9515 12.4812 13.0327 12.4934C13.1139 12.5055 13.1967 12.5015 13.2764 12.4816C13.356 12.4617 13.431 12.4264 13.497 12.3775C13.563 12.3287 13.6187 12.2673 13.6609 12.1969C13.7032 12.1265 13.7312 12.0485 13.7433 11.9673C13.7554 11.8861 13.7514 11.8033 13.7316 11.7237C13.7117 11.644 13.6763 11.5691 13.6275 11.5031C13.5786 11.4371 13.5173 11.3814 13.4469 11.3391L10.625 9.64614V6.25005C10.625 6.08429 10.5592 5.92531 10.4419 5.8081C10.3247 5.69089 10.1658 5.62505 10 5.62505Z"
                  fill={
                    IS_HR_PORTAL ? hrPortalColorConfig.textSecondary : "#141414"
                  }
                />
              </svg>
            </div>
            <div
              className="overflow-hidden"
              style={{
                width: isHovered ? "auto" : "0px",
                transition: "width 0.3s ease-in-out",
              }}
            >
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  IS_HR_PORTAL ? "" : "text-[#141414]"
                }`}
                style={{
                  ...(IS_HR_PORTAL
                    ? { color: hrPortalColorConfig.textSecondary }
                    : {}),
                }}
              >
                Recents
              </span>
            </div>
          </div>

          {/* Conversations List */}
          <div
            className="flex-1 overflow-y-auto overflow-hidden"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {isLoading ? (
              <div className="gap-2 flex flex-col">
                {Array.from({ length: 3 }, (_, id) => {
                  return (
                    <AnimatedSkeleton
                      key={`conversation-loading-${id}`}
                      className="w-full h-[35px] rounded-md"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="gap-2 flex flex-col">
                {data?.map((row, index) => {
                  return (
                    <div
                      onClick={() => {
                        navigate(
                          `${BASE_ROUTES[userType]}/polygpt/${row?.conversation_id}`
                        );
                        setIsHovered(false);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = IS_HR_PORTAL
                          ? hrPortalColorConfig.secondary
                          : "linear-gradient(95deg, rgba(55, 98, 221, 0.06) -1.14%, rgba(29, 53, 119, 0.06) 158.31%)";
                        const textSpan = e.currentTarget.querySelector("span");
                        if (textSpan) {
                          textSpan.style.background = IS_HR_PORTAL
                            ? `linear-gradient(95deg, ${hrPortalColorConfig.primary} -1.14%, ${hrPortalColorConfig.primaryLight} 158.31%)`
                            : "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)";
                          textSpan.style.webkitBackgroundClip = "text";
                          textSpan.style.backgroundClip = "text";
                          textSpan.style.webkitTextFillColor = "transparent";
                          textSpan.style.color = "transparent";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (id === row?.conversation_id) {
                          e.currentTarget.style.background = IS_HR_PORTAL
                            ? hrPortalColorConfig.conversationBgActive
                            : "#00000014";
                        } else {
                          e.currentTarget.style.background = IS_HR_PORTAL
                            ? hrPortalColorConfig.conversationBg
                            : "#FAFAFA";
                        }
                        const textSpan = e.currentTarget.querySelector("span");
                        if (textSpan) {
                          textSpan.style.background = "none";
                          textSpan.style.webkitBackgroundClip = "initial";
                          textSpan.style.backgroundClip = "initial";
                          textSpan.style.webkitTextFillColor = "initial";
                          textSpan.style.color = IS_HR_PORTAL
                            ? hrPortalColorConfig.textMuted
                            : "#455A64";
                        }
                      }}
                      className={`py-2 px-3 rounded-[8px] text-[12px] font-[400] cursor-pointer transition-colors ${
                        IS_HR_PORTAL ? "" : "text-[#455A64]"
                      } ${
                        id === row?.conversation_id
                          ? IS_HR_PORTAL
                            ? ""
                            : "bg-[#00000014]"
                          : IS_HR_PORTAL
                          ? ""
                          : "bg-[#FAFAFA]"
                      }`}
                      style={{
                        ...(IS_HR_PORTAL
                          ? {
                              color: hrPortalColorConfig.textMuted,
                              backgroundColor:
                                id === row?.conversation_id
                                  ? hrPortalColorConfig.conversationBgActive
                                  : hrPortalColorConfig.conversationBg,
                            }
                          : {}),
                      }}
                      key={`conversation-${index}`}
                    >
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                        {row?.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
