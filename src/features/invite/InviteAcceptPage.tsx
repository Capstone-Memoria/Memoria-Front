import api from "@/api";
import Button from "@/components/base/Button";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const InviteAcceptPage = () => {
  /* ──────────────────────────────── 라우터 훅 */
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* ──────────────────────────────── 로그인 확인 */
  const { context } = useAuthStore();
  const user = context?.user;

  useEffect(() => {
    /* 로그인 안 돼 있으면 /login 으로 보내고, 로그인 후 다시 돌아오게 함 */
    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname + location.search },
      });
    }
  }, [user, navigate, location]);

  /* ──────────────────────────────── 링크에 실어둔 정보 */
  const diaryName = params.get("diaryName") ?? "다이어리";
  const inviter = params.get("inviter") ?? "누군가";

  /* ──────────────────────────────── 초대 수락 API */
  const acceptMutation = useMutation({
    mutationFn: () => api.diaryBook.acceptInvitationCode(inviteCode!),
    onSuccess: (res) => {
      // DiaryBookMemer 타입에는 diaryBookId 숫자만 있음
      navigate(`/diary/${res.diaryBookId}`);
    },
    onError: (e: Error) => alert(`초대 수락 실패: ${e.message}`),
  });

  /* ──────────────────────────────── 렌더 */
  return (
    <Page.Container>
      <DefaultHeader logoType={"default"} />
      <Page.Content className={"px-6 py-8 flex justify-center items-center"}>
        <div
          className={
            "w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center"
          }
        >
          <h2 className={"text-lg font-medium mb-2"}>다이어리 초대</h2>

          {!user ? (
            <p className={"text-gray-500 py-10"}>로그인 페이지로 이동 중...</p>
          ) : (
            <>
              <p className={"text-gray-600 mb-6"}>
                <span className={"font-semibold"}>{inviter}</span> 님이
                <br />
                <span className={"font-semibold text-blue-600"}>
                  “{diaryName}”
                </span>{" "}
                다이어리에 초대했습니다.
              </p>

              <div className={"flex justify-center gap-3"}>
                <Button
                  onClick={() => acceptMutation.mutate()}
                  disabled={acceptMutation.isPending}
                  className={"w-24"}
                >
                  {acceptMutation.isPending ? "처리중..." : "수락"}
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => navigate("/main")}
                  disabled={acceptMutation.isPending}
                  className={"w-24"}
                >
                  거절
                </Button>
              </div>
            </>
          )}
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default InviteAcceptPage;
