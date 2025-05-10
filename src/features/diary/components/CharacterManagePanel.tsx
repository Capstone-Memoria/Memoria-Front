import api from "@/api";
import Button from "@/components/base/Button";
import Image from "@/components/base/Image";
import { AICharacter } from "@/models/AIComment";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import CharacterCreateDrawer from "./CharacterCreateDrawer";
import CharacterEditDrawer from "./CharacterEditDrawer";

interface CharacterManagePanelProps {
  diaryId: number;
}

const CharacterManagePanel = ({ diaryId }: CharacterManagePanelProps) => {
  const [isCharacterEditDrawerOpen, setIsCharacterEditDrawerOpen] =
    useState(false);
  const [selectedCharacter, setSelectedCharacter] =
    useState<AICharacter | null>(null);
  const [isCharacterCreateDrawerOpen, setIsCharacterCreateDrawerOpen] =
    useState(false);

  const { data } = useQuery({
    queryKey: ["fetchAiCharactersByDiaryBookId", diaryId],
    queryFn: () => api.aiCharacter.fethAiCharactersByDiaryBookId(diaryId),
  });

  return (
    <div className={"flex flex-wrap gap-4"}>
      {data?.map((it) => (
        <div
          key={it.id}
          className={
            "w-full h-16 rounded-md border overflow-hidden flex items-center px-2 bg-white"
          }
          onClick={() => {
            if (it.type === "DEFAULT") {
              return;
            }

            setSelectedCharacter(it);
            setIsCharacterEditDrawerOpen(true);
          }}
        >
          <div className={"size-12 rounded-full overflow-hidden border"}>
            <Image
              className={"size-full"}
              imageClassName={"size-full object-cover"}
              imageId={it.profileImage?.id}
            />
          </div>
          <div className={"flex-1"}>
            <div className={"font-semibold ml-4"}>{it.name}</div>
          </div>
          <div>
            {it.type !== "DEFAULT" ? (
              <Button variant={"text"} size={"sm"}>
                <MdOutlineModeEditOutline />
              </Button>
            ) : (
              <div className={"mr-4 text-gray-400"}>기본 캐릭터</div>
            )}
          </div>
        </div>
      ))}
      <div
        className={
          "w-full h-16 rounded-md border overflow-hidden flex items-center px-2 bg-white justify-center gap-2 text-gray-600"
        }
        onClick={() => setIsCharacterCreateDrawerOpen(true)}
      >
        <BiPlusCircle className={"text-lg"} />
        새로 만들기
      </div>
      {selectedCharacter && (
        <CharacterEditDrawer
          open={isCharacterEditDrawerOpen}
          setIsOpen={setIsCharacterEditDrawerOpen}
          character={selectedCharacter}
        />
      )}
      <CharacterCreateDrawer
        open={isCharacterCreateDrawerOpen}
        setIsOpen={setIsCharacterCreateDrawerOpen}
        diaryId={diaryId}
      />
    </div>
  );
};

export default CharacterManagePanel;
