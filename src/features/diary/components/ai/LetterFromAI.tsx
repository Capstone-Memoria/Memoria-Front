import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { GiEnvelope } from "react-icons/gi";
const LetterFromAI = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn("border rounded-lg  min-h-12 relative")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          layout
          key={"closed"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={"flex items-center px-4 h-16 gap-4"}
        >
          <motion.div layout className={"size-9 rounded-full bg-gray-200"} />
          <AnimatePresence mode={"popLayout"}>
            {!isOpen ? (
              <motion.div
                key={"closed"}
                layout
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className={"flex-1 flex items-center justify-between"}
              >
                <div>
                  <motion.div className={"text-sm font-medium text-gray-900"}>
                    농담곰으로부터 편지가 왔어요!
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
                className={"flex-1 flex items-center justify-between"}
              >
                <motion.div className={"text-lg font-medium text-gray-900"}>
                  농담곰의 편지
                </motion.div>
                <motion.div className={"text-xs text-gray-500"}>
                  농담곰
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn("flex-1 p-4 pt-0 h-32")}
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
            >
              <div className={"text-sm font-medium text-gray-900"}>
                네 일기 잘 읽어봤어! 일기를 통해 네 마음이 어떤지 조금이나마
                느낄 수 있었어. 혼자 힘들어하지 않았으면 좋겠어. 언제든 네
                옆에는 내가 있다는 것을 잊지마! 농담곰이 너에게.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};

export default LetterFromAI;
