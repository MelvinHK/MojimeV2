import { Link } from "@tanstack/react-router";
import { isAxiosError } from "axios";

interface ErrorProps {
  error: any;
}

function ErrorPage({ error }: ErrorProps) {
  const renderErrorMessage = () => {
    if (isAxiosError(error)) {
      const status = error.status;
      const message = status === 404 ? "Anime not found" : error.message;
      return (
        <div>Error {status ?? "Unknown Status"}: {message ?? "An unknown error occured for your request"}</div>
      );
    }

    return <div>Error: {error.message ?? "Something went wrong"}</div>
  }

  return (
    <div className="home-container">
      <Link to="/" title="Home">{"(っ °Д °;)っ"}</Link>
      {renderErrorMessage()}
    </div>
  );
}

export default ErrorPage;