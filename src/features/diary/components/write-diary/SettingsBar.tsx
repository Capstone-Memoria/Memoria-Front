import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AICharacter } from "@/models/AIComment";
import { useMemo, useState } from "react";
import { MdSettings } from "react-icons/md";

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
}

const SettingsBar = ({
  settings,
  onChange,
  aiCharacters,
  isLoadingCharacters = false,
}: SettingsProps) => {
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

  return (
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
        <div className={"text-lg font-semibold mb-4"}>설정</div>
        <div className={"flex flex-col gap-4"}>
          <div>
            <div className={"font-medium mb-2"}>AI 캐릭터 선택</div>
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
            <div className={"font-medium mb-2"}>음악 생성</div>
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
  );
};

export default SettingsBar;
