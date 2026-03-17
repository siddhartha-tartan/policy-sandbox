import ExclamationSVG from "../../../../../assets/Icons/ExclamationSVG";

export const EmptyPolicyList = () => {
  return (
    <div className="flex flex-col gap-4 w-[14.68rem] justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-6">
        <ExclamationSVG />
        <p className="font-medium  text-center text-xl text-gray-600 mt-2 flex flex-col gap-2">
          No policies found{" "}
          <span className="font-normal text-center text-xs">
            No policies match your search criteria. Try adjusting your filters
            or search terms.
          </span>
        </p>
      </div>
    </div>
  );
};
