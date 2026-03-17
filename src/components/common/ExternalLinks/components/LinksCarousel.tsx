import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ILink } from "../hooks/useGetLinks";
import CustomText from "../../../DesignSystem/Typography/CustomText";
import { ArrowRight } from "react-huge-icons/outline";

interface LinksCarouselProps {
  links: ILink[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function LinksCarousel({ links }: LinksCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [autoPlay, setAutoPlay] = useState(true);

  // Ensure smooth looping by handling negative indices
  const activeIndex = ((page % links.length) + links.length) % links.length;

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setPage(([prevPage]) => [prevPage + 1, 1]);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const paginate = (newDirection: number) => {
    setAutoPlay(false);
    setPage(([prevPage]) => {
      const nextPage = prevPage + newDirection;
      // Handle looping
      if (nextPage >= links.length) {
        return [0, newDirection];
      } else if (nextPage < 0) {
        return [links.length - 1, newDirection];
      }
      return [nextPage, newDirection];
    });
  };

  if (!links.length) return null;

  return (
    <div className="relative w-full border rounded-[12px] shadow-sm bg-white overflow-hidden">
      <div className="relative w-full p-4 pb-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full"
          >
            <div className="flex flex-col flex-1 gap-3">
              <div className="flex flex-col gap-2">
                <CustomText stylearr={[14, 18, 600]} wordBreak={"break-all"}>
                  {links[activeIndex].link_name}
                </CustomText>
                <CustomText
                  stylearr={[12, 18, 400]}
                  color="#555557"
                  wordBreak={"break-all"}
                >
                  {links[activeIndex].description}
                </CustomText>
              </div>

              <a
                href={links[activeIndex].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center h-[32px] border rounded-[12px] justify-center  gap-2 text-[#4169E1] hover:scale-105 transition-all duration-300"
              >
                <span className="text-[14px] font-medium">Know More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[6px] z-10">
          {links.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setAutoPlay(false);
                // Calculate shortest path to target index
                const diff = index - activeIndex;
                const shortestPath =
                  diff > links.length / 2
                    ? diff - links.length
                    : diff < -links.length / 2
                    ? diff + links.length
                    : diff;
                setPage([index, shortestPath > 0 ? 1 : -1]);
              }}
              className={`w-[6px] h-[6px] rounded-full cursor-pointer ${
                index === activeIndex ? "bg-[#4169E1]" : "bg-[#D9D9D9]"
              }`}
              animate={{
                scale: index === activeIndex ? 1 : 1,
                opacity: index === activeIndex ? 1 : 0.5,
              }}
              whileHover={{
                scale: 1.2,
                opacity: 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
