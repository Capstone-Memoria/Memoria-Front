import api from "@/api";
import Banner from "@/components/base/Banner";
import Input from "@/components/base/Input";
import DiaryListItem from "@/components/diary/DiaryListItem";
import Page from "@/components/page/Page";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useState } from "react";
import { IoCalendarOutline, IoSearch } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

// dummy diaryList data
const diaryList = [
  {
    title: "느좋카페에서 카공",
    coverImage: {
      id: "1",
      fileName: "image.jpg",
      size: 10,
    },
    summary:
      "오늘은 날씨가 좋아서 가고 싶었던 동네 카페에 나와서 카공을 좀 해봤다. 커피도 맛있고 날씨도 좋아서 콧노래가 절로 나오는 날이었다.",
    createAt: DateTime.fromISO("2025-04-16"),
    createdBy: {
      email: "pkhjack@naver.com",
      nickName: "기현",
      createdAt: DateTime.fromISO("2023-01-01"),
    },
    likeCount: 2,
    commentCount: 10,
  },
  {
    title: "할리스에서 카공",
    coverImage: {
      id: "2",
      fileName: "image.jpg",
      size: 10,
    },
    summary:
      "오늘은 날씨가 좋아서 가고 싶었던 동네 카페에 나와서 카공을 좀 해봤다. 커피도 맛있고 날씨도 좋아서 콧노래가 절로 나오는 날이었다.",
    createAt: DateTime.fromISO("2025-04-16"),
    createdBy: {
      email: "pkhjack@naver.com",
      nickName: "용석",
      createdAt: DateTime.fromISO("2023-01-01"),
    },
    likeCount: 20,
    commentCount: 2,
  },
  {
    title: "느좋카페에서 카공",
    coverImage: {
      id: "1",
      fileName: "image.jpg",
      size: 10,
    },
    summary:
      "오늘은 날씨가 좋아서 가고 싶었던 동네 카페에 나와서 카공을 좀 해봤다. 커피도 맛있고 날씨도 좋아서 콧노래가 절로 나오는 날이었다.",
    createAt: DateTime.fromISO("2025-01-01"),
    createdBy: {
      email: "pkhjack@naver.com",
      nickName: "진욱",
      createdAt: DateTime.fromISO("2023-01-01"),
    },
    likeCount: 2,
    commentCount: 10,
  },
  {
    title: "느좋카페에서 카공",
    coverImage: {
      id: "1",
      fileName: "image.jpg",
      size: 10,
    },
    summary:
      "오늘은 날씨가 좋아서 가고 싶었던 동네 카페에 나와서 카공을 좀 해봤다. 커피도 맛있고 날씨도 좋아서 콧노래가 절로 나오는 날이었다.",
    createAt: DateTime.fromISO("2023-01-01"),
    createdBy: {
      email: "pkhjack@naver.com",
      nickName: "명현",
      createdAt: DateTime.fromISO("2023-01-01"),
    },
    likeCount: 2,
    commentCount: 10,
  },
];

const ViewDiaryPage = () => {
  /* Properties */
  const navigate = useNavigate();
  const { diaryId } = useParams();

  /* States */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // diary의 즐겨찾기 상태

  /* Server Side */
  const { data, isLoading } = useQuery({
    queryKey: ["fetchDiaryBookById", diaryId],
    queryFn: () => api.diary.fetchDiaryBookById(Number(diaryId)),
  });

  /* UI */
  const menuItems = [
    {
      label: "일기장 관리",
      onClick: () => navigate(`/diary/${diaryId}/manage`),
    },
    {
      label: "일기장 멤버 관리",
      onClick: () => navigate(`/diary/${diaryId}/members`),
    },
    {
      label: isPinned ? "즐겨찾기 해제" : "즐겨찾기 추가",
      onClick: () => setIsPinned(!isPinned),
    },
  ];

  // 날짜 적용
  const today = DateTime.now().startOf("day");

  const todayDiaries = diaryList.filter((diary) =>
    diary.createAt.startOf("day").equals(today)
  );

  const previousDiaries = diaryList.filter(
    (diary) => diary.createAt.startOf("day") < today
  );

  return (
    <Page.Container>
      <Page.Header>
        <div className={"text-2xl pr-8"}>
          <MdOutlineKeyboardBackspace onClick={() => navigate(-1)} />
        </div>
        <div>
          {isLoading ? (
            <div className={"h-5 w-16 bg-gray-200 animate-pulse"} />
          ) : (
            <>{data?.title}</>
          )}
        </div>
        <div className={"flex"}>
          <div className={"p-2 flex items-center justify-center"}>
            <IoCalendarOutline className={"text-xl"} />
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
                <div
                  className={
                    "text-sm text-gray-500 px-4 py-2 text-center underline"
                  }
                >
                  다이어리 탈퇴하기
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </Page.Header>
      <Page.Content>
        <Banner
          variant={"green"}
          title={"우리 일기장은 어떤 일기장일까?"}
          className={"mt-2"}
        >
          메모리아에게 일기장 분석받기
        </Banner>
        <Input
          icon={<IoSearch className={"text-base"} />}
          placeholder={"작성자, 제목, 내용 검색"}
          className={"text-[13px] w-full mt-5"}
        />

        <div className={"flex flex-col gap-4 mt-5"}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={"animate-pulse bg-gray-200 h-32 rounded-sm"}
              />
            ))
          ) : (
            <>
              {todayDiaries.length > 0 && (
                <>
                  <div className={"flex justify-between items-center"}>
                    <div className={"text-sm font-medium"}>오늘</div>
                    <div className={"text-[11px] text-neutral-800"}>
                      {today.toFormat("yyyy년 M월 d일")}
                    </div>
                  </div>
                  {todayDiaries.map((diary, index) => (
                    <DiaryListItem key={`today-${index}`} item={diary} />
                  ))}
                </>
              )}

              {previousDiaries.length > 0 && (
                <>
                  <div className={"text-sm font-medium"}>이전 글</div>
                  {previousDiaries.map((diary, index) => (
                    <DiaryListItem key={`prev-${index}`} item={diary} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default ViewDiaryPage;
