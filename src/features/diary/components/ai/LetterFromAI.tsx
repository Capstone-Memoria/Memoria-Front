import Image from "@/components/base/Image";
import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";
import { AIComment } from "@/models/AIComment";
import { useResizeObserver, useScroll } from "@reactuses/core";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useRef, useState } from "react";
import { GiEnvelope } from "react-icons/gi";
import { MdArrowDownward } from "react-icons/md";
import Markdown from "react-markdown";
interface LetterFromAIProps {
  aiComment?: AIComment;
}

const LetterFromAI: React.FC<LetterFromAIProps> = ({ aiComment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isScrolledOnTop, setIsScrolledOnTop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useResizeObserver(containerRef, (entries) => {
    const { height } = entries[0].contentRect;
    const scrollHeight = containerRef.current?.scrollHeight;
    if (!scrollHeight) {
      setIsOverflowing(false);
      return;
    }

    setIsOverflowing(scrollHeight > height);
  });

  const [_, y] = useScroll(containerRef);
  return (
    <LayoutGroup>
      <motion.div layout className={"relative"}>
        <motion.div
          layout
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "border rounded-lg  min-h-12 relative max-h-60 overflow-y-scroll"
          )}
          ref={containerRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isOpen && <ShineBorder shineColor={["#fb2c36", "#2b7fff"]} />}

          <motion.div
            layout
            key={"closed"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={"flex items-center px-4 h-16 gap-4"}
            transition={{
              duration: 0.2,
            }}
          >
            <motion.div
              layout
              className={
                "size-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
              }
            >
              <Image
                className={"size-full"}
                imageId={aiComment?.createdBy.profileImage?.id}
              />
            </motion.div>
            <AnimatePresence mode={"popLayout"}>
              {!isOpen ? (
                <motion.div
                  key={"closed"}
                  layout
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className={"flex-1 flex items-center justify-between"}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <div>
                    <motion.div className={"text-sm font-medium text-gray-900"}>
                      {aiComment?.createdBy.name}으로부터 편지가 왔어요!
                    </motion.div>
                    <motion.div className={"text-xs text-gray-500"}>
                      펼쳐서 확인하기
                    </motion.div>
                  </div>
                  <div className={"text-blue-500 text-xl"}>
                    <GiEnvelope />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={"opened"}
                  layout={"position"}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className={"flex-1 flex flex-col justify-between"}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <motion.div className={"text-sm font-medium text-gray-900"}>
                    {aiComment?.title}
                  </motion.div>
                  <motion.div className={"text-xs text-gray-500"}>
                    {aiComment?.createdBy.name}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={cn("flex-1 p-4 pt-0 min-h-32")}
                initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                transition={{
                  duration: 0.2,
                }}
              >
                <div
                  className={
                    "text-sm font-medium text-gray-900 whitespace-pre-wrap"
                  }
                >
                  <Markdown>{aiComment?.content}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isOverflowing && y === 0 && isOpen && (
            <motion.div
              className={
                "absolute bottom-1 left-1/2 -translate-x-1/2 animate-bounce p-1 bg-white rounded-full border"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
              }}
              layout
            >
              <MdArrowDownward className={"text-green-500"} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};

export default LetterFromAI;
