import { useRouteError } from "react-router-dom";
import { SystemState } from "../components";
import ErrorImg from "../assets/error.png";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  console.error("Routing error caught by boundary:", error);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SystemState
        imageSrc={ErrorImg}
        title="Oops! Something Went"
        highlight="Wrong"
        message={
          error?.statusText ||
          error?.message ||
          "We encountered an unexpected error while loading this page. Please try refreshing or return to the homepage."
        }
        actionType="navigate"
        actionLabel="Back to Home"
        actionTo="/"
      />
    </div>
  );
}
