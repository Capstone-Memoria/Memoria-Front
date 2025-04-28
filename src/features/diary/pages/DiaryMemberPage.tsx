import Button from "@/components/base/Button";
import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";
import { useEffect, useMemo, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdCopy } from "react-icons/io";
import { useNavigate } from "react-router-dom";

// 멤버 더미 데이터
interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  profileImg?: string;
}

const profileBgColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-teal-200",
  "bg-orange-200",
  "bg-cyan-200",
  "bg-lime-200",
  "bg-emerald-200",
  "bg-sky-200",
  "bg-violet-200",
  "bg-fuchsia-200",
  "bg-rose-200",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const DiaryMemberPage = () => {
  const navigate = useNavigate();
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const [directInviteEmail, setDirectInviteEmail] = useState("");
  const [directInviteSent, setDirectInviteSent] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("");
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

  const [memberBgColors, setMemberBgColors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    // 사용 가능한 색상 목록을 랜덤하게 섞음
    const shuffledColors = shuffleArray(profileBgColors);
    // 새로운 색상 할당 객체 생성
    const initialColors: Record<string, string> = {};
    // 현재 members 배열을 순회하며 색상 할당
    members.forEach((member, index) => {
      // 프로필 이미지가 없는 멤버에게만 색상 할당
      if (!member.profileImg) {
        // 섞인 색상 배열에서 순서대로 할당 (멤버 수 > 색상 수 이면 반복됨)
        initialColors[member.id] =
          shuffledColors[index % shuffledColors.length];
      }
    });
    // 계산된 초기 색상들을 상태에 저장
    setMemberBgColors(initialColors);
  }, []);

  // 초대 링크 생성 핸들러
  const handleGenerateInvite = () => {
    // 실제 구현에서는 API 호출을 통해 초대 링크를 생성해야 합니다.
    const dummyLink = `https://memoria.app/invite/${Math.random().toString(36).substring(2, 15)}`;
    setInviteLink(dummyLink);
    setIsGeneratingInvite(true);
  };

  const memberColors = useMemo(() => {
    const shuffled = shuffleArray(profileBgColors);
    // 각 멤버에게 순서대로 색상 할당 (멤버 수가 색상 수보다 많으면 반복됨)
    return members.map((_, index) => shuffled[index % shuffled.length]);
  }, [members]);

  // 초대 링크 복사 핸들러
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // 멤버 삭제 핸들러
  const handleRemoveMember = (memberId: string) => {
    // 실제 구현에서는 API 호출을 통해 멤버를 삭제해야 합니다.
    setMembers(members.filter((member) => member.id !== memberId));
  };

  // 관리자 권한 변경 핸들러
  const handleToggleAdmin = (memberId: string) => {
    // 실제 구현에서는 API 호출을 통해 권한을 변경해야 합니다.
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, role: member.role === "admin" ? "member" : "admin" }
          : member
      )
    );
  };

  const handleDirectInvite = () => {
    if (!directInviteEmail.trim()) return; // Basic validation

    // 알림 api 대기
    console.log(`Sending direct invite to: ${directInviteEmail}`);

    setInvitedEmail(directInviteEmail);
    setDirectInviteEmail("");
    setDirectInviteSent(true);

    setTimeout(() => {
      setDirectInviteSent(false);
      setInvitedEmail("");
    }, 3000);
  };

  return (
    <Page.Container>
      <DefaultHeader logoType={"back"} />
      <Page.Content className={"px-6 py-4"}>
        <h1 className={"text-xl font-medium mb-6"}>멤버 관리</h1>
        {/* 멤버 목록 카드 */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 목록</h2>
          <div className={"flex flex-col gap-3"}>
            {members.map((member) => (
              <div
                key={member.id}
                className={
                  "flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                }
              >
                <div className={"flex items-center gap-3"}>
                  <div
                    className={
                      "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                    }
                  >
                    {member.profileImg ? (
                      <img
                        src={member.profileImg}
                        alt={member.name}
                        className={"w-full h-full rounded-full object-cover"}
                      />
                    ) : (
                      <span className={"text-gray-500"}>
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={"flex items-center gap-2"}>
                      <span className={"font-medium"}>{member.name}</span>
                      {member.role === "admin" && (
                        <FaCrown className={"text-yellow-500 text-xs"} />
                      )}
                    </div>
                    <span className={"text-xs text-gray-500"}>
                      {member.email}
                    </span>
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
        </div>

        {/* 멤버 초대 카드 */}
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 초대</h2>
          {isGeneratingInvite ? (
            <div className={"flex flex-col gap-4"}>
              <div
                className={"flex items-center gap-2 bg-gray-100 p-3 rounded-md"}
              >
                <span className={"text-sm flex-1 break-all"}>{inviteLink}</span>
                <Button variant={"text"} size={"sm"} onClick={handleCopyLink}>
                  <IoMdCopy />
                </Button>
              </div>
              {linkCopied && (
                <p className={"text-xs text-green-500"}>
                  링크가 클립보드에 복사되었습니다!
                </p>
              )}
              <div className={"flex gap-2 justify-end"}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => setIsGeneratingInvite(false)}
                >
                  닫기
                </Button>
                <Button size={"sm"} onClick={handleGenerateInvite}>
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
        </div>
        <div className={"mb-6 rounded-md bg-white shadow-sm p-4"}>
          <h2 className={"text-lg font-medium mb-4"}>멤버 직접 초대</h2>
          <p className={"text-sm text-gray-500 mb-4"}>
            이메일 주소를 입력하여 멤버를 직접 초대하세요.
            <br />
            상대방에게 초대 알림이 전송됩니다.
          </p>
          <div className={"flex flex-col gap-3"}>
            <div className={"flex items-center gap-2"}>
              <Input
                type={"email"}
                placeholder={"초대할 멤버의 이메일 주소"}
                value={directInviteEmail}
                onChange={(e) => setDirectInviteEmail(e.target.value)}
                className={"flex-1"}
                aria-label={"초대할 멤버 이메일"}
              />
              <Button
                size={"md"}
                onClick={handleDirectInvite}
                disabled={!directInviteEmail.trim()} // 이메일 입력이 없으면 버튼 비활성화
              >
                초대 보내기
              </Button>
            </div>
            {directInviteSent && (
              <p className={"text-xs text-green-600 mt-1"}>
                '{invitedEmail}' 주소로 초대 요청을 보냈습니다. (실제 전송은
                구현 예정)
              </p>
            )}
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  );
};

export default DiaryMemberPage;
