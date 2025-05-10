import {
  createAiCharacter,
  CreateAiCharacterRequest,
} from "@/api/ai-character";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

interface CharacterCreateDrawerProps {
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
  diaryBookId: number;
}

interface CreateForm {
  name: string;
  feature: string;
  accent: string;
  profileImage: File | undefined;
}

const CharacterCreateDrawer = ({
  open,
  setIsOpen,
  diaryBookId,
}: CharacterCreateDrawerProps) => {
  const [overwrittenImage, setOverwrittenImage] = useState<File>();
  const [createForm, setCreateForm] = useState<CreateForm>({
    name: "",
    feature: "",
    accent: "",
    profileImage: undefined,
  });

  const queryClient = useQueryClient();

  const handleSave = () => {
    // TODO: Implement character creation API call
    // console.log("Creating character with data:", createForm);
    // setIsOpen(false); // Close drawer for now
    mutate({
      diaryBookId: diaryBookId,
      request: {
        name: createForm.name,
        feature: createForm.feature,
        accent: createForm.accent,
        profileImage: createForm.profileImage as File,
      },
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      diaryBookId,
      request,
    }: {
      diaryBookId: number;
      request: CreateAiCharacterRequest;
    }) => createAiCharacter(diaryBookId, request),
    onSuccess: () => {
      setIsOpen(false); // Close drawer on success
      queryClient.invalidateQueries({
        queryKey: ["fetchAiCharactersByDiaryBookId"],
      });
    },
    onError: (error) => {
      console.error("Failed to create character:", error);
    },
  });

  // const isPending = false; // Mock isPending for now

  const isFormComplete =
    createForm.name &&
    createForm.feature &&
    createForm.accent &&
    createForm.profileImage;

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          // Reset form state when drawer closes
          setCreateForm({
            name: "",
            feature: "",
            accent: "",
            profileImage: undefined,
          });
          setOverwrittenImage(undefined);
        }
      }}
    >
      <DrawerContent className={"h-[80%]"}>
        <div className={"flex flex-col gap-4 p-6 overflow-y-auto"}>
          <div className={"flex flex-col gap-4 flex-1"}>
            <div className={"flex flex-col gap-2"}>
              <Input
                label={"캐릭터 이름"}
                className={"w-full text-lg"}
                defaultValue={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                placeholder={"예: 모험가 잭"}
              />
            </div>

            {/* 캐릭터 설정 입력 (특징 및 말투) */}
            <div className={"flex flex-col gap-2"}>
              <label
                htmlFor={"character-feature"}
                className={"text-lg font-medium"}
              >
                특징
              </label>
              <textarea
                id={"character-feature"}
                className={"border rounded p-2 min-h-[100px] w-full"}
                defaultValue={createForm.feature}
                onChange={(e) =>
                  setCreateForm({ ...createForm, feature: e.target.value })
                }
                placeholder={
                  "예: 용감하고 호기심 많은 성격. 항상 새로운 모험을 찾아 떠나요."
                }
              />
            </div>

            <div className={"flex flex-col gap-2"}>
              <label
                htmlFor={"character-accent"}
                className={"text-lg font-medium"}
              >
                말투
              </label>
              <textarea
                id={"character-accent"}
                className={"border rounded p-2 min-h-[100px] w-full"}
                defaultValue={createForm.accent}
                onChange={(e) =>
                  setCreateForm({ ...createForm, accent: e.target.value })
                }
                placeholder={"예: 친근하고 친절한 말투"}
              />
            </div>

            <div className={"flex flex-col gap-2"}>
              <div className={"text-lg font-medium"}>프로필 사진</div>
              <div className={"flex items-center justify-center"}>
                <ProfileImageUpload
                  currentImageId={undefined} // No current image for creation
                  overwrittenImage={overwrittenImage}
                  onImageSelected={(file) => {
                    setOverwrittenImage(file);
                    setCreateForm({ ...createForm, profileImage: file });
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"flex flex-col justify-end gap-2"}>
            <Button
              variant={"primary"}
              size={"lg"}
              className={"w-full"}
              onClick={handleSave}
              disabled={isPending || !isFormComplete}
            >
              {isPending ? "생성 중..." : "생성하기"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CharacterCreateDrawer;
