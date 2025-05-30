import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AICharacter } from "@/models/AIComment";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdSettings } from "react-icons/md";
import CharacterCreateDrawer from "../CharacterCreateDrawer";

export interface Settings {
  aiCharacter: AICharacter | null;
  useRandomAICharacter: boolean;
  musicCreationEnabled: boolean;
}

interface SettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
  aiCharacters: AICharacter[];
  isLoadingCharacters?: boolean;
  diaryBookId?: number;
}

const SettingsBar = ({
  settings,
  onChange,
  aiCharacters,
  isLoadingCharacters = false,
  diaryBookId,
}: SettingsProps) => {
  const queryClient = useQueryClient();
  const aiCharacterLabel = useMemo(() => {
    if (settings.useRandomAICharacter) {
      return "아무나";
    }
    if (settings.aiCharacter === null) {
      return "답장 받지 않기";
    }
    return settings.aiCharacter?.name;
  }, [settings.aiCharacter, settings.useRandomAICharacter]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCharacterCreateDrawerOpen, setIsCharacterCreateDrawerOpen] =
    useState(false);

  const handleCreateCharacter = () => {
    setIsCharacterCreateDrawerOpen(true);
    setIsDrawerOpen(false);
  };

  // 캐릭터 생성 후 캐릭터 목록을 새로고침하기 위한 콜백
  const handleCharacterDrawerClose = (isOpen: boolean) => {
    setIsCharacterCreateDrawerOpen(isOpen);
    if (!isOpen) {
      // 드로어가 닫힐 때 캐릭터 목록 새로고침
      if (diaryBookId) {
        queryClient.invalidateQueries({
          queryKey: ["fetchAiCharactersByDiaryBookId", diaryBookId],
        });
      }
    }
  };

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <div
            className={
              "py-2 px-3 text-sm border flex rounded-lg gap-4 bg-white shadow-sm items-center cursor-pointer"
            }
          >
            <div className={"flex items-center gap-2 text-gray-500"}>
              <MdSettings />
            </div>
            <div className={"flex gap-2 justify-around flex-1"}>
              <div className={"flex items-center gap-2"}>
                <div>AI 편지</div>
                <div
                  className={cn({
                    "text-blue-500":
                      !settings.useRandomAICharacter &&
                      settings.aiCharacter !== null,
                    "text-green-500": settings.useRandomAICharacter,
                    "text-gray-500":
                      settings.aiCharacter === null &&
                      !settings.useRandomAICharacter,
                  })}
                >
                  {aiCharacterLabel}
                </div>
              </div>
              <div className={"flex items-center gap-2"}>
                <div>음악 생성</div>
                <div
                  className={cn({
                    "text-green-500": settings.musicCreationEnabled,
                    "text-gray-500": !settings.musicCreationEnabled,
                  })}
                >
                  {settings.musicCreationEnabled ? "활성화" : "비활성화"}
                </div>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className={"h-1/2 flex flex-col p-4"}>
          <div className={"text-lg font-medium py-4"}>설정</div>
          <div className={"flex flex-col gap-5"}>
            <div>
              <div className={"mb-3 flex items-center justify-between"}>
                <span>AI 캐릭터 선택</span>
                <button
                  onClick={handleCreateCharacter}
                  className={
                    "flex items-center gap-1 text-sm text-emerald-500 rounded-full px-3 py-1"
                  }
                >
                  <FiPlus />
                  <span>생성</span>
                </button>
              </div>
              <div className={"flex flex-wrap gap-2"}>
                <button
                  className={cn(
                    "px-3 py-1 border rounded-full text-sm transition-colors duration-200",
                    settings.useRandomAICharacter
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                  onClick={() =>
                    onChange({
                      ...settings,
                      useRandomAICharacter: true,
                      aiCharacter: null,
                    })
                  }
                >
                  아무나
                </button>
                <button
                  className={cn(
                    "px-3 py-1 border rounded-full text-sm transition-colors duration-200",
                    settings.aiCharacter === null &&
                      !settings.useRandomAICharacter
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                  onClick={() =>
                    onChange({
                      ...settings,
                      useRandomAICharacter: false,
                      aiCharacter: null,
                    })
                  }
                >
                  답장 받지 않기
                </button>
                {isLoadingCharacters ? (
                  <div className={"text-sm text-gray-500"}>
                    캐릭터 목록을 불러오는 중...
                  </div>
                ) : (
                  aiCharacters.map((character) => (
                    <button
                      key={character.id}
                      className={cn(
                        "px-3 py-1 border rounded-full text-sm transition-colors duration-200",
                        !settings.useRandomAICharacter &&
                          settings.aiCharacter !== null &&
                          settings.aiCharacter.id === character.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      )}
                      onClick={() =>
                        onChange({
                          ...settings,
                          aiCharacter: character,
                          useRandomAICharacter: false,
                        })
                      }
                    >
                      {character.name}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div>
              <div className={"mb-3"}>음악 생성</div>
              <div className={"flex flex-wrap gap-2"}>
                <button
                  className={cn(
                    "px-3 py-1 border rounded-full text-sm transition-colors duration-200",
                    settings.musicCreationEnabled
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                  onClick={() =>
                    onChange({
                      ...settings,
                      musicCreationEnabled: true,
                    })
                  }
                >
                  음악 생성
                </button>
                <button
                  className={cn(
                    "px-3 py-1 border rounded-full text-sm transition-colors duration-200",
                    !settings.musicCreationEnabled
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                  onClick={() =>
                    onChange({
                      ...settings,
                      musicCreationEnabled: false,
                    })
                  }
                >
                  음악생성 안함
                </button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* 캐릭터 생성 드로어 - diaryBookId가 없어도 기본값으로 드로어는 표시 */}
      <CharacterCreateDrawer
        open={isCharacterCreateDrawerOpen}
        setIsOpen={handleCharacterDrawerClose}
        diaryBookId={diaryBookId || 0} // diaryBookId가 없으면 0을 기본값으로 설정
      />
    </>
  );
};

export default SettingsBar;
