import Button from "@/components/base/Button";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InviteInfo {
  diaryId: string;
  diaryName: string;
  inviterName: string;
}

const InviteAcceptPage = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams<{ inviteCode: string }>();

  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null); // 초대 정보 저장 (API 응답)
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 여부 (true면 로딩 중)
  const [error, setError] = useState<string | null>(null); // 오류 메시지 저장
  const [isProcessing, setIsProcessing] = useState(false); // 수락/거절 처리 중 버튼 비활성화를 위한 상태

  useEffect(() => {
    if (!inviteCode) {
      setError("유효하지 않은 접근입니다. 초대 코드가 없습니다.");
      setIsLoading(false);
      return;
    }

    // 비동기 함수로 초대 데이터 가져오기
    const fetchInviteData = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`초대 코드 상세 정보 요청: ${inviteCode}`);

      try {
        // --- !!! API 호출 시뮬레이션 !!! ---
        // 이 부분을 실제 API 호출로 교체하여 초대 코드를 검증하세요
        // 예시: const response = await yourApi.get(`/invites/validate/${inviteCode}`);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // 네트워크 지연 시뮬레이션

        // 임시 데이터
        const dummyData: InviteInfo = {
          diaryId: "diary-123", // 예시 다이어리 ID
          diaryName: "예시 메모장 이름",
          inviterName: "김메모",
        };
        setInviteInfo(dummyData); // 상태 업데이트

        // --- 예시: API로부터 오류 처리 ---
        // if (!response.ok) {
        //   const errorData = await response.json();
        //   throw new Error(errorData.message || "초대 정보를 불러올 수 없습니다.");
        // }
      } catch (err) {
        // 오류 발생 시 처리
        console.error("초대 상세 정보 가져오기 실패:", err);
        // 오류 메시지 설정 (Error 객체이거나 일반 문자열일 수 있음)
        setError(
          err instanceof Error
            ? err.message
            : "초대 정보를 불러오는데 실패했습니다. 코드가 만료되었거나 유효하지 않을 수 있습니다."
        );
        setInviteInfo(null); // 오류 발생 시 정보 초기화
      } finally {
        // 성공/실패 여부와 관계없이 항상 실행
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchInviteData();
  }, [inviteCode]); // inviteCode 값이 변경될 때마다 이 effect를 다시 실행

  // 수락 처리 함수
  const handleAccept = async () => {
    // 초대 정보가 없거나 이미 처리 중이면 중단
    if (!inviteInfo || isProcessing) return;

    setIsProcessing(true); // 처리 시작 (버튼 비활성화 목적)
    setError(null); // 이전 오류 초기화
    console.log(`초대 수락 처리 시작: 다이어리 ID ${inviteInfo.diaryId}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 네트워크 지연 시뮬레이션

      // --- 성공 시 ---
      alert("초대를 수락했습니다!"); // 나중에 더 나은 알림 시스템으로 교체하세요
      // 다이어리 페이지 또는 메인 페이지로 이동
      navigate(`/diary/${inviteInfo.diaryId}`); // 특정 다이어리 페이지로 리디렉션
      // 또는 navigate('/main'); // 메인 페이지로 리디렉션
    } catch (err) {
      // 오류 발생 시 처리
      console.error("초대 수락 실패:", err);
      setError(
        err instanceof Error ? err.message : "초대 수락 중 오류가 발생했습니다."
      );
      setIsProcessing(false); // 오류 발생 시 버튼 다시 활성화
    }
    // 성공 시 페이지 이동하므로 isProcessing을 false로 설정할 필요 없음
  };

  // 거절 처리 함수
  const handleDecline = async () => {
    // 이미 처리 중이면 중단
    if (isProcessing) return;

    setIsProcessing(true); // 처리 시작
    setError(null); // 이전 오류 초기화
    console.log(`초대 거절 처리 시작: 코드 ${inviteCode}`);

    try {
      // --- !!! API 호출 시뮬레이션 !!! ---
      // 이 부분을 실제 API 호출로 교체하여 초대를 거절 처리하세요 (선택적)
      // 예시: await yourApi.post(`/invites/${inviteCode}/decline`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션

      // --- 성공 시 ---
      alert("초대를 거절했습니다."); // 나중에 더 나은 알림 시스템으로 교체하세요
      navigate("/main"); // 메인 페이지로 이동
    } catch (err) {
      // 오류 발생 시 처리
      console.error("초대 거절 실패:", err);
      setError(
        err instanceof Error ? err.message : "초대 거절 중 오류가 발생했습니다."
      );
      setIsProcessing(false); // 오류 발생 시 버튼 다시 활성화
    }
    // 성공 시 페이지 이동하므로 isProcessing을 false로 설정할 필요 없음
  };

  // --- 렌더링 로직 ---

  // 상태에 따라 다른 UI를 렌더링하는 함수
  const renderContent = () => {
    // 로딩 중일 때
    if (isLoading) {
      return (
        <div className={"flex flex-col items-center justify-center py-10"}>
          {/* 전용 로딩 스피너 컴포넌트가 있다면 사용하는 것이 좋습니다 */}
          {/* <LoadingSpinner /> */}
          <p className={"mt-2 text-gray-500"}>초대 정보를 확인하는 중...</p>
        </div>
      );
    }

    // 오류가 발생했을 때
    if (error) {
      return (
        <div className={"text-center py-6"}>
          <p className={"text-red-500 font-medium mb-4"}>오류 발생</p>
          <p className={"text-gray-600 mb-6"}>{error}</p>{" "}
          {/* 오류 메시지 표시 */}
          {/* 메인 페이지로 돌아가는 버튼 */}
          <Button onClick={() => navigate("/main")} variant={"secondary"}>
            메인으로 돌아가기
          </Button>
        </div>
      );
    }

    // 초대 정보가 성공적으로 로드되었을 때
    if (inviteInfo) {
      return (
        <div className={"text-center"}>
          <h2 className={"text-lg font-medium mb-2"}>다이어리 초대</h2>
          <p className={"text-gray-600 mb-4"}>
            {/* 초대한 사람 이름 */}
            <span className={"font-semibold"}>{inviteInfo.inviterName}</span>
            님이
            <br />
            {/* 다이어리 이름 */}
            <span className={"font-semibold text-blue-600"}>
              "{inviteInfo.diaryName}"
            </span>{" "}
            다이어리에 초대했습니다.
          </p>
          <p className={"text-sm text-gray-500 mb-6"}>
            초대를 수락하면 해당 다이어리의 멤버가 되어 함께 기록하고 열람할 수
            있습니다.
          </p>
          {/* 버튼 그룹 */}
          <div className={"flex justify-center gap-3"}>
            {/* 수락 버튼 */}
            <Button
              onClick={handleAccept}
              disabled={isProcessing} // 처리 중일 때 비활성화
              className={"w-24"} // 일관된 너비를 위한 고정 너비
            >
              {isProcessing ? "처리중..." : "수락"}
            </Button>
            {/* 거절 버튼 */}
            <Button
              variant={"secondary"} // 또는 "danger", "text" 등 원하는 스타일로
              onClick={handleDecline}
              disabled={isProcessing} // 처리 중일 때 비활성화
              className={"w-24"} // 일관된 너비를 위한 고정 너비
            >
              {isProcessing ? "처리중..." : "거절"}
            </Button>
          </div>
        </div>
      );
    }

    // 위 조건들에 아무것도 해당하지 않는 경우 (일반적으로 발생하지 않음)
    return (
      <p className={"text-center text-gray-500 py-10"}>
        초대 정보를 표시할 수 없습니다.
      </p>
    );
  };

  // --- 최종 컴포넌트 렌더링 ---
  return (
    <Page.Container>
      {/* 로고 타입은 'logo'가 더 적합할 수 있습니다 (로그인 전 명확한 '뒤로가기' 대상이 없을 수 있으므로) */}
      <DefaultHeader logoType={"default"} />
      <Page.Content className={"px-6 py-8 flex justify-center items-center"}>
        {/* 카드 컴포넌트를 사용하여 내용 표시 */}
        <div className={"w-full max-w-md p-6"}>
          {/* 상태에 따라 내용 렌더링 */}
          {renderContent()}
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default InviteAcceptPage;
