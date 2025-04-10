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
        "flex justify-between items-center min-h-12 px-4",
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
      className={cn("flex flex-col gap-4 px-4 py-4", props.className)}
    >
      {props.children}
    </div>
  );
};

const Footer: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div
      {...props}
      className={cn("flex justify-end items-center", props.className)}
    />
  );
};

export default {
  Header,
  Content,
  Footer,
  Container,
};
