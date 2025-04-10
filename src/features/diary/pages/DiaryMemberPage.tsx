import { useState } from "react";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { FaCrown } from "react-icons/fa";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import Card from "@/components/base/Card";
import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import { useNavigate } from "react-router-dom";

// 멤버 더미 데이터
interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  profileImg?: string;
}

const DiaryMemberPage = () => {
  const navigate = useNavigate();
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // 멤버 더미 데이터
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "김메모",
      email: "memo@example.com",
      role: "admin",
      profileImg: "",
    },
    {
      id: "2",
      name: "이리아",
      email: "ria@example.com",
      role: "member",
      profileImg: "",
    },
    {
      id: "3",
      name: "박다이어리",
      email: "diary@example.com",
      role: "member",
      profileImg: "",
    },
  ]);

  // 초대 링크 생성 핸들러
  const handleGenerateInvite = () => {
    // 실제 구현에서는 API 호출을 통해 초대 링크를 생성해야 합니다.
    const dummyLink = `https://memoria.app/invite/${Math.random().toString(36).substring(2, 15)}`;
    setInviteLink(dummyLink);
    setIsGeneratingInvite(true);
  };

  // 초대 링크 복사 핸들러
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // 멤버 삭제 핸들러
  const handleRemoveMember = (memberId: string) => {
    // 실제 구현에서는 API 호출을 통해 멤버를 삭제해야 합니다.
    setMembers(members.filter(member => member.id !== memberId));
  };

  // 관리자 권한 변경 핸들러
  const handleToggleAdmin = (memberId: string) => {
    // 실제 구현에서는 API 호출을 통해 권한을 변경해야 합니다.
    setMembers(members.map(member => 
      member.id === memberId 
        ? { ...member, role: member.role === "admin" ? "member" : "admin" } 
        : member
    ));
  };

  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content className={"px-6 py-4"}>
        <h1 className={"text-xl font-medium mb-6"}>멤버 관리</h1>

        {/* 멤버 목록 카드 */}
        <Card className={"mb-6"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 목록</h2>
          <div className={"flex flex-col gap-3"}>
            {members.map((member) => (
              <div key={member.id} className={"flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"}>
                <div className={"flex items-center gap-3"}>
                  <div className={"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"}>
                    {member.profileImg ? (
                      <img src={member.profileImg} alt={member.name} className={"w-full h-full rounded-full object-cover"} />
                    ) : (
                      <span className={"text-gray-500"}>{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className={"flex items-center gap-2"}>
                      <span className={"font-medium"}>{member.name}</span>
                      {member.role === "admin" && (
                        <FaCrown className={"text-yellow-500 text-xs"} />
                      )}
                    </div>
                    <span className={"text-xs text-gray-500"}>{member.email}</span>
                  </div>
                </div>
                <div className={"flex gap-2"}>
                  <Button 
                    variant={"text"} 
                    size={"sm"} 
                    onClick={() => handleToggleAdmin(member.id)}
                  >
                    {member.role === "admin" ? "관리자 해제" : "관리자 지정"}
                  </Button>
                  <Button 
                    variant={"text"} 
                    size={"sm"} 
                    className={"text-red-500"}
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <IoMdClose />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 멤버 초대 카드 */}
        <Card>
          <h2 className={"text-lg font-medium mb-4"}>멤버 초대</h2>
          {isGeneratingInvite ? (
            <div className={"flex flex-col gap-4"}>
              <div className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}>
                <span className={"text-sm flex-1 break-all"}>{inviteLink}</span>
                <Button 
                  variant={"text"} 
                  size={"sm"} 
                  onClick={handleCopyLink}
                >
                  <IoMdCopy />
                </Button>
              </div>
              {linkCopied && (
                <p className={"text-xs text-green-500"}>링크가 클립보드에 복사되었습니다!</p>
              )}
              <div className={"flex gap-2 justify-end"}>
                <Button 
                  variant={"secondary"} 
                  size={"sm"} 
                  onClick={() => setIsGeneratingInvite(false)}
                >
                  닫기
                </Button>
                <Button 
                  size={"sm"} 
                  onClick={handleGenerateInvite}
                >
                  새 링크 생성
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className={"text-sm text-gray-500 mb-4"}>
                멤버를 초대하려면 초대 링크를 생성하여 공유하세요.
                <br />
                초대 링크는 7일간 유효합니다.
              </p>
              <Button 
                size={"md"} 
                className={"flex items-center gap-2"} 
                onClick={handleGenerateInvite}
              >
                <IoMdAdd />
                초대 링크 생성
              </Button>
            </div>
          )}
        </Card>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryMemberPage;
