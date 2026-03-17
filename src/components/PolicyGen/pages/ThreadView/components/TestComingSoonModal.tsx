import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { File, SpeedTest, TrackPlay } from "react-huge-icons/solid";
import { FiArrowLeft, FiCode, FiSettings } from "react-icons/fi";
import { PiClockCounterClockwise } from "react-icons/pi";
import EventBus from "../../../../../EventBus";
import CustomModal from "../../../../common/CustomModal";
import CustomButton from "../../../../DesignSystem/CustomButton";
import CustomText from "../../../../DesignSystem/Typography/CustomText";
import { stepAtom } from "../threadAtom";

const CONTENT_CONFIG = {
  logic: {
    icon: FiSettings,
    title: "Test Logic",
    subtitle: "Automate Test Data Generation with BRE Rules and Variables",
    features: [
      {
        icon: SpeedTest,
        title: "Generate Test Data Automatically",
        desc: "Create test scenarios with intelligent data generation",
      },
      {
        icon: File,
        title: "Create Comprehensive Test Cases",
        desc: "Design through test suites for complete coverage",
      },
      {
        icon: PiClockCounterClockwise,
        title: "Leverage Legacy BRE Data",
        desc: "Utilize existing rules and data for testing",
      },
      {
        icon: TrackPlay,
        title: "Run Simulations",
        desc: "Test your rules with real-world scenarios",
      },
    ],
    cta: "Go Back to Rules",
  },
  code: {
    icon: FiCode,
    title: "Test Code",
    subtitle: "Automate Test Data Generation with BRE Rules and Variables",
    features: [
      {
        icon: SpeedTest,
        title: "Generate Test Data Automatically",
        desc: "Create test scenarios with intelligent data generation",
      },
      {
        icon: File,
        title: "Create Extensive Testcases",
        desc: "Design test suites to verify all code paths and edge cases",
      },
      {
        icon: PiClockCounterClockwise,
        title: "Leverage Existing Code Base",
        desc: "Utilize current codebase patterns and test frameworks",
      },
      {
        icon: TrackPlay,
        title: "Run Unit Tests",
        desc: "Validate your code with real-world scenarios and dependencies",
      },
    ],
    cta: "Go Back to Code",
  },
};
export const EVENT_OPEN_TEST_COMING_SOON_MODAL =
  "EVENT_OPEN_TEST_COMING_SOON_MODAL";

export default function TestComingSoonModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"logic" | "code">("logic");
  const config = CONTENT_CONFIG[type];

  useEffect(() => {
    const handleModalOpen = (modalType: "logic" | "code") => {
      setType(modalType);
      setIsOpen(true);
    };

    EventBus.getInstance().addListener(
      EVENT_OPEN_TEST_COMING_SOON_MODAL,
      (e: any) => handleModalOpen(e)
    );
    return () =>
      EventBus.getInstance().removeListener((e: any) => handleModalOpen(e));
  }, []);

  const onClose = () => setIsOpen(false);
  const setStep = useSetAtom(stepAtom);

  if (!isOpen) return null;

  return (
    <CustomModal
      w={"675px"}
      className="rounded-[12px] bg-white px-[24px] py-[27px] flex flex-col gap-[42px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6">
        {/* Badge and Title */}
        <div className="space-y-4">
          <span className="inline-block bg-[#E8EAF6] rounded-[4px] text-[#1A237E] p-2 text-[14px] font-bold">
            Coming Soon
          </span>
          <div className="space-y-2 w-full">
            <h2 className="text-2xl font-bold">{config.title}</h2>
            <p className="text-gray-600">{config.subtitle}</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6">
          {config.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <div className="text-[#3762DD]">
                <feature.icon className="w-5 h-5 mt-[2px]" />
              </div>
              <div className="flex gap-2 flex-col">
                <CustomText stylearr={[16, 22, 700]}>
                  {feature.title}
                </CustomText>
                <CustomText stylearr={[12, 16, 500]}>{feature.desc}</CustomText>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <CustomButton
            style={{
              background: `linear-gradient(95.11deg, #3762DD -1.14%, #1D3577 158.31%)`,
            }}
            onClick={() => {
              setStep(0);
              onClose();
            }}
            w={"175px"}
          >
            Go Back to Rules
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8">
        <div className="space-y-6">
          {/* Badge and Title */}
          <div className="space-y-4 text-center">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              Coming Soon
            </span>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{config.title}</h2>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {config.features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="text-blue-600">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>{config.cta}</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
