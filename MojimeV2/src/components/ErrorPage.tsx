import { Link } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { PAGE_NOT_FOUND_ERROR } from "../main";

interface ErrorProps {
  error?: any;
  customError?: string;
}

function ErrorPage({ error, customError }: ErrorProps) {
  const renderErrorMessage = () => {
    if (customError) {
      return <div>{customError}</div>
    }

    if (error === PAGE_NOT_FOUND_ERROR) {
      return <div>Error 404: Page not found</div>
    }

    if (isAxiosError(error)) {
      const status = error.status;
      const message = status === 404 ? "Anime not found" : error.message;
      return (
        <div>Error {status ?? "Unknown Status"}: {message ?? "Something went wrong during the request..."}</div>
      );
    }

    return <div>Error: Something went wrong</div>
  }

  return (
    <div className="home-container">
      <Link to="/" title="Home">{"(っ °Д °;)っ"}</Link>
      {renderErrorMessage()}
    </div>
  );
}

export default ErrorPage;