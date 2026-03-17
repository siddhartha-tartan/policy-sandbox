import { Flex, Text } from "@chakra-ui/react";
import PageLayout from "./PageLayout";

const ErrorPage = ({ title = "data" }) => {
  return (
    <PageLayout>
      <Flex align="center" justify="center" h="full">
        <Text color="red.500">Failed to load {title}!</Text>
      </Flex>
    </PageLayout>
  );
};

export default ErrorPage;
