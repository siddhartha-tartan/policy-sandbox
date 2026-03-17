import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import FluentCode from "../../../../../assets/Icons/FluentCode";
import { userStore } from "../../../../../store/userStore";
import { isLoadingAtom } from "../../../polygptAtom";

const getISTGreeting = () => {
  const now = new Date();
  // Convert to IST
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 5.5 * 60 * 60 * 1000);
  const hour = istTime.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 16) return "Good afternoon";
  return "Good evening";
};

export default function GPTHeader() {
  const { name } = userStore();
  const isLoading = useAtomValue(isLoadingAtom);
  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-full w-[44px] h-[44px] bg-[#000] text-white flex justify-center items-center">
        <FluentCode />
      </div>

      <p className="text-[24px] font-[700] text-[#263238]" key={`${isLoading}`}>
        {isLoading
          ? `PolyGPT`
          : `${getISTGreeting()}, ${name}`.split("")?.map((letter, i) => (
              <motion.span
                key={letter + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  delay: i * 0.05,
                }}
                style={{
                  display: "inline-block",
                  marginRight: letter === " " ? "0.25em" : "0.05em",
                }}
              >
                {letter}
              </motion.span>
            ))}
      </p>
    </div>
  );
}
