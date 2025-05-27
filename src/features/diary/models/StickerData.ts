export type StickerCategory =
  | "alphabet"
  | "alphabet2"
  | "deco"
  | "month"
  | "colorchip"
  | "numbers"
  | "weather";

/**
 * @models/ 에 있는 Sticker Interface와는 다른 모델
 * 스티커의 옵션을 정의한 모델
 */
export interface StickerOption {
  id: string;
  imageUrl: string;
  category: StickerCategory;
}
