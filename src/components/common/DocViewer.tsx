import { Box, BoxProps, Flex, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiEdit3,
  FiEye,
  FiSave,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";
import { LuHeading1, LuHeading2, LuHeading3, LuListOrdered, LuRedo, LuUndo } from "react-icons/lu";
import { systemColors } from "../DesignSystem/Colors/SystemColors";

interface DocViewerProps extends BoxProps {
  htmlContent: string;
  fileName?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <Tooltip label={label} placement="top" hasArrow>
      <IconButton
        aria-label={label}
        icon={icon}
        size="sm"
        variant={isActive ? "solid" : "ghost"}
        colorScheme={isActive ? "blue" : "gray"}
        onClick={onClick}
        minW="32px"
        h="32px"
      />
    </Tooltip>
  );
}

function ToolbarDivider() {
  return <Box w="1px" h="24px" bg="gray.300" mx={1} />;
}

export default function DocViewer({
  htmlContent,
  fileName,
  onSave,
  readOnly = false,
  ...props
}: DocViewerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(htmlContent);
  const editorRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleSave = useCallback(() => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setContent(updatedContent);
      onSave?.(updatedContent);
      setIsEditing(false);
      toast({
        title: "Document saved",
        description: fileName ? `${fileName} has been saved successfully.` : "Changes saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [fileName, onSave, toast]);

  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [isEditing]);

  return (
    <Flex direction="column" h="full" w="full" {...props}>
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2}
        bg="gray.50"
        borderBottom="1px solid"
        borderColor="gray.200"
        borderTopRadius="8px"
        flexShrink={0}
      >
        <Flex align="center" gap={1} flexWrap="wrap">
          {isEditing && (
            <>
              <ToolbarButton icon={<FiBold />} label="Bold" onClick={() => execCommand("bold")} />
              <ToolbarButton icon={<FiItalic />} label="Italic" onClick={() => execCommand("italic")} />
              <ToolbarButton icon={<FiUnderline />} label="Underline" onClick={() => execCommand("underline")} />
              <ToolbarDivider />
              <ToolbarButton icon={<LuHeading1 />} label="Heading 1" onClick={() => execCommand("formatBlock", "h1")} />
              <ToolbarButton icon={<LuHeading2 />} label="Heading 2" onClick={() => execCommand("formatBlock", "h2")} />
              <ToolbarButton icon={<LuHeading3 />} label="Heading 3" onClick={() => execCommand("formatBlock", "h3")} />
              <ToolbarDivider />
              <ToolbarButton icon={<FiList />} label="Bullet List" onClick={() => execCommand("insertUnorderedList")} />
              <ToolbarButton icon={<LuListOrdered />} label="Numbered List" onClick={() => execCommand("insertOrderedList")} />
              <ToolbarDivider />
              <ToolbarButton icon={<FiAlignLeft />} label="Align Left" onClick={() => execCommand("justifyLeft")} />
              <ToolbarButton icon={<FiAlignCenter />} label="Align Center" onClick={() => execCommand("justifyCenter")} />
              <ToolbarButton icon={<FiAlignRight />} label="Align Right" onClick={() => execCommand("justifyRight")} />
              <ToolbarDivider />
              <ToolbarButton icon={<LuUndo />} label="Undo" onClick={() => execCommand("undo")} />
              <ToolbarButton icon={<LuRedo />} label="Redo" onClick={() => execCommand("redo")} />
            </>
          )}
        </Flex>

        {!readOnly && (
          <Flex gap={2} flexShrink={0}>
            {isEditing && (
              <ToolbarButton
                icon={<FiSave />}
                label="Save"
                onClick={handleSave}
              />
            )}
            <ToolbarButton
              icon={isEditing ? <FiEye /> : <FiEdit3 />}
              label={isEditing ? "View Mode" : "Edit Mode"}
              onClick={handleToggleEdit}
              isActive={isEditing}
            />
          </Flex>
        )}
      </Flex>

      <Box
        ref={editorRef}
        contentEditable={isEditing}
        dangerouslySetInnerHTML={{ __html: content }}
        flex={1}
        overflowY="auto"
        p={10}
        bg={systemColors.white.absolute}
        borderBottomRadius="8px"
        outline="none"
        sx={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "14px",
          lineHeight: "1.8",
          color: "#2d3748",
          "& h1": {
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
            marginTop: "24px",
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          },
          "& h2": {
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "8px",
            marginTop: "20px",
            color: "#2b6cb0",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "4px",
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          },
          "& h3": {
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "6px",
            marginTop: "16px",
            color: "#4a5568",
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          },
          "& p": { marginBottom: "12px" },
          "& ul, & ol": { paddingLeft: "24px", marginBottom: "12px" },
          "& li": { marginBottom: "4px" },
          "& table": { width: "100%", borderCollapse: "collapse", marginY: "16px" },
          "& th, & td": {
            border: "1px solid #cbd5e0",
            padding: "8px 12px",
            textAlign: "left",
          },
          "& th": { backgroundColor: "#edf2f7", fontWeight: 600 },
          "& hr": { border: "none", borderTop: "2px solid #e2e8f0", marginY: "16px" },
          "& strong": { fontWeight: 700 },
          "& em": { fontStyle: "italic" },
          ...(isEditing && {
            border: "2px solid",
            borderColor: "blue.300",
            cursor: "text",
            boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.3)",
          }),
        }}
      />
    </Flex>
  );
}
