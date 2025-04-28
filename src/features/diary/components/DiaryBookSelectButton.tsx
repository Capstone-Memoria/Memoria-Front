import { IoIosArrowDown } from "react-icons/io";

interface DiaryBookSelectButtonProps {
  isLoading: boolean;
  selectedDiaryBookTitle: string | undefined;
  onClick: () => void;
}

const DiaryBookSelectButton = ({
  isLoading,
  selectedDiaryBookTitle,
  onClick,
}: DiaryBookSelectButtonProps) => {
  return (
    <div
      className={
        "w-full flex justify-between items-center mt-2 bg-gray-100 rounded-3xl px-4 py-2"
      }
      onClick={onClick}
    >
      {isLoading ? (
        <span className={"text-gray-400"}>로딩중...</span>
      ) : (
        selectedDiaryBookTitle || "일기장 선택하기"
      )}
      <IoIosArrowDown />
    </div>
  );
};

export default DiaryBookSelectButton;
