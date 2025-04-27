import api from "@/api";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface DiaryBookDrawerProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  selectedDiaryBookId: number | undefined;
}

const DiaryBookDrawer = ({
  isMenuOpen,
  setIsMenuOpen,
  selectedDiaryBookId,
}: DiaryBookDrawerProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["fetchMyDiaryBook"],
    queryFn: () =>
      api.diaryBook.fetchMyDiaryBook({
        size: 10,
        page: 1, // TODO: pagination
      }),
  });

  return (
    <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DrawerContent className={"px-5 pb-12 flex justify-center items-center"}>
        <div className={"text-lg pt-5 pb-8"}>일기장을 선택해주세요.</div>
        <div
          className={
            "flex-1 w-full overflow-y-auto max-h-[30vh] [&::-webkit-scrollbar]:hidden"
          }
        >
          <div className={"flex flex-col items-center gap-2"}>
            {isLoading && (
              <div className={"text-gray-400 text-sm"}>로딩중...</div>
            )}
            {data?.content.map((diary) => (
              <button
                type={"button"}
                key={diary.id}
                className={cn("w-full text-center py-3 rounded-md", {
                  "bg-emerald-100 text-black font-medium":
                    selectedDiaryBookId === diary.id,
                  "text-gray-700": selectedDiaryBookId !== diary.id,
                })}
                onClick={() => {
                  setSearchParams(
                    { diaryBookId: diary.id.toString() },
                    {
                      replace: true,
                    }
                  );
                  setIsMenuOpen(false);
                }}
              >
                {diary.title}
              </button>
            ))}
          </div>
        </div>
        <div
          className={"text-emerald-500 mt-4"}
          onClick={() => navigate("/create-diary")}
        >
          + 새 일기장
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DiaryBookDrawer;
