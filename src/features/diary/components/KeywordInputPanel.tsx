import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  usePresence,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImFileEmpty } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

// 색상 조합 배열 - 배경색과 텍스트색 쌍으로 구성
const colorPairs = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-yellow-100", text: "text-yellow-700" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-lime-100", text: "text-lime-600" },
];

interface KeywordInputPanelProps {
  onNext: () => void;
}

const KeywordProgressBar = ({ count }: { count: number }) => {
  const maxKeywords = 3;

  const statusText = () => {
    if (count === 0) return "키워드를 추가해주세요";
    if (count < maxKeywords) return `${maxKeywords - count}개 더 추가해주세요`;
    return "이제 커버 이미지를 만들 수 있어요";
  };

  const statusColor = () => {
    if (count >= maxKeywords) return "text-blue-500";
    return "text-gray-600";
  };

  const progressColor = () => {
    if (count >= maxKeywords) return "bg-blue-500";
    return "bg-gray-600";
  };

  return (
    <div className={"w-full mt-4 mb-4"}>
      <div className={"flex justify-center mb-3"}>
        <span className={`font-medium ${statusColor()}`}>{statusText()}</span>
      </div>
      <div className={"flex justify-center gap-3"}>
        {[0, 1, 2].map((index) => (
          <div key={index} className={"flex-1 max-w-24 relative"}>
            <div
              className={"h-3 bg-gray-200 rounded-lg overflow-hidden relative"}
            >
              {count > index && (
                <motion.div
                  className={`h-full absolute top-0 left-0 right-0 ${progressColor()}`}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.1,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                />
              )}
            </div>
            <div
              className={
                "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
              }
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const KeywordItem = ({
  keyword,
  onRemove,
}: {
  keyword: string;
  onRemove: () => void;
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const itemRef = useRef<HTMLDivElement>(null);

  const colorPair = useMemo(() => {
    const index = Math.abs(
      keyword.split("").reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0) % colorPairs.length
    );
    return colorPairs[index];
  }, [keyword]);

  useEffect(() => {
    if (!isPresent && safeToRemove) {
      setTimeout(safeToRemove, 300);
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      ref={itemRef}
      layout
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      className={`${colorPair.bg} ${colorPair.text} px-3 py-1.5 rounded-full flex items-center gap-1.5`}
    >
      <span>{keyword}</span>
      <motion.button
        onClick={onRemove}
        className={`hover:${colorPair.text} opacity-70 hover:opacity-100`}
        whileHover={{ scale: 1.2, rotate: 15 }}
        whileTap={{ scale: 0.8 }}
      >
        <IoMdClose size={16} />
      </motion.button>
    </motion.div>
  );
};

export const KeywordInputPanel = ({ onNext }: KeywordInputPanelProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isCreateButtonVisible, setIsCreateButtonVisible] = useState(false);

  const handleAddKeyword = () => {
    if (inputValue.trim() !== "" && !keywords.includes(inputValue.trim())) {
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      setInputValue("");

      if (newKeywords.length >= 3 && !isCreateButtonVisible) {
        setIsCreateButtonVisible(true);
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(newKeywords);

    if (newKeywords.length < 3 && isCreateButtonVisible) {
      setIsCreateButtonVisible(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <AnimatePresence mode={"wait"}>
      <div className={"flex flex-col flex-1"}>
        <div className={"text-xl text-center mt-4"}>AI 배경화면 생성</div>
        <div className={"mt-3 text-gray-500 bg-gray-100 px-4 py-2 rounded-md"}>
          새 일기장의 키워드를 3개 이상 입력해주세요. <br />
          메모리아가 적합한 표지를 만들어드릴게요.
        </div>

        <KeywordProgressBar count={keywords.length} />

        <LayoutGroup>
          <motion.div
            className={
              "mt-2 flex-1 flex items-center justify-center overflow-hidden"
            }
            layout
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {keywords.length > 0 ? (
              <motion.div
                className={"flex flex-wrap gap-2 justify-center"}
                layout
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence mode={"popLayout"}>
                  {keywords.map((keyword) => (
                    <KeywordItem
                      key={keyword}
                      keyword={keyword}
                      onRemove={() => handleRemoveKeyword(keyword)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  "text-gray-400 text-center flex flex-col gap-4 items-center justify-center"
                }
                layout
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ImFileEmpty className={"text-4xl"} />
                <div>입력된 키워드가 없어요</div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className={"mb-6 flex flex-col gap-6"}
            layout
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Input
              variant={"gray"}
              className={"w-full"}
              placeholder={"ex) 메모리아, 카페, 카공"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={"flex flex-col gap-3"}>
              <Button
                className={"w-full"}
                size={"xl"}
                onClick={handleAddKeyword}
                disabled={
                  inputValue.trim() === "" ||
                  keywords.some((k) => k === inputValue.trim())
                }
              >
                키워드 추가
              </Button>
              {isCreateButtonVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  layout
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Button
                    className={"w-full"}
                    size={"xl"}
                    variant={"blue"}
                    onClick={onNext}
                  >
                    커버 이미지 생성하기
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </AnimatePresence>
  );
};
