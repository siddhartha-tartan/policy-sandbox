export function getHrPortalColorConfig() {
  return {
    primary: "#7D152B",
    primaryLight: "#B3475D",
    secondary:
      "linear-gradient(95deg,rgba(125, 21, 43, 0.06) -1.14%, rgba(179, 71, 93, 0.06) 158.31%)",
    textPrimary: "#7D152B",
    textSecondary: "#8B4A5C",
    textMuted: "#A66B77",
    backgroundLight: "#FDF9FA",
    backgroundHover: "#F8F2F4",
    border: "#E8D5DA",
    conversationBg: "#FFFFFF",
    conversationBgActive: "rgba(125, 21, 43, 0.08)",
    conversationBgHover: "#FDF9FA",
    // MultiSelect specific colors
    selectedOptionBg:
      "linear-gradient(95deg,rgba(125, 21, 43, 0.06) -1.14%, rgba(179, 71, 93, 0.06) 158.31%)",
    primaryTextGradient:
      "linear-gradient(95deg, #7D152B -1.14%, #B3475D 158.31%)",
    boxShadow:
      "-2px -2px 3px 0px rgba(125, 21, 43, 0.20), 2px 2px 2px 0px rgba(125, 21, 43, 0.20)",
    menuItemHover:
      "linear-gradient(231deg, rgba(125, 21, 43, 0.00) 13.46%, rgba(125, 21, 43, 0.20) 194.11%)",
    checkbox: "#7D152B",
  };
}

// Default color configuration for non-HR portal
export function getDefaultColorConfig() {
  return {
    primary: "#3762DD",
    primaryLight: "#1D3577",
    secondary:
      "linear-gradient(95deg, rgba(55, 98, 221, 0.12) -1.14%, rgba(29, 53, 119, 0.12) 158.31%)",
    textPrimary: "#3762DD",
    textSecondary: "#1D3577",
    textMuted: "#6B7280",
    backgroundLight: "#F9FAFB",
    backgroundHover: "#F3F4F6",
    border: "#D1D5DB",
    conversationBg: "#FFFFFF",
    conversationBgActive: "rgba(55, 98, 221, 0.08)",
    conversationBgHover: "#F9FAFB",
    // MultiSelect specific colors
    selectedOptionBg:
      "linear-gradient(95deg, rgba(55, 98, 221, 0.12) -1.14%, rgba(29, 53, 119, 0.12) 158.31%)",
    primaryTextGradient:
      "linear-gradient(95deg, #3762DD -1.14%, #1D3577 158.31%)",
    boxShadow:
      "-2px -2px 3px 0px rgba(55, 98, 221, 0.20), 2px 2px 2px 0px rgba(55, 98, 221, 0.20)",
    menuItemHover:
      "linear-gradient(231deg, rgba(55, 98, 221, 0.00) 13.46%, rgba(55, 98, 221, 0.20) 194.11%)",
    checkbox: "#176FC1",
  };
}
