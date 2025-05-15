export interface Sticker {
  uuid: string;
  stickerType: string;
  posX: number; //스티커의 중앙이 위치할 다이어리의 너비의 몇퍼센트인지 (0~1.0)
  posY: number; //스티커의 중앙이 위치할 다이어리의 높이의 몇퍼센트인지 (0~1.0)
  size: number; //스티커의 너비가 다이어리의 너비의 몇퍼센트인지 (0~1.0)
  rotation: number; //스티커의 회전 각도 (0~360)
}
