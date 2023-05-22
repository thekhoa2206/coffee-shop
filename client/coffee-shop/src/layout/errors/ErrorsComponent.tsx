
import NotFound from "page/NotFound";
import React from "react";
import { useParams } from "react-router-dom";

export function ErrorsComponent(props: any) {
  let { errorCode } = useParams<{ [key: string]: string }>();

  let ErrorComponent = null;

  switch (errorCode) {
    case "404":
      ErrorComponent = NotFound;
      break;
    default:
      ErrorComponent = NotFound;
  }

  return <ErrorComponent />;
}

export default ErrorsComponent;
