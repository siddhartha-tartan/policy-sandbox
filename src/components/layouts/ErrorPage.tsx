import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { userStore } from "../../store/userStore";
import { isPublicRoute } from "../../utils/helpers/isPublicRoute";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }
  const { homeRoute } = userStore();
  const { userType } = userStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const currentPath = window.location.pathname;

  useEffect(() => {
    if (!token || !userType) {
      navigate("/login");
      return;
    }
    if (isPublicRoute(currentPath)) navigate(homeRoute);
  }, [token]);

  return (
    <div
      id="error-page"
      className="flex flex-col gap-8 justify-center items-center h-screen"
    >
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
