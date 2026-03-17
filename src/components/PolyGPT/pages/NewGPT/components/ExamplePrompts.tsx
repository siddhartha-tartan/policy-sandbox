import { Grid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { queryAtom } from "../../../polygptAtom";

const MotionDiv = motion.div;
const MotionGrid = motion(Grid);

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.01, brightness: 1.1 },
  tap: { scale: 0.99 },
};

const iconVariants = {
  hover: { x: 5 },
  tap: { x: 0 },
};

export default function ExamplePrompts() {
  const setQuery = useSetAtom(queryAtom);

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center items-center gap-[25px]"
    >
      <MotionDiv
        variants={childVariants}
        className="w-full text-[20px] font-[600] leading-[24px] text-center text-[#263238]"
      >
        Example prompts
      </MotionDiv>
      <MotionGrid
        variants={containerVariants}
        templateColumns={"repeat(2, 1fr)"}
        rowGap={"11px"}
        columnGap={"22px"}
        className="w-full"
      >
        {[
          "Who have created the MSME policy?",
          "Brief me about 2 wheeler loan policy",
          "Give me financing details of student loan policy",
          "What are the borrower's age criteria according to the MSME Policy?", 
        ].map((row) => {
          return (
            <MotionDiv
              variants={childVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                setQuery(row);
              }}
              key={`example-${row}`}
              className="flex text-[14px] cursor-pointer font-[500] leading-[19px] py-3 px-6 items-center justify-between border-[1px] border-[#B0BEC5] bg-[#ECEFF1] rounded-[12px] text-[#455A64]"
            >
              <p className="w-[80%]">{row}</p>
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <HiOutlineArrowNarrowRight fontSize={"20px"} />
              </motion.div>
            </MotionDiv>
          );
        })}
      </MotionGrid>
    </MotionDiv>
  );
}
