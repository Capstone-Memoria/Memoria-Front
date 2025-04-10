import Input from "@/components/base/Input";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Page from "@/components/page/Page";

export default function CreateDiaryPage() {
  return (
    <Page.Container>
      <DefaultHeader />
      <Page.Content>
        <div className={"mt-8"}>
          <p className={"text-sm font-medium"}>
            새 일기장의 제목을 입력해주세요.
          </p>
          <Input
            className={"w-full placeholder:text-gray-400"}
            placeholder={"ex) 메모리아 일기장"}
          />
        </div>
      </Page.Content>
    </Page.Container>
  );
}
