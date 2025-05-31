import { Diary } from "@/models/Diary";
import { DiaryBook, DiaryBookMemer } from "@/models/DiaryBook";
import { Page, PageParam } from "@/models/Pagination";
import {
  ImageToRequestSticker,
  ImageToUploadSticker,
  ModifyingSticker,
  RequestSticker,
  Sticker,
} from "@/models/Sticker";
import server from "./axios";

export const fetchMyDiaryBook = async (PageParam: PageParam) => {
  const response = await server.get<Page<DiaryBook>>("/api/diary-book", {
    params: {
      ...PageParam,
    },
  });

  return response.data;
};

interface DiaryBookCreateRequest {
  title: string;
  coverImage: File;
  spineColor: string;
}

export const createDiaryBook = async (request: DiaryBookCreateRequest) => {
  const formData = new FormData();
  formData.append("title", request.title);
  formData.append("coverImage", request.coverImage);
  formData.append("spineColor", request.spineColor);

  const response = await server.post<DiaryBook>("api/diary-book", formData);

  return response.data;
};

interface DiaryBookCreateWithStickersRequest extends DiaryBookCreateRequest {
  stickers: ModifyingSticker[];
}

export const createDiaryBookWithStickers = async (
  request: DiaryBookCreateWithStickersRequest
) => {
  const response = await createDiaryBook(request);
  const diaryBookId = response.id;

  await updateStickers(diaryBookId, request.stickers);

  return response;
};
export const fetchDiaryBookById = async (diaryBookId: number) => {
  const response = await server.get<DiaryBook>(
    `/api/diary-book/${diaryBookId}`
  );

  return response.data;
};

interface DiaryBookUpdateRequest {
  title?: string;
  coverImage?: File;
  spineColor?: string;
}

export const updateDiaryBook = async (
  diaryBookId: number,
  request: DiaryBookUpdateRequest
) => {
  const formData = new FormData();
  if (request.title !== undefined) formData.append("title", request.title);
  if (request.coverImage !== undefined)
    formData.append("coverImage", request.coverImage);
  if (request.spineColor !== undefined)
    formData.append("spineColor", request.spineColor);

  const response = await server.patch<DiaryBook>(
    `/api/diary-book/${diaryBookId}`,
    formData
  );
  return response.data;
};

export const deleteDiaryBook = async (diaryBookId: number) => {
  await server.delete(`/api/diary-book/${diaryBookId}`);
};

export const fetchMyDiaries = async (
  diaryBookId: number,
  PageParam: PageParam
) => {
  const response = await server.get<Page<Diary>>(
    `/api/diary-book/${diaryBookId}/diary`,
    {
      params: {
        ...PageParam,
      },
    }
  );
  return response.data;
};

export const diaryMemberDelete = async (
  diaryBookId: number,
  memberId: number
) => {
  await server.delete(`/api/diary-book/${diaryBookId}/members/${memberId}`);
};

export const updateDiaryMemberPermission = async ({
  diaryBookId,
  memberId,
  permission,
}: {
  diaryBookId: number;
  memberId: number;
  permission: "ADMIN" | "MEMBER";
}) => {
  const response = await server.patch<DiaryBookMemer>(
    `/api/diary-book/${diaryBookId}/members/${memberId}`,
    { permission }
  );
  return response.data;
};

export const addDiaryBookAdmin = async (
  diaryBookId: number,
  newAdminId: number
) => {
  const response = await server.post<DiaryBookMemer>(
    `/api/diary-book/${diaryBookId}/members/add-admin`,
    { newAdminId }
  );
  return response.data;
};

export const removeDiaryBookAdmin = async (
  diaryBookId: number,
  toRemoveId: number
) => {
  const response = await server.post<DiaryBookMemer>(
    `/api/diary-book/${diaryBookId}/members/remove-admin`,
    { toRemoveId }
  );
  return response.data;
};

export const fetchDiaryMembers = async (diaryBookId: number) => {
  const responcse = await server.get<DiaryBookMemer[]>(
    `/api/diary-book/${diaryBookId}/members`
  );

  return responcse.data;
};

export const holdStickerImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("imageFile", imageFile);

  const response = await server.post<{
    uuid: string;
  }>("/api/stickers/images/hold", formData);

  return response.data.uuid;
};

type Ordered<T> = {
  order: number;
  data: T;
};

export const updateStickers = async (
  diaryBookId: number,
  stickers: ModifyingSticker[]
) => {
  const orderedData: Ordered<ModifyingSticker>[] = stickers.map(
    (it, index) => ({
      order: index,
      data: it,
    })
  );

  const imagesToHold: Ordered<ImageToUploadSticker>[] = orderedData.filter(
    (it) => it.data.type === "IMAGE_TO_UPLOAD"
  ) as Ordered<ImageToUploadSticker>[];
  const imagesToRequest: Ordered<ImageToRequestSticker>[] = await Promise.all(
    imagesToHold.map(async (it) => {
      const heldImageUuid = await holdStickerImage(it.data.imageFile);
      return {
        order: it.order,
        data: {
          type: "CUSTOM_IMAGE",
          uuid: it.data.uuid,
          posX: it.data.posX,
          posY: it.data.posY,
          size: it.data.size,
          rotation: it.data.rotation,
          heldStickerImageUuid: heldImageUuid,
        } satisfies ImageToRequestSticker,
      };
    })
  );

  const stickersToRequest: Ordered<RequestSticker>[] = [
    ...(orderedData.filter(
      (it) => it.data.type !== "IMAGE_TO_UPLOAD"
    ) as Ordered<RequestSticker>[]),
    ...imagesToRequest,
  ].sort((a, b) => a.order - b.order);

  const response = await server.put<Sticker[]>(
    `/api/diary-book/${diaryBookId}/stickers`,
    {
      stickers: stickersToRequest.map((it) => it.data),
    }
  );

  return response.data;
};

export const togglePinDiaryBook = async (diaryBookId: number) => {
  const response = await server.patch<DiaryBook>(
    `/api/diary-book/${diaryBookId}/pin`
  );
  return response.data;
};
