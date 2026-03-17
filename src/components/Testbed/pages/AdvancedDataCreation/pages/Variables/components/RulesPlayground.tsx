import { Flex, HStack, StackDivider, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { LuVariable } from "react-icons/lu";
import CommonSearchBar from "../../../../../../common/CommonSearchBar";
import CustomText from "../../../../../../DesignSystem/Typography/CustomText";
import { uniqueVariablesAtom } from "../../../advancedDataCreationAtom";
import { Variable } from "../../../hooks/useGetVariables";
import RuleConfig from "./RuleConfig";

interface RuleDetailsProps {
  rule: Variable;
}

const RuleDetails: React.FC<RuleDetailsProps> = ({ rule }) => (
  <HStack divider={<StackDivider />} className="w-full gap-3  items-start flex">
    <div className="min-h-[160px] w-[60%] flex-grow bg-[#FAFAFA] h-full">
      <RuleConfig rule={rule} />
    </div>
    <div className="w-[40%] bg-[#FAFAFA] rounded-[12px] p-4 flex flex-col gap-4 h-fit overflow-y-auto">
      {rule?.rules?.map((row) => (
        <CustomText key={row.rule_id} stylearr={[12, 16, 500]}>
          {row.rule_description}
        </CustomText>
      ))}
    </div>
  </HStack>
);

export default function RulesPlayground() {
  const variables = useAtomValue(uniqueVariablesAtom);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVariables = variables?.filter((variable) =>
    variable?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="w-full bg-white rounded-[12px] flex flex-col flex-grow overflow-y-auto">
      <div className="border-b-[1px] px-6 gap-6 border-b-[#00000014] w-full h-[74px] min-h-[74px] items-center flex">
        <div className="flex gap-1 items-center">
          <Flex className="min-w-5 h-5 w-5 justify-center items-center">
            <LuVariable />
          </Flex>
          <CustomText stylearr={[16, 20, 700]}>Variables</CustomText>
        </div>
        <CommonSearchBar
          flexGrow={1}
          maxH={"44px"}
          h={"44px"}
          maxW={"425px"}
          py={2}
          px={4}
          handleChange={handleSearch}
          placeholder={"Find Variable"}
        />
      </div>
      <VStack
        divider={<StackDivider />}
        className="overflow-y-auto gap-3 p-4 flex min-w-full"
      >
        {filteredVariables.length > 0 ? (
          filteredVariables?.map((variable, index) => (
            <div
              key={`variable-${index}`}
              id={`variable-${variable.id}`}
              className="w-full justify-between items-center flex flex-col"
            >
              <RuleDetails rule={variable} />
            </div>
          ))
        ) : (
          <div className="w-full py-4 text-center">
            <CustomText stylearr={[14, 18, 500]}>
              No variables found matching "{searchTerm}"
            </CustomText>
          </div>
        )}
      </VStack>
    </div>
  );
}
