import FluentCode from "../../../assets/Icons/FluentCode";

export default function GPTResponseLoading() {
  return (
    <div className="flex gap-3 h-fit">
      <div className="rounded-full min-w-[48px] w-[48px] h-[48px]  bg-[#fff] text-[#000] flex justify-center items-center">
        <FluentCode />
      </div>
      <div className="w-[80px] h-[60px] flex items-center justify-center rounded-tl-[0px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[18px] bg-white border-[1px] border-[#0000000F]">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[#000] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#000] rounded-full animate-bounce-fast"></div>
          <div className="w-2 h-2 bg-[#000] rounded-full animate-bounce-fastest"></div>
        </div>
      </div>
    </div>
  );
}
