import React, { ReactNode, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingOverlayProps {
  message?: string;
  tip?: ReactNode;
  isLoading: boolean;
  spinnerSize?: "sm" | "md" | "lg";
  spinnerColor?: "green" | "blue" | "red" | "yellow" | "purple" | "gray";
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  tip,
  isLoading,
  spinnerSize = "lg",
  spinnerColor = "green",
}) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={isLoading}
      timeout={300}
      classNames={"scale-popover"}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={
          "fixed inset-0 z-[9999] flex flex-col py-30 md:py-40 md:px-10 bg-white p-4"
        }
      >
        <div className={"w-full flex flex-col"}>
          <p
            className={
              "text-black md:text-xl mb-3 font-medium whitespace-pre-line"
            }
          >
            {message}
          </p>

          <div className={"mb-30"}>
            <p className={"text-sm md:text-lg text-gray-4 whitespace-pre-line"}>
              {tip}
            </p>
          </div>

          <div className={"flex justify-center w-full md:mt-20"}>
            <LoadingSpinner size={spinnerSize} color={spinnerColor} />
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default LoadingOverlay;
