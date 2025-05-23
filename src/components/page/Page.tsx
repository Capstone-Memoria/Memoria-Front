import { cn } from "@/lib/utils/className";
import React, { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

const Container: React.FC<PageContainerProps> = ({ ...props }) => {
  return <div {...props} className={cn("", props.className)} />;
};

const Header: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "flex justify-between items-center h-12 pt-4 px-4",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const Content: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={cn("px-4 py-4 overflow-y-auto flex-grow", props.className)}
    >
      <div>{props.children}</div>
    </div>
  );
};

const Footer: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return <div {...props} className={cn("py-4 px-4", props.className)} />;
};

export default {
  Header,
  Content,
  Footer,
  Container,
};
