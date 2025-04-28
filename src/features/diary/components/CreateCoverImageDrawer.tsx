import api from "@/api";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMutation } from "@tanstack/react-query";
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
  const [currentImageBase64, setCurrentImageBase64] = useState<string>();
  const [isError, setIsError] = useState(false);

  const handleClickGenerate = (keywords: string[]) => {
    generateCoverImageMutation.mutate(
      `일기장 커버 이미지 키워드: ${keywords.join(", ")}`
    );
    setCurrentImageBase64(undefined);
    setIsError(false);
    setCurrentPanel("preview");
  };

  const generateCoverImageMutation = useMutation({
    mutationFn: (description: string) => api.ai.generateCoverImage(description),
    onSuccess: (data) => {
      setCurrentImageBase64(data);
    },
    onError: () => {
      setIsError(true);
    },
  });

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
            <KeywordInputPanel onNext={handleClickGenerate} />
          </div>
          <div className={"w-screen px-4 flex flex-col flex-shrink-0"}>
            <PreviewCoverPanel
              onBack={() => setCurrentPanel("keyword")}
              imageBase64={currentImageBase64}
              isError={isError}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
