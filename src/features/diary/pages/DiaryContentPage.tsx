import api from "@/api";
import Button from "@/components/base/Button";
import Image from "@/components/base/Image";
import Modal from "@/components/base/Modal";
import Preview from "@/components/base/Preview";
import { BorderBeam } from "@/components/magicui/border-beam";
import MusicPlayer from "@/components/music/MusicPlayer";
import Page from "@/components/page/Page";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiImageCircleAiFill, RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import BottomBar from "../components/BottomBar";
import CommentDrawer from "../components/comment/CommentDrawer";

const DiaryContentPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryBookId, diaryId } = useParams();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewImageId, setPreviewImageId] = useState<string | undefined>(
    undefined
  );

  /* Server Side */
  const { data: diary, isLoading } = useQuery({
    queryKey: ["fetchDiary", diaryBookId, diaryId],
    queryFn: () => api.diary.fetchDiary(Number(diaryBookId), Number(diaryId)),
  });

  /* Mutations */
  const deleteMutation = useMutation({
    mutationFn: () =>
      api.diary.deleteDiary(Number(diaryBookId), Number(diaryId)),
    onSuccess: () => {
      navigate(`/diary-book/${diaryBookId}`, { replace: true });
    },
    onError: (error) => {
      console.error("일기 삭제 실패", error);
      alert("일기 삭제에 실패했습니다. 다시 시도해주세요.");
    },
  });

  /* UI */
  const menuItems = [
    {
      label: "일기 수정",
      onClick: () =>
        navigate(`/diary-book/${diaryBookId}/diary/${diaryId}/edit`),
    },
    {
      label: "일기 삭제",
      onClick: () => {
        setIsDeleteModalOpen(true);
        setIsMenuOpen(false);
      },
    },
  ];

  /* Effects */
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrentImageIndex(carouselApi.selectedScrollSnap());

    const handleSelect = () => {
      setCurrentImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  /* 이미지 경로 생성 함수 */
  const getEmotionImagePath = (emotionName: string) => {
    return new URL(
      `../../../assets/images/emotions/${emotionName}.png`,
      import.meta.url
    ).href;
  };

  return (
    <Page.Container className={"h-full flex flex-col overflow-x-hidden"}>
      <Page.Header className={"flex justify-between"}>
        <div className={"text-2xl pr-4"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"flex items-center"}>
          <div>
            {isLoading ? (
              <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
            ) : (
              <div>{diary?.createdBy?.nickName}님의 일기</div>
            )}
          </div>
        </div>
        <div>
          <div className={"py-2 pl-2"}>
            <RiMore2Fill
              className={"text-xl"}
              onClick={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      </Page.Header>
      <Page.Content className={"flex-1"}>
        {isLoading ? (
          // 로딩 상태 UI
          <div className={""}>
            {/* 이미지 스켈레톤 */}
            <div
              className={
                "h-48 w-full bg-gray-200 rounded-md animate-pulse mt-4"
              }
            />
            {/* 이미지 인디케이터 스켈레톤 */}
            <div className={"flex justify-center items-center gap-2 mt-2"}>
              <div
                className={"size-2 rounded-full bg-gray-300 animate-pulse"}
              />
              <div
                className={"size-2 rounded-full bg-gray-300 animate-pulse"}
              />
              <div
                className={"size-2 rounded-full bg-gray-300 animate-pulse"}
              />
            </div>
            <div className={"space-y-2 mt-4"}>
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-5/6"} />
            </div>
            {/* 요약 스켈레톤 */}
            <div
              className={"mt-6 p-4 bg-gray-200 rounded-md animate-pulse h-20"}
            />
          </div>
        ) : (
          diary && (
            <div className={"space-y-2 pb-14"}>
              {/* 사진 넣기 */}
              {diary.images && diary.images.length > 0 && (
                <Carousel className={"w-full"} setApi={setCarouselApi}>
                  <CarouselContent>
                    {diary.images.map((image: { id: string }) => (
                      <CarouselItem key={image.id}>
                        <div
                          className={
                            "w-full flex items-center justify-center relative h-48"
                          }
                          onClick={() => {
                            setPreviewImageId(image.id);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Image
                            imageClassName={
                              "object-fill blur-3xl transform-gpu"
                            }
                            imageId={image.id}
                            className={
                              "size-full absolute rounded-md overflow-hidden top-0 left-0"
                            }
                          />

                          <Image
                            imageClassName={"object-contain"}
                            imageId={image.id}
                            className={
                              "h-full w-full bg-transparent overflow-hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
                            }
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
              {/* 이미지 인디케이터 */}
              {diary?.images && diary.images.length > 1 && (
                <div className={"flex justify-center items-center gap-2 mt-2"}>
                  {diary.images.map((_: unknown, index: number) => (
                    <div
                      key={index}
                      className={`size-2 rounded-full ${index === currentImageIndex ? "bg-gray-800" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              )}
              {/* AI 이미지 생성 중 표시 */}
              {!diary.images ||
                (diary.images.length === 0 && (
                  <div
                    className={
                      "h-48 w-full gap-4 flex flex-col justify-center items-center bg-white shadow-lg border rounded-md overflow-hidden relative"
                    }
                  >
                    <BorderBeam
                      duration={6}
                      size={80}
                      className={"from-transparent via-red-500 to-transparent"}
                    />
                    <BorderBeam
                      duration={6}
                      delay={3}
                      size={80}
                      className={"from-transparent via-blue-500 to-transparent"}
                    />

                    <RiImageCircleAiFill
                      className={"text-5xl text-gray-400 animate-pulse"}
                    />
                    <div
                      className={
                        "text-sm text-gray-500 text-center animate-pulse"
                      }
                    >
                      AI가 어울리는 사진을 그리고 있어요
                      <br />
                      조금만 기다려주세요
                    </div>
                  </div>
                ))}

              {/* 일기 제목 */}
              <h1 className={"text-xl mt-6 text-center font-medium"}>
                {diary.title}
              </h1>

              {/* 감정 표시 */}
              {diary.emotion && (
                <div className={"flex justify-center items-center mt-2"}>
                  <div
                    className={
                      "flex items-center justify-center py-1 px-2 rounded-full bg-gray-50"
                    }
                  >
                    <img
                      src={getEmotionImagePath(diary.emotion.toLowerCase())}
                      alt={diary.emotion}
                      className={"size-10 object-contain"}
                    />
                  </div>
                </div>
              )}

              {/* 작성 정보 */}
              <div
                className={
                  "flex justify-center items-center text-xs text-gray-600"
                }
              >
                <span>{diary.createdBy?.nickName}</span>
                <Dot className={"size-4"} />
                <span>{diary.createdAt?.toRelative()}</span>
              </div>

              <LayoutGroup>
                {diary.aiMusicEnabled && (
                  <MusicPlayer musicFileId={diary.musicFile?.id} />
                )}

                {/* 일기 내용 */}
                <motion.div
                  layout
                  className={"mt-6 px-5 font-light diary-content"}
                  dangerouslySetInnerHTML={{ __html: diary.content }}
                />
              </LayoutGroup>

              {/* 요약 내용이 있는 경우 */}
              {diary.summary && (
                <div className={"mt-6 p-4 bg-gray-50 rounded-md"}>
                  <h3 className={"text-sm font-medium mb-2"}>일기 요약</h3>
                  <p className={"text-sm text-gray-600"}>{diary.summary}</p>
                </div>
              )}
            </div>
          )
        )}

        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          description={`일기를 삭제하시겠어요?\n삭제한 일기는 복구할 수 없습니다.`}
        >
          <div className={"mt-8 flex justify-between font-medium"}>
            <Button
              variant={"text"}
              size={"md"}
              className={"p-0 text-red-500"}
              onClick={async () => {
                deleteMutation.mutate();
                setIsDeleteModalOpen(false);
              }}
            >
              일기 삭제
            </Button>
            <Button
              variant={"text"}
              className={"p-0"}
              size={"md"}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
          </div>
        </Modal>
      </Page.Content>
      <BottomBar
        onCommentClick={() => setIsCommentDrawerOpen(true)}
        diaryBookId={Number(diaryBookId)}
        diaryId={Number(diaryId)}
      />
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent className={"pb-8"}>
          <div className={"flex flex-col gap-2 p-4"}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className={
                  "text-center text-base font-normal hover:bg-gray-100 w-full px-4 pt-4 pb-5 first:border-b border-gray-300 last:text-red-500"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      <CommentDrawer
        open={isCommentDrawerOpen}
        onClose={() => setIsCommentDrawerOpen(false)}
        diaryBookId={Number(diaryBookId)}
        diaryId={Number(diaryId)}
      />

      <Preview
        imageId={previewImageId}
        open={isPreviewOpen}
        setIsOpen={setIsPreviewOpen}
      />
    </Page.Container>
  );
};

export default DiaryContentPage;
