export function fallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  void error;

  return (
    <div role="alert" className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 py-8  max-w-md w-full mx-4 bg-white">
        <div
          className="flex w-16 h-16 justify-center items-center rounded-full"
          style={{ backgroundColor: "#fcd6d2" }}
        >
          <div
            className="w-12 h-12 rounded-full flex justify-center items-center"
            style={{ backgroundColor: "#dc2626" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Session Expired
          </h3>
          <p className="text-gray-600 mb-4">
            Document has been hidden for privacy due to inactivity.
          </p>
          <p className="cursor-pointer" onClick={resetErrorBoundary}>
            Click Here to Retry
          </p>
        </div>
      </div>
    </div>
  );
}
