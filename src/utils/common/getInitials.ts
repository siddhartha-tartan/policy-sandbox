export const getInitials = (name: string): string => {
  const words = name?.trim()?.split(" ");
  const firstName = words[0];
  const lastName = words?.length > 1 ? words[words.length - 1] : " ";

  return `${firstName[0]}${lastName?.[0]}`;
};
