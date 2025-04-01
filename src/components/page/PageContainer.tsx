import { cn } from "@/lib/utils/className";
import React, { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement>;

const PageContainer: React.FC<PageContainerProps> = ({ ...props }) => {
  return <div {...props} className={cn("px-8 pt-8", props.className)} />;
};

export default PageContainer;
