export type StickerCategory =
  | "alphabet"
  | "alphabet2"
  | "deco"
  | "month"
  | "colorchip"
  | "numbers"
  | "weather"
  | "text"
  | "image";

export type StickerType = "preset" | "text" | "image";

/**
 * @models/ 에 있는 Sticker Interface와는 다른 모델
 * 스티커의 옵션을 정의한 모델
 */
export interface StickerOption {
  id: string;
  imageUrl: string;
  category: StickerCategory;
  type: StickerType;
  content?: string; // 텍스트 스티커의 경우 텍스트 내용
  textStyle?: {
    fontWeight?: string; // 'normal' | 'bold'
    fontStyle?: string; // 'normal' | 'italic'
    fontSize?: number; // px 단위
    fontFamily?: string;
    color?: string;
  };
}
