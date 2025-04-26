import api from "@/api";
import CommentIcon from "@/assets/svgs/Comment";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { useState } from "react";
import { IoMdHeart } from "react-icons/io";
import {
  MdImageNotSupported,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const DiaryContentPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryBookId, diaryId } = useParams();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      navigate(`/diary/${diaryBookId}`);
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
      onClick: () => navigate(`/diary/${diaryBookId}/diary/${diaryId}/edit`),
    },
    {
      label: "일기 삭제",
      onClick: async () => {
        if (window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
          deleteMutation.mutate();
        }
        setIsMenuOpen(false);
      },
    },
  ];

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl pr-4"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div className={"flex flex-grow items-center justify-between"}>
          <div>
            {isLoading ? (
              <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
            ) : (
              <>일기 상세보기</>
            )}
          </div>
          <div className={"py-2 pl-2"}>
            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DrawerTrigger asChild>
                <RiMore2Fill className={"text-xl"} />
              </DrawerTrigger>
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
                        "text-center text-base font-normal hover:bg-gray-100 w-full px-4 pt-4 pb-5 border-b border-gray-400"
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
      </Page.Header>
      <Page.Content>
        {isLoading ? (
          // 로딩 상태 UI
          <div className={"space-y-4"}>
            <div className={"h-7 bg-gray-200 animate-pulse rounded w-3/4"} />
            <div className={"flex items-center gap-2"}>
              <div
                className={"h-4 w-4 bg-gray-200 animate-pulse rounded-full"}
              />
              <div className={"h-4 w-20 bg-gray-200 animate-pulse rounded"} />
              <div
                className={"h-4 w-4 bg-gray-200 animate-pulse rounded-full"}
              />
              <div className={"h-4 w-20 bg-gray-200 animate-pulse rounded"} />
            </div>
            <div className={"space-y-2 mt-4"}>
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-full"} />
              <div className={"h-4 bg-gray-200 animate-pulse rounded w-5/6"} />
            </div>
          </div>
        ) : (
          diary && (
            <div className={"space-y-4"}>
              {/* 일기 제목 */}
              <h1 className={"text-xl font-medium"}>{diary.title}</h1>

              {/* 작성 정보 */}
              <div className={"flex items-center text-xs text-gray-600"}>
                <span>{diary.createdBy?.nickName}</span>
                <Dot className={"size-4"} />
                <span>{diary.createdAt?.toRelative()}</span>

                <div className={"flex-1"} />

                {/* 좋아요 및 댓글 카운트 */}
                <div className={"flex gap-2"}>
                  <div className={"flex items-center gap-1"}>
                    <IoMdHeart className={"text-xs"} />
                    <span>{diary.likeCount ?? 0}</span>
                  </div>
                  <div className={"flex items-center gap-1"}>
                    <CommentIcon className={"size-xs"} />
                    <span>{diary.commentCount ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <div className={"h-px bg-gray-200 my-4"} />

              {/* 일기 내용 */}
              <div className={"mt-4"}>
                <div dangerouslySetInnerHTML={{ __html: diary.content }} />
              </div>

              {/* 이미지가 있는 경우 이미지 표시 */}
              {diary.images && diary.images.length > 0 && (
                <div className={"mt-4 grid grid-cols-2 gap-2"}>
                  {diary.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={
                        "aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
                      }
                    >
                      {/* 이미지 정보만 표시하고 실제 이미지는 아직 표시하지 않음 */}
                      {/* 백엔드 API로부터 이미지 URL을 받아올 경우 이 부분 업데이트 필요 */}
                      <MdImageNotSupported
                        className={"text-gray-400 text-4xl"}
                      />
                      <div
                        className={
                          "absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate"
                        }
                      >
                        {image.fileName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

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
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryContentPage;
