import { ChevronDownIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IS_HR_PORTAL } from "../../../../../../utils/constants/endpoints";
import CustomText from "../../../../../DesignSystem/Typography/CustomText";
import { IAddUser } from "../../../hooks/useAddUsers";
import BasicInfoForm from "./BasicInfoForm";
import FeatureAccessForm from "./FeatureAccessForm";

// Types for the separate parts of the data
type BasicInfoData = Omit<IAddUser, "feature_ids">;
type FeatureAccessData = Pick<IAddUser, "feature_ids">;

export default function UserForm({
  data,
  setData,
  setError,
  isEdit = false,
}: {
  data: IAddUser;
  setData: (e: IAddUser) => void;
  setError: (e: boolean) => void;
  isEdit?: boolean;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    ai: true,
  });

  // Separate state for basic info and feature access
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(() => {
    const { feature_ids, ...rest } = data;
    return rest as BasicInfoData;
  });
  const [featureAccess, setFeatureAccess] = useState<FeatureAccessData>({
    feature_ids: data?.feature_ids || [],
  } as FeatureAccessData);

  // Handle updates from BasicInfoForm
  const handleBasicInfoUpdate = (updatedBasicInfo: BasicInfoData) => {
    setBasicInfo(updatedBasicInfo);
    setData({ ...updatedBasicInfo, feature_ids: featureAccess.feature_ids });
  };

  // Handle updates from FeatureAccessForm
  const handleFeatureAccessUpdate = (
    updatedFeatureAccess: FeatureAccessData,
  ) => {
    setFeatureAccess(updatedFeatureAccess);
    setData({ ...basicInfo, feature_ids: updatedFeatureAccess.feature_ids });
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formSections = [
    {
      id: "basic",
      title: "Basic information",
      description: "Enter the employee's basic details",
      content: (
        <BasicInfoForm
          data={basicInfo}
          setData={handleBasicInfoUpdate}
          setError={setError}
          isEdit={isEdit}
        />
      ),
    },
    ...(!IS_HR_PORTAL
      ? [
          {
            id: "ai",
            title: "AI Feature Access",
            description:
              "Manage special AI-powered capabilities assigned to this user",
            content: (
              <FeatureAccessForm
                data={featureAccess}
                setData={handleFeatureAccessUpdate}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div
      className={`flex flex-col gap-6 ${
        !isEdit && "px-4 py-6 border rounded-[8px]"
      }`}
    >
      {formSections.map((section, sectionIndex) => (
        <div key={section.id} className="flex flex-col gap-6">
          <motion.button
            className="flex flex-row justify-between cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex flex-col gap-2 text-left">
              <CustomText stylearr={[16, 20, 600]} color={"#141414"}>
                {section.title}
              </CustomText>
              <CustomText stylearr={[12, 18, 400]} color={"#555557"}>
                {section.description}
              </CustomText>
            </div>
            <motion.div
              initial={false}
              animate={{ rotate: openSections[section.id] ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDownIcon />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openSections[section.id] && <div>{section.content}</div>}
          </AnimatePresence>

          {sectionIndex < formSections.length - 1 && (
            <Divider variant={"dashed"} />
          )}
        </div>
      ))}
    </div>
  );
}
