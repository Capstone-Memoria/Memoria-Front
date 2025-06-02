import api from "@/api";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import Spinner from "@/components/base/Spinner";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IoCalendarOutline, IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import DiaryCalendarPanel from "../components/DiaryCalendarPanel";
import DiaryListPanel from "../components/DiaryListPanel";

const ViewDiaryListPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryBookId } = useParams();
  const queryClient = useQueryClient();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 입력 필드 표시 상태 추가
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list"); // 뷰 모드 상태 추가
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* Refs */
  const headerContentRef = useRef<HTMLDivElement>(null); // Ref for header content

  /* Server Side */
  const { data, isLoading } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryBookId],
    queryFn: () => api.diaryBook.fetchDiaryBookById(Number(diaryBookId)),
  });

  const handleDiaryDelete = async () => {
    if (!diaryBookId) return;

    setIsDeleting(true);
    try {
      await api.diaryBook.deleteDiaryBook(Number(diaryBookId));
      queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
      setIsDeleteModalOpen(false);
      navigate("/main", { replace: true });
    } catch (e) {
      console.error("일기장 삭제 실패", e);
      alert("일기장 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  /* UI */
  const menuItems = [
    {
      label: "일기장 관리",
      onClick: () => navigate(`/diary-book/${diaryBookId}/manage`),
    },
    {
      label: "일기장 멤버 관리",
      onClick: () => navigate(`/diary-book/${diaryBookId}/members`),
    },
    {
      label: isPinned ? "즐겨찾기 해제" : "즐겨찾기 추가",

      onClick: async () => {
        if (!diaryBookId) {
          console.error("Diary book ID is missing!");
          setIsMenuOpen(false);
          return;
        }

        try {
          await api.diaryBook.togglePinDiaryBook(Number(diaryBookId));
          setIsPinned(!isPinned);
          queryClient.invalidateQueries({ queryKey: ["fetchMyDiaryBook"] });
        } catch (e) {
          console.error("즐겨찾기 업데이트 실패", e);
        } finally {
          setIsMenuOpen(false);
        }
      },
    },
    {
      label: "일기장 삭제",
      onClick: () => {
        setIsDeleteModalOpen(true);
        setIsMenuOpen(false);
      },
    },
  ];

  useEffect(() => {
    if (data) {
      setIsPinned(data.isPinned ?? false);
    }
  }, [data]);

  const openWritePage = () => {
    navigate(`/diary/write/?diaryBookId=${diaryBookId}`);
  };

  const handleSearchToggle = (searching: boolean) => {
    setIsSearching(searching);
    if (searching) {
      setViewMode("list"); // 검색할 때는 리스트 모드로 전환
    } else {
      setSearchQuery(""); // 검색 비활성화 시 검색어 초기화
    }
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl pr-4"}>
          {isSearching ? (
            <MdOutlineKeyboardBackspace
              onClick={() => {
                handleSearchToggle(false);
              }}
            />
          ) : (
            <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
          )}
        </div>
        <AnimatePresence mode={"wait"}>
          {isSearching ? (
            <motion.div
              key={"search-input"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
              className={"flex-grow"}
            >
              <Input
                icon={<IoSearch className={"text-base"} />}
                placeholder={"작성자, 제목, 내용 검색"}
                className={"text-sm w-full"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </motion.div>
          ) : (
            <motion.div
              key={"view"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
              className={"flex flex-grow items-center justify-between "}
              ref={headerContentRef}
            >
              <div>
                {isLoading ? (
                  <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
                ) : (
                  <>{data?.title}</>
                )}
              </div>
              <div className={"flex gap-1"}>
                <div className={"p-2 flex items-center justify-center"}>
                  <IoSearch
                    className={"text-xl"}
                    onClick={() => handleSearchToggle(true)}
                  />
                </div>
                <div
                  className={`p-2 flex items-center justify-center ${viewMode === "calendar" ? "text-primary bg-gray-200 rounded-md" : ""}`}
                  onClick={() =>
                    setViewMode(viewMode === "list" ? "calendar" : "list")
                  }
                >
                  <IoCalendarOutline className={"text-xl"} />
                </div>
                <div className={"py-2 pl-2"}>
                  <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DrawerTrigger asChild>
                      <RiMore2Fill className={"text-xl"} />
                    </DrawerTrigger>
                    <DrawerContent className={""}>
                      <div className={"flex flex-col gap-2 p-4"}>
                        {menuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              item.onClick();
                              setIsMenuOpen(false);
                            }}
                            className={
                              "text-center text-base font-normal w-full px-4 pt-4 pb-5 border-b border-gray-400 last:border-b-0 last:text-red-500"
                            }
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Page.Header>
      <Page.Content>
        <AnimatePresence mode={"wait"}>
          {viewMode === "list" ? (
            <motion.div
              key={"list"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
            >
              <DiaryListPanel
                diaryBookId={Number(diaryBookId)}
                onNavigateBack={handleNavigateBack}
                onOpenWritePage={openWritePage}
                onSearchToggle={handleSearchToggle}
                isSearching={isSearching}
                searchQuery={searchQuery}
              />
            </motion.div>
          ) : (
            <motion.div
              key={"calendar"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.225, ease: [0.16, 1, 0.3, 1] }}
            >
              <DiaryCalendarPanel
                diaryBookId={Number(diaryBookId)}
                searchQuery={searchQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Page.Content>

      {/* 일기장 삭제 확인 드로어 */}
      <Drawer open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DrawerContent className={""}>
          <div className={"flex flex-col items-center px-4 py-6"}>
            <div className={"text-center mb-4"}>
              <p className={"text-lg font-medium mb-3"}>
                일기장을 삭제하시겠습니까?
              </p>
              <p className={"text-xs text-gray-500 text-center mb-6"}>
                삭제한 일기장은 복구할 수 없으며, 모든 일기도 함께 삭제됩니다.
              </p>
            </div>
            <div className={"flex gap-3 w-full"}>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant={"text"}
                className={
                  "flex-1 rounded-lg border-gray-200 bg-gray-200 border"
                }
              >
                취소
              </Button>
              <Button
                onClick={handleDiaryDelete}
                variant={"danger"}
                className={"flex-1"}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className={"flex justify-center items-center w-full"}>
                    <Spinner className={"text-white"} />
                  </div>
                ) : (
                  "삭제"
                )}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Page.Container>
  );
};

export default ViewDiaryListPage;
