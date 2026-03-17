import { BoxProps } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function AnimatedSkeleton({ ...props }: BoxProps) {
  const getRandomDelay = () => Math.random() * (3 - 1) + 1; // Random delay between 1-3 seconds
  const getRandomDuration = () => Math.random() * (2 - 1) + 1; // Random duration between 1-5 seconds

  return (
    <MotionBox
      w="full"
      h="124px"
      bgGradient="linear(to-r, #e5f1ff, #f4f6f7, #d6eaf8)"
      bgSize="200% 100%"
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"], // Left-to-right and back
      }}
      //@ts-ignore
      transition={{
        delay: getRandomDelay(),
        duration: getRandomDuration(),
        repeat: Infinity,
        ease: "easeInOut", // Smooth easing
      }}
      sx={{
        overflow: "hidden",
      }}
      {...props}
    />
  );
}
