import { motion } from "framer-motion";
import { useState } from "react";
import { DisLike, Like } from "react-huge-icons/bulk";
import { DocumentText } from "react-huge-icons/solid";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import FluentCode from "../../../assets/Icons/FluentCode";
import EventBus from "../../../EventBus";
import { EVENT_SUBMIT_FEEDBACK } from "../hooks/useFeedback";
import { ConversationMessage } from "../hooks/useGetMessages";
import FeedbackBox from "./FeedbackBox";
export const EVENT_PDF_LOADED = "EVENT_PDF_LOADED";
const MotionLike = motion(Like);
const MotionDisLike = motion(DisLike);

export default function ConversationBox({
  row,
  userBoxWidth,
  userBoxMaxWidth,
  handlePolicyClick,
}: {
  readonly row: ConversationMessage;
  readonly userBoxWidth: string;
  readonly userBoxMaxWidth: string;
  readonly handlePolicyClick: (
    policyId: string,
    categoryId: string,
    fileId: string,
    pageNumber: number
  ) => void;
}) {
  const [feedback, setFeedback] = useState<"Accepted" | "Rejected" | "">("");

  return (
    <>
      <style>
        {`
  /* Base typography styles */
  .conversation-markdown {
    max-width: none;
    color: #1a1a1a;
    line-height: 1.625;
  }

  /* Headings */
  .conversation-markdown h1, 
  .conversation-markdown h2, 
  .conversation-markdown h3, 
  .conversation-markdown h4, 
  .conversation-markdown h5, 
  .conversation-markdown h6 {
    margin: 0;
    padding: 0;
    line-height: 1.2;
  }

  .conversation-markdown h1 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e3a8a;
    padding-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .conversation-markdown h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #0a0a0a;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .conversation-markdown h3 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2d2d2d;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .conversation-markdown h4 {
    font-size: 0.65rem;
    font-weight: 500;
    color: #2563eb;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .conversation-markdown h5 {
    font-size: 0.55rem;
    font-weight: 400;
    color: #3b82f6;
  }

  .conversation-markdown h6 {
    font-size: 0.75rem;
    font-weight: 500;
    color: #60a5fa;
  }

  /* Paragraphs */
  .conversation-markdown p {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    color: #333333;
    line-height: 1.5;
    font-size: 0.75rem;
  }

  /* Lists */
  .conversation-markdown ul {
    list-style-type: disc;
    padding-left: 1.25rem;
    color: #4a4a4a;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .conversation-markdown ol {
    list-style-type: decimal;
    padding-left: 1.25rem;
    color: #4a4a4a;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .conversation-markdown li {
    margin-bottom: 0.25rem;
    color: #555555;
  }

  /* Horizontal rule */
  .conversation-markdown hr {
    border: 0;
    border-top: 1px solid #e2e8f0;
    margin: 1rem 0;
  }

  /* Bold text */
  .conversation-markdown strong {
    font-weight: 600;
    color: #0a0a0a;
  }

  /* Blockquotes */
  .conversation-markdown blockquote {
    border-left: 3px solid #bfdbfe;
    padding-left: 0.75rem;
    color: #6a6a6a;
    font-style: italic;
    margin: 0.75rem 0;
    background-color: rgba(59, 130, 246, 0.03);
  }

  /* Code blocks */
  .conversation-markdown code {
    font-family: monospace;
    background-color: rgba(30, 58, 138, 0.05);
    color: #1e3a8a;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    border: 1px solid rgba(30, 58, 138, 0.1);
  }

  .conversation-markdown pre {
    background-color: rgba(10, 10, 10, 0.03);
    border: 1px solid rgba(45, 45, 45, 0.1);
    padding: 0.75rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 0.75rem 0;
  }

  .conversation-markdown pre code {
    background-color: transparent;
    border: none;
    padding: 0;
    color: #2d2d2d;
  }

  /* Links */
  .conversation-markdown a {
    color: #1e40af;
    text-decoration: underline;
    text-decoration-color: rgba(30, 64, 175, 0.3);
  }

  .conversation-markdown a:hover {
    color: #1e3a8a;
    text-decoration-color: rgba(30, 58, 138, 0.6);
  }

  /* Tables */
  .conversation-markdown table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .conversation-markdown thead {
    background-color: #f8fafc;
  }

  .conversation-markdown th {
    background-color: #f1f5f9;
    border-bottom: 2px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    padding: 0.75rem 0.5rem;
    text-align: left;
    font-weight: 600;
    color: #1e3a8a;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .conversation-markdown td {
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    padding: 0.5rem;
    color: #374151;
    font-size: 0.75rem;
    vertical-align: top;
  }

  .conversation-markdown th:last-child,
  .conversation-markdown td:last-child {
    border-right: none;
  }

  .conversation-markdown tbody tr:hover {
    background-color: #f9fafb;
  }

  .conversation-markdown tbody tr:last-child td {
    border-bottom: none;
  }

  /* Ensure table is responsive */
  .conversation-markdown table {
    display: table;
    table-layout: auto;
  }

  /* Handle table overflow on small screens */
  .conversation-markdown .table-container {
    overflow-x: auto;
    margin: 1rem 0;
  }
`}
      </style>
      <div className="w-full flex justify-end">
        <div
          className="rounded-[10px] border-[#E4E7EC] border-[1px] bg-[#F5F9FF] p-[16px] text-[12px] font-[500] conversation-markdown"
          style={{ width: userBoxWidth, maxWidth: userBoxMaxWidth }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {row?.prompt || ""}
          </ReactMarkdown>
        </div>
      </div>
      {row?.response && (
        <div className="flex flex-col gap-4">
          <div className="rounded-[10px] border-[#E4E7EC] border-[1px] bg-[#F5F9FF] p-[16px] flex gap-4">
            <div className="rounded-full min-w-[24px] w-[24px] h-[24px] bg-[#000] text-white flex justify-center items-center">
              <FluentCode width={10} />
            </div>

            <div className="leading-[18px] text-[12px] font-[500] flex flex-col gap-[20px]">
              <div className="conversation-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {row?.response?.query_response || ""}
                </ReactMarkdown>
              </div>
              {row?.response?.files?.length ? (
                <div className="flex flex-col gap-4">
                  <p>Policies attached</p>
                  <div className="flex flex-col gap-1">
                    {row?.response?.files?.map((item) => (
                      <div className="flex gap-2 items-center" key={item.id}>
                        <DocumentText color="#0074FF" fontSize={"15px"} />
                        <button
                          onClick={() => {
                            handlePolicyClick(
                              item.policy_id,
                              item.category_id,
                              item.id,
                              0
                            );
                          }}
                          className="text-[#0074FF] underline underline-offset-2 cursor-pointer"
                        >
                          {item?.file_name}
                        </button>
                        <div className="flex items-center gap-1">
                          {item?.page_numbers?.map((page, id) => {
                            return (
                              <button
                                onClick={() => {
                                  handlePolicyClick(
                                    item.policy_id,
                                    item.category_id,
                                    item.id,
                                    page
                                  );
                                }}
                                className="text-[#176FC1] cursor-pointer font-bold"
                                key={`page-${row?.message_id}-${id}`}
                              >
                                [{page}]
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MotionLike
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              cursor={"pointer"}
              fontSize={"20px"}
              onClick={() => {
                EventBus.getInstance().fireEvent(EVENT_SUBMIT_FEEDBACK, {
                  entity: "ConversationMessage",
                  entity_id: row?.message_id,
                  user_prompt: row?.prompt,
                  ai_output: row?.response,
                  user_feedback: "Accepted",
                  user_feedback_reason: "",
                  lang_graph_link: "",
                });
              }}
              className="ring-0 outline-none border-none"
            />
            <MotionDisLike
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              fontSize={"20px"}
              cursor={"pointer"}
              onClick={() => setFeedback("Rejected")}
              className="ring-0 outline-none border-none"
            />
          </div>
          {feedback === "Rejected" ? (
            <FeedbackBox
              conversationMessage={row}
              feedback={feedback}
              onClose={() => setFeedback("")}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
