import Header from "@/components/base/Header";
import Diary from "@/components/diary/Diary";
import PageContainer from "@/components/page/PageContainer";
import { useAuthStore } from "@/stores/AuthenticationStore";

const diaryDummyData = [
  {
    id: 1,
    title: "AO JS 스터디",
    memberCount: 8,
    pinned: true,
    diaryCoverImg: "",
    notificationCount: 4,
  },
  {
    id: 2,
    title: "우리 가족",
    memberCount: 4,
    pinned: false,
    diaryCoverImg: "",
    notificationCount: 0,
  },
  {
    id: 3,
    title: "2025 대학팸",
    memberCount: 9,
    pinned: false,
    diaryCoverImg: "",
    notificationCount: 0,
  },
  {
    id: 4,
    title: "2025년 기록",
    memberCount: 0,
    pinned: true,
    diaryCoverImg: "",
    notificationCount: 0,
  },
  {
    id: 5,
    title: "새해 다짐 모임",
    memberCount: 3,
    pinned: false,
    diaryCoverImg: "",
    notificationCount: 10,
  },
  {
    id: 6,
    title: "개발 기록장",
    memberCount: 0,
    pinned: false,
    diaryCoverImg: "",
    notificationCount: 0,
  },
];

const MainPage = () => {
  const authStore = useAuthStore();

  return (
    <PageContainer>
      <Header />
      <div className={"my-6"}>
        <p className={"font-semibold text-lg"}>
          {authStore.context?.user?.nickName} 님의 책장,
        </p>
        <p className={"font-regular text-gray-1 text-xs"}>
          {diaryDummyData.length}권의 일기장
        </p>
      </div>
      <div className={"grid grid-cols-[auto_1fr_auto] gap-y-4"}>
        {diaryDummyData.map((diary) => (
          <Diary
            key={diary.id}
            title={diary.title}
            memberCount={diary.memberCount}
            pinned={diary.pinned}
            notificationCount={diary.notificationCount}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default MainPage;
