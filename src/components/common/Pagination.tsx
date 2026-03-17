import { Button, Flex } from "@chakra-ui/react";
import * as React from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import CommonDropdownComponent from "./CommonDropdownComponent";
import CustomText from "../DesignSystem/Typography/CustomText";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageSize?: number;
  setPageSize?: (page: number) => void;
  totalCount?: number;
}

const ArrowButton: React.FC<{
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}> = ({ direction, onClick, disabled }) => {
  return (
    <Button
      minH="32px"
      maxH="32px"
      maxW="32px"
      minW="32px"
      bgColor="#fff"
      border="1px solid #F1F2F4"
      onClick={onClick}
      disabled={disabled}
      isDisabled={disabled}
      p={0}
      m={0}
      fontSize="16px"
      fontWeight={800}
      borderRadius="10px"
      _disabled={{ color: "#A0AEC0" }}
    >
      {direction === "left" ? <GoChevronLeft /> : <GoChevronRight />}
    </Button>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
  totalCount,
}) => {
  const [pageButtons, setPageButtons] = React.useState<(number | string)[]>([]);

  const generatePageButtons = React.useCallback(() => {
    const arr: (number | string)[] = [];
    if (totalPages > 6) {
      if (page <= 2) {
        arr.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) {
        arr.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        if (page === 3) {
          arr.push(1, 2, 3, 4, "...", totalPages);
        } else if (page === totalPages - 2) {
          arr.push(
            1,
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          );
        } else {
          arr.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        }
      }
    } else {
      Array.from({ length: totalPages }, (_, i) => i + 1).forEach((number) =>
        arr.push(number)
      );
    }
    setPageButtons(arr);
  }, [page, totalPages]);

  React.useEffect(() => {
    generatePageButtons();
  }, [page, totalPages, generatePageButtons]);

  const handlePageChange = (pageNum: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(pageNum);
  };

  const renderButton = (pageNum: number | string) => {
    const isActive = page === pageNum;
    return (
      <Flex
        key={pageNum}
        userSelect={"none"}
        p={0}
        m={0}
        justifyContent={"center"}
        cursor={pageNum !== "..." ? "pointer" : "initial"}
        alignItems={"center"}
        borderRadius="10px"
        onClick={() => pageNum !== "..." && handlePageChange(Number(pageNum))}
        w="32px"
        h="32px"
        bgColor={isActive ? "#F8F8F8" : "#fff"}
        fontSize={"14px"}
        lineHeight={"20px"}
        fontWeight={600}
        color={"#111827"}
      >
        {pageNum}
      </Flex>
    );
  };

  if (!totalPages || totalPages <= 1) {
    return <React.Fragment />;
  }

  if (totalPages <= 1) return null;
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex w-full flex-row justify-between items-center h-[68px]">
      <Flex gap="24px" alignItems={"center"}>
        <ArrowButton
          direction="left"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        />
        <Flex gap={0}>{pageButtons.map(renderButton)}</Flex>
        <ArrowButton
          direction="right"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        />
      </Flex>
      {pageSize && totalCount && setPageSize && (
        <div className="flex flex-row gap-4 items-center">
          <CustomText stylearr={[12, 19, 500]} color={"#555557"}>
            Showing {(page - 1) * 10 + 1} to{" "}
            {page * 10 > totalCount ? totalCount : page * 10} of {totalCount}{" "}
            entries
          </CustomText>
          <CommonDropdownComponent
            options={[
              { label: "Show 10", value: "10" },
              { label: "Show 20", value: "20" },
              { label: "Show 30", value: "30" },
            ]}
            value={pageSize?.toString()}
            onChange={(e: string) => {
              setPageSize(parseInt(e));
            }}
            className="h-[32px] w-[87px]"
            matchWidth={false}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;
