import { deleteAiCharacter, updateAiCharacter } from "@/api/ai-character";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Modal from "@/components/base/Modal";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { AICharacter } from "@/models/AIComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

interface CharacterEditDrawerProps {
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
  character: AICharacter;
}

interface ModifiedForm {
  name: string;
  feature: string;
  accent: string;
  profileImage: File | undefined;
}

const CharacterEditDrawer = ({
  open,
  setIsOpen,
  character,
}: CharacterEditDrawerProps) => {
  const [overwrittenImage, setOverwrittenImage] = useState<File>();
  const [modifiedForm, setModifiedForm] = useState<ModifiedForm>({
    name: character.name,
    feature: character.feature,
    accent: character.accent,
    profileImage: undefined,
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const handleSave = () => {
    mutate({
      characterId: character.id,
      request: {
        name: modifiedForm.name,
        feature: modifiedForm.feature,
        accent: modifiedForm.accent,
        profileImage: modifiedForm.profileImage,
      },
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      characterId,
      request,
    }: {
      characterId: number;
      request: ModifiedForm;
    }) => updateAiCharacter(characterId, request),
    onSuccess: () => {
      setIsOpen(false); // Close drawer on success
      queryClient.invalidateQueries({
        queryKey: ["fetchAiCharactersByDiaryBookId"],
      });
    },
    onError: (error) => {
      console.error("Failed to update character:", error);
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (characterId: number) => deleteAiCharacter(characterId),
    onSuccess: () => {
      setIsOpen(false); // Close drawer on success
      queryClient.invalidateQueries({
        queryKey: ["fetchAiCharactersByDiaryBookId"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete character:", error);
      setErrorMessage("캐릭터 삭제에 실패했습니다."); // 오류 메시지 설정
      setShowErrorModal(true); // 오류 모달 열기
    },
  });

  const handleDelete = () => {
    setShowDeleteConfirmModal(true); // 삭제 확인 모달 열기
    setIsOpen(false);
  };

  const confirmDelete = () => {
    deleteMutate(character.id);
    setShowDeleteConfirmModal(false); // 모달 닫기
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          // Reset form state when drawer closes
          setModifiedForm({
            name: character.name,
            feature: character.feature,
            accent: character.accent,
            profileImage: undefined,
          });
          setOverwrittenImage(undefined);
        }
      }}
    >
      <DrawerContent className={"min-h-[90vh]"}>
        <div className={"flex flex-col gap-4 p-6 h-[90vh]"}>
          <div className={"flex flex-col gap-4 overflow-y-auto flex-1"}>
            <div className={"flex flex-col gap-2"}>
              <Input
                label={"캐릭터 이름"}
                className={"w-full text-lg"}
                defaultValue={character.name}
                onChange={(e) =>
                  setModifiedForm({ ...modifiedForm, name: e.target.value })
                }
              />
            </div>

            {/* 캐릭터 설정 수정 (특징 및 말투) */}
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
                defaultValue={character.feature}
                onChange={(e) =>
                  setModifiedForm({ ...modifiedForm, feature: e.target.value })
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
                defaultValue={character.accent}
                onChange={(e) =>
                  setModifiedForm({ ...modifiedForm, accent: e.target.value })
                }
              />
            </div>

            <div className={"flex flex-col gap-2"}>
              <div className={"text-lg font-medium"}>프로필 사진</div>
              <div className={"flex items-center justify-center"}>
                <ProfileImageUpload
                  currentImageId={character.profileImage?.id}
                  overwrittenImage={overwrittenImage}
                  onImageSelected={(file) => {
                    setOverwrittenImage(file);
                    setModifiedForm({ ...modifiedForm, profileImage: file });
                  }}
                />
              </div>
            </div>
            <div className={"flex flex-col justify-end gap-2"}>
              <div className={"text-lg font-medium"}>캐릭터 삭제</div>
              <div className={"text-sm text-gray-500"}>
                캐릭터를 삭제하면 복구할 수 없습니다.
              </div>
              <Button
                variant={"danger"}
                size={"lg"}
                className={"w-full"}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
            </div>
          </div>

          <div className={"flex flex-col justify-end gap-2"}>
            <Button
              variant={"primary"}
              size={"lg"}
              className={"w-full"}
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </DrawerContent>

      <Modal
        open={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title={"캐릭터 삭제"}
        description={
          "정말로 이 캐릭터를 삭제하시겠습니까?\n삭제된 캐릭터는 복구할 수 없습니다."
        }
      >
        <div className={"flex justify-center gap-4 mt-4"}>
          <Button
            variant={"secondary"}
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            취소
          </Button>
          <Button
            variant={"danger"}
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </div>
      </Modal>

      <Modal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={"오류"}
        description={errorMessage}
      >
        <div className={"flex justify-center mt-4"}>
          <Button onClick={() => setShowErrorModal(false)}>확인</Button>
        </div>
      </Modal>
    </Drawer>
  );
};

export default CharacterEditDrawer;
