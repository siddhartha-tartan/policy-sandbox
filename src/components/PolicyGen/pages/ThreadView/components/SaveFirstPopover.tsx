import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

export default function SaveFirstPopover({
  children,
  showContent = true,
}: {
  children: React.ReactNode;
  showContent?: boolean;
}) {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>{children}</PopoverTrigger>
      {showContent && (
        <PopoverContent className="w-fit">
          <PopoverArrow />
          <PopoverHeader className="text-[14px] font-[600]">
            Please save unsaved changes first.
          </PopoverHeader>
        </PopoverContent>
      )}
    </Popover>
  );
}
