import { Flex } from "@chakra-ui/react";
import { forwardRef } from "react";

const CustomDocumentInput = forwardRef((props: any, ref) => {
  return (
    <Flex flexDir="column" gridGap="8px">
      <input
        type="file"
        ref={ref}
        accept={props.accept?.join(", ")}
        style={{ display: "none" }}
        {...props}
        onChange={(e) => {
          if (e.target.files?.length === 0) return;
          //@ts-ignore
          const isAccepted = props.accept.some((suffix) =>
            e.target.files?.[0]?.name.endsWith(suffix)
          );

          if (isAccepted) props.onChange(e);
        }}
      />
    </Flex>
  );
});

export default CustomDocumentInput;
