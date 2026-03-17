import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { marked } from "marked";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const MotionFlex = motion(Flex);
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4, // Delay between children animations
    },
  },
};
export default function Summary({ data }: Readonly<{ data: string }>) {
  const htmlString = data !== "" ? marked.parse(data) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1, // Stagger animation
        duration: 0.3,
        ease: "easeOut",
      }}
      className="w-full min-h-[400px] overflow-auto py-4"
    >
      <style>
        {`
  /* Base typography styles */
  .markdown-content {
    padding: 1.5rem;
    max-width: none;
    color: #141414;
    line-height: 1.625;
  }

  /* Headings */
  .markdown-content h1, 
  .markdown-content h2, 
  .markdown-content h3, 
  .markdown-content h4, 
  .markdown-content h5, 
  .markdown-content h6 {
    margin: 0;
    padding: 0;
    line-height: 1.0;
  }

  .markdown-content h1 {
    font-size: 1.25rem; /* text-3xl */
    font-weight: 700; /* font-bold */
    color: #3762DD; /* text-indigo-800 */
    padding-bottom: 0.5rem; /* pb-2 */
  }

  .markdown-content h2 {
    font-size: 1.2rem; /* text-2xl */
    font-weight: 600; /* font-semibold */
    color: #141414; /* text-indigo-700 */
  }

  .markdown-content h3 {
    font-size: 1.125rem; /* text-xl */
    font-weight: 600; /* font-medium */
    color: #141414; /* text-indigo-600 */
    margin-top: .75rem;
  }

  .markdown-content h4 {
    font-size: 1rem;
    font-weight: 500;
    color: #6366f1; /* text-indigo-500 */
  }

  .markdown-content h5 {
    font-size: .875rem;
    font-weight: 500;
    color: #7c85fa; /* text-indigo-400 */
  }

  .markdown-content h6 {
    font-size: 0.75rem;
    font-weight: 500;
    color: #818cf8; /* text-indigo-300 */
  }

  /* Paragraphs */
  .markdown-content p {
    margin-top: 0.5rem; /* my-3 */
    margin-bottom: 0.75rem; /* my-3 */
    color: #141414; /* text-gray-700 */
    line-height: 1.625; /* leading-relaxed */
    font-size:.75rem;
  }

  /* Lists */
  .markdown-content ul {
    list-style-type: disc; /* list-disc */
    padding-left: 1.5rem; /* pl-6 */
    color: #141414; /* text-gray-700 */
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .markdown-content ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    color: #141414;
  }

  /* Horizontal rule */
  .markdown-content hr {
    border: 0;
    border-top: 2px solid #f3f4f6; /* border-t-2 border-gray-100 */
  }

  /* Bold text */
  .markdown-content strong {
    font-weight: 600;
    color: #1f2937; /* text-gray-800 */
  }

  /* Blockquotes */
  .markdown-content blockquote {
    border-left: 4px solid #c7d2fe; /* border-l-4 border-indigo-200 */
    padding-left: 1rem;
    color: #6b7280; /* text-gray-500 */
    font-style: italic;
    margin: 1rem 0;
  }

  /* Code blocks */
  .markdown-content code {
    font-family: monospace;
    background-color: #f3f4f6; /* bg-gray-100 */
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .markdown-content pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  /* Links */
  .markdown-content a {
    color: #4f46e5; /* text-indigo-600 */
    text-decoration: underline;
  }

  .markdown-content a:hover {
    color: #3762DD; /* text-indigo-700 */
  }

  /* Tables */
  .markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .markdown-content th {
    background-color: #f9fafb; /* bg-gray-50 */
    border-bottom: 2px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;
    font-weight: 600;
  }

  .markdown-content td {
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem;
  }
`}
      </style>
      <MotionFlex
        className="w-full p-4 border-[1px] h-full border-[#ECEFF1] rounded-[16px] gap-3 flex-col flex overflow-auto"
        initial="hidden"
        boxShadow={"#fff"}
        animate="visible"
        variants={containerVariants}
      >
        {htmlString ? (
          <Flex className="flex-col gap-[32px] overflow-auto">
            <Flex className="p-[20px] gap-[10px] flex-col w-full markdown-content">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {data?.replace("```markdown", "").replace("```", "")}
              </ReactMarkdown>
            </Flex>
          </Flex>
        ) : null}
      </MotionFlex>
    </motion.div>
  );
}
