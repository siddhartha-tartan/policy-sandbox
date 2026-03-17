import {
  Box,
  Flex,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { systemColors } from "../../../../components/DesignSystem/Colors/SystemColors";

export default function EmailBulkBar({
  search,
  setSearch,
  emailToUserMapping,
  selectedRowIds,
  setSelectedRowIds,
  unSelectedRowIds,
  setUnSelectedRowIds,
  selectAll,
  emails,
  setEmails,
}: {
  search: string;
  setSearch: (e: string) => void;
  emailToUserMapping: Record<string, string>;
  selectedRowIds: Set<string>;
  setSelectedRowIds: Function;
  unSelectedRowIds: Set<string>;
  setUnSelectedRowIds: Function;
  selectAll: boolean;
  emails: string[];
  setEmails: Function;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: any) => {
    setSearch(e.target.value);
  };
  const [pastedEmails, setPastedEmails] = useState<string[]>([]);

  const isEmailInRecords = (search: string): boolean => {
    return Object.keys(emailToUserMapping).some((email) => email === search);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      if (
        validateEmail(search) &&
        !emails.includes(search) &&
        isEmailInRecords(search)
      ) {
        addEmails([search]);
      }
    }
  };

  useEffect(() => {
    if (pastedEmails?.length) {
      let filteredEmails = pastedEmails.filter((email: string) =>
        isEmailInRecords(email)
      );
      filteredEmails = filteredEmails?.filter(
        (emaill: string) => !emails.includes(emaill)
      );
      if (filteredEmails?.length) addEmails(filteredEmails);
    }
  }, [pastedEmails]);

  useEffect(() => {
    const handlePaste = (event: any) => {
      event.preventDefault();
      //@ts-ignore
      const data = (event.clipboardData || window.clipboardData).getData(
        "text"
      );
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const extractedEmails = data?.match(emailRegex) || [];
      if (extractedEmails?.length) {
        setPastedEmails(extractedEmails);
      }
    };
    const inputElement: any = inputRef.current;
    inputElement.addEventListener("paste", handlePaste);

    // Cleanup event listener on unmount
    return () => {
      inputElement.removeEventListener("paste", handlePaste);
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmails = (emailIds: string[]) => {
    const updatedEmails = [...emails];
    const updatedIds = new Set(selectedRowIds);
    const updatedUnselectedIds = new Set(unSelectedRowIds);
    emailIds?.forEach((item: string) => {
      const userId = emailToUserMapping?.[item];
      updatedEmails.push(item);
      if (selectAll) {
        updatedUnselectedIds?.delete(userId);
      } else {
        updatedIds.add(userId);
      }
    });
    setSelectedRowIds(updatedIds);
    setUnSelectedRowIds(updatedUnselectedIds);
    setEmails(updatedEmails);
    setSearch("");
    inputRef.current && inputRef.current.focus();
  };

  const removeEmail = (index: number, email: string) => {
    const userId = emailToUserMapping?.[email];
    if (selectAll) {
      const updatedUnSelectedIds = new Set(unSelectedRowIds);
      updatedUnSelectedIds.add(userId);
      setUnSelectedRowIds(updatedUnSelectedIds);
    } else {
      const updatedIds = new Set(selectedRowIds);
      updatedIds.delete(userId);
      setSelectedRowIds(updatedIds);
    }
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <Flex
      bgColor={"#FAFAFA"}
      p={"24px"}
      pb={"12px"}
      className="rounded-t-[16px]"
    >
      <Flex
        px={"16px"}
        alignItems={"center"}
        w={"full"}
        overflowX={"scroll"}
        bgColor={systemColors.white.absolute}
        borderRadius={"10px"}
        borderColor={systemColors.grey[300]}
        borderWidth={"1px"}
        contentEditable={false}
        _focusVisible={{ borderColor: systemColors.grey[300], outline: "none" }}
        flexWrap="wrap"
        minH={"54px"}
      >
        {emails?.map((email, index) => (
          <Tag
            key={index}
            size="lg"
            borderRadius="full"
            variant="solid"
            bgColor={systemColors.black.absolute}
            fontSize={"14px"}
            fontWeight={"500"}
            m="1"
          >
            <TagLabel>{email}</TagLabel>
            <TagCloseButton onClick={() => removeEmail(index, email)} />
          </Tag>
        ))}
        <Box flex="1">
          <Input
            ref={inputRef}
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            border="none"
            outline="none"
            m={0}
            fontSize={"14px"}
            p={0}
            _focus={{ outline: "none" }}
            _focusVisible={{
              borderColor: systemColors.grey[300],
              outline: "none",
            }}
            placeholder="Paste User email ID for bulk selection"
          />
        </Box>
      </Flex>
    </Flex>
  );
}
