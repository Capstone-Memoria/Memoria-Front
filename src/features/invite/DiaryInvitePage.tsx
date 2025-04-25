import Button from "@/components/base/Button";
import Card from "@/components/base/Card";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InviteInfo {
  diaryId: string; // 일기장 ID
  diaryName: string; // 일기장 이름 (A, B 등)
  // 필요한 다른 정보들...
}

const DiaryInvitePage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState("");

  // ─────────────────────────────────────────────────────────────────────────────
  // 페이지 첫 로딩 시, (주석처리된) API 호출을 통해 초대 정보를 가져와 화면을 구성합니다.
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchInviteInfo = async () => {
      try {
        // 실제로는 아래와 같이 inviteCode를 사용해 백엔드에 초대 정보를 요청할 수 있습니다.
        // ----------------------------------------------------------------------
        //   if (!inviteCode) {
        //     throw new Error("유효하지 않은 초대 링크입니다.");
        //   }
        //   const response = await fetch(`/api/invites/${inviteCode}`);
        //   if (!response.ok) {
        //     throw new Error("초대 정보를 가져오는 데 실패했습니다.");
        //   }
        //   const data = await response.json();
        //   setInviteInfo(data);
        // ----------------------------------------------------------------------

        // (아직 API 구현이 안 되어 있으므로) 더미 데이터로 처리
        if (!inviteCode) {
          throw new Error("유효하지 않은 초대 링크입니다.");
        }
        // 예시로 일기장 이름을 inviteCode에 따라 달리하도록 처리 (더미)
        const dummyInviteInfo: InviteInfo = {
          diaryId: "123",
          diaryName: inviteCode.startsWith("abc")
            ? "A"
            : inviteCode.startsWith("xyz")
              ? "B"
              : "C",
        };
        setInviteInfo(dummyInviteInfo);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("초대 정보를 가져오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInviteInfo();
  }, [inviteCode]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 초대 수락 버튼 클릭 시 동작 (API 연결은 주석)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!inviteInfo) return;

    try {
      // 실제 구현 시:
      // -------------------------------------------------------
      // await fetch(`/api/invites/${inviteCode}/accept`, {
      //   method: "POST",
      //   // 필요하다면 body에 userId, diaryId 등 넣기
      // });
      // -------------------------------------------------------
      // 요청이 성공하면 해당 일기장 페이지로 이동
      navigate(`/diary/${inviteInfo.diaryId}`);
    } catch (err) {
      alert("초대 수락 중 오류가 발생했습니다.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 초대 거절 버튼 클릭 시 동작 (API 연결은 주석)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleReject = () => {
    // 실제 구현 시:
    // -------------------------------------------------------
    // await fetch(`/api/invites/${inviteCode}/reject`, {
    //   method: "POST",
    //   // 필요 시 body에 정보 추가
    // });
    // -------------------------------------------------------
    // 거절 후 메인 화면 등으로 이동
    navigate("/");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 화면 렌더링
  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"px-6 py-4"}>
          <p>로딩 중...</p>
        </Page.Content>
      </Page.Container>
    );
  }

  if (error) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"px-6 py-4"}>
          <p className={"text-red-500"}>{error}</p>
        </Page.Content>
      </Page.Container>
    );
  }

  if (!inviteInfo) {
    return (
      <Page.Container>
        <DefaultHeader logoType={"back"} />
        <Page.Content className={"px-6 py-4"}>
          <p className={"text-red-500"}>초대 정보를 찾을 수 없습니다.</p>
        </Page.Content>
      </Page.Container>
    );
  }

  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content className={"px-6 py-4"}>
        <Card className={"p-4"}>
          <h2 className={"text-xl font-semibold mb-4"}>
            {inviteInfo.diaryName} 일기장에서 초대를 받았습니다.
          </h2>
          <p className={"mb-6"}>
            {inviteInfo.diaryName} 일기장의 멤버로 참여하시겠습니까?
          </p>
          <div className={"flex gap-3"}>
            <Button variant={"secondary"} onClick={handleReject}>
              거절
            </Button>
            <Button onClick={handleAccept}>수락</Button>
          </div>
        </Card>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryInvitePage;
