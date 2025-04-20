import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { KeywordInputPanel } from "./KeywordInputPanel";
import { PreviewCoverPanel } from "./PreviewCoverPanel";

interface CreateCoverImageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CreateCoverImageDrawer = ({
  open,
  onOpenChange,
  children,
}: CreateCoverImageDrawerProps) => {
  const [currentPanel, setCurrentPanel] = useState<"keyword" | "preview">(
    "keyword"
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={"min-h-[70%]"}>
        <div
          className={
            "flex overflow-hidden w-fit flex-1 transition-transform duration-500 ease-expo-out"
          }
          style={{
            transform: `translateX(-${currentPanel === "keyword" ? 0 : 100}vw)`,
          }}
        >
          <div className={"w-screen px-4 flex flex-col flex-shrink-0"}>
            <KeywordInputPanel onNext={() => setCurrentPanel("preview")} />
          </div>
          <div className={"w-screen px-4 flex flex-col flex-shrink-0"}>
            <PreviewCoverPanel onBack={() => setCurrentPanel("keyword")} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
