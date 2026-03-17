import { VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import AddEditQuestion from "../../../../../../components/common/AddEditQuestion";
import McqBox from "../../../../../../components/common/McqBox";
import { editAtom } from "../../../atom";
import { IQuestions } from "../hooks/useGetAssesment";

export default function QuestionsTab({ data }: { data: IQuestions[] }) {
  const edit = useAtomValue(editAtom);
  const [questions, setQuestions] = useState<IQuestions[]>(data);
  useEffect(() => {
    setQuestions(data);
  }, [data]);

  if (edit) {
    return (
      <VStack gap={"24px"} w={"full"}>
        <AddEditQuestion questions={questions} setQuestions={setQuestions} />
      </VStack>
    );
  }

  return (
    <VStack gap={"24px"} w={"full"}>
      {questions?.map((row, id) => (
        <McqBox
          key={row.id}
          index={id + 1}
          correct_answer={row.correctedAnswer}
          question={row.question}
          options={row.options}
        />
      ))}
    </VStack>
  );
}
