import api from "@/api"; // Corrected import path
import { InviteDetails } from "@/api/diary-book"; // Import InviteDetails type
import Button from "@/components/base/Button"; // Corrected import path
import DefaultHeader from "@/components/layout/DefaultHeader"; // Corrected import path
import Page from "@/components/page/Page"; // Corrected import path
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const InviteAcceptPage = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams<{ inviteCode: string }>();

  // Fetch invite details query
  const {
    data: inviteInfo,
    isLoading: isLoadingInvite,
    error: inviteError,
  } = useQuery<InviteDetails, Error>({
    queryKey: ["fetchInviteDetails", inviteCode],
    queryFn: () => {
      if (!inviteCode) {
        // Throw an error or return a rejected promise if inviteCode is missing
        return Promise.reject(new Error("초대 코드가 없습니다."));
      }
      return api.diaryBook.fetchInviteDetailsByCode(inviteCode);
    },
    enabled: !!inviteCode, // Only run query if inviteCode exists
    retry: false, // Do not retry on error (e.g., invalid code)
  });

  // Accept invitation mutation
  const acceptMutation = useMutation({
    mutationFn: (code: string) => api.diaryBook.acceptInvitationCode(code),
    onSuccess: (data) => {
      // data likely contains DiaryBookMemer info
      alert("초대를 수락했습니다!");
      // Navigate to the diary page using the diaryId from inviteInfo
      // Ensure inviteInfo is available before navigating
      if (inviteInfo?.diaryId) {
        navigate(`/diary/${inviteInfo.diaryId}`);
      } else {
        // Fallback navigation if diaryId is somehow missing
        navigate("/main");
      }
    },
    onError: (error) => {
      console.error("초대 수락 실패:", error);
      alert(`초대 수락 중 오류가 발생했습니다: ${error.message}`);
    },
  });

  // --- Event Handlers ---

  const handleAccept = () => {
    if (!inviteCode || acceptMutation.isPending) return;
    acceptMutation.mutate(inviteCode);
  };

  // Decline simply navigates away
  const handleDecline = () => {
    if (acceptMutation.isPending) return; // Prevent navigation during accept processing
    alert("초대를 거절했습니다.");
    navigate("/main"); // Navigate to the main page
  };

  // --- Render Logic ---

  const renderContent = () => {
    if (isLoadingInvite) {
      return (
        <div className={"flex flex-col items-center justify-center py-10"}>
          <p className={"mt-2 text-gray-500"}>초대 정보를 확인하는 중...</p>
        </div>
      );
    }

    // Handle specific error for missing code (though enabled should prevent this)
    if (!inviteCode) {
      return (
        <div className={"text-center py-6"}>
          <p className={"text-red-500 font-medium mb-4"}>오류 발생</p>
          <p className={"text-gray-600 mb-6"}>
            유효하지 않은 접근입니다. 초대 코드가 없습니다.
          </p>
          <Button onClick={() => navigate("/main")} variant={"secondary"}>
            메인으로 돌아가기
          </Button>
        </div>
      );
    }

    // Handle API errors (invalid code, network issues, etc.)
    if (inviteError) {
      return (
        <div className={"text-center py-6"}>
          <p className={"text-red-500 font-medium mb-4"}>오류 발생</p>
          <p className={"text-gray-600 mb-6"}>
            {inviteError.message ||
              "초대 정보를 불러오는데 실패했습니다. 코드가 만료되었거나 유효하지 않을 수 있습니다."}
          </p>
          <Button onClick={() => navigate("/main")} variant={"secondary"}>
            메인으로 돌아가기
          </Button>
        </div>
      );
    }

    // Display invite details and action buttons
    if (inviteInfo) {
      return (
        <div className={"text-center"}>
          <h2 className={"text-lg font-medium mb-2"}>다이어리 초대</h2>
          <p className={"text-gray-600 mb-4"}>
            <span className={"font-semibold"}>{inviteInfo.inviterName}</span>
            님이
            <br />
            <span className={"font-semibold text-blue-600"}>
              "{inviteInfo.diaryName}"
            </span>{" "}
            다이어리에 초대했습니다.
          </p>
          <p className={"text-sm text-gray-500 mb-6"}>
            초대를 수락하면 해당 다이어리의 멤버가 되어 함께 기록하고 열람할 수
            있습니다.
          </p>
          <div className={"flex justify-center gap-3"}>
            <Button
              onClick={handleAccept}
              disabled={acceptMutation.isPending} // Disable while processing
              className={"w-24"}
            >
              {acceptMutation.isPending ? "처리중..." : "수락"}
            </Button>
            <Button
              variant={"secondary"}
              onClick={handleDecline}
              disabled={acceptMutation.isPending} // Disable while processing accept
              className={"w-24"}
            >
              거절
            </Button>
          </div>
        </div>
      );
    }

    // Fallback if no data, no error, no loading (should not happen ideally)
    return (
      <p className={"text-center text-gray-500 py-10"}>
        초대 정보를 표시할 수 없습니다.
      </p>
    );
  };

  return (
    <Page.Container>
      <DefaultHeader logoType={"default"} />
      <Page.Content className={"px-6 py-8 flex justify-center items-center"}>
        <div className={"w-full max-w-md p-6 bg-white rounded-lg shadow-md"}>
          {" "}
          {/* Added card styling */}
          {renderContent()}
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default InviteAcceptPage;
