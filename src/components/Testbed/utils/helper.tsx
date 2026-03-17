import NoPolicySVG from "../../../assets/Icons/NoPolicySVG";

export const highlightMatch = (
  text: string,
  userInput: string
): JSX.Element | string => {
  if (!userInput) return text;

  const regex = new RegExp(`(${userInput})`, "gi"); // i is for case-insensitivity
  const parts = text?.split(regex); // e.g., if text is "PayEase" and userInput is "Pay", then ["", "Pay", "Ease"]

  return (
    <>
      {parts?.map((part, index) =>
        part.toLowerCase() === userInput.toLowerCase() ? (
          <span
            key={index}
            className="text-grey-900 font-extrabold underline underline-offset-2"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};
export const NoPolicyFound = () => {
  return (
    <div className="h-[258px] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-6">
        <NoPolicySVG />
        <p className="font-semibold text-gray-600 mt-2 ">No policy found</p>
      </div>
    </div>
  );
};
