import { Sticker } from "@/models/Sticker";
import { HTMLAttributes } from "react";
import StaticSticker from "./StaticSticker";

interface StickerOverlayProps extends HTMLAttributes<HTMLDivElement> {
  stickers: Sticker[];
}

const StickerOverlay: React.FC<StickerOverlayProps> = ({
  stickers,
  children,
  ...props
}) => {
  return (
    <div {...props} className={"relative"}>
      {children}
      {stickers.map((sticker) => (
        <StaticSticker key={sticker.uuid} sticker={sticker} />
      ))}
    </div>
  );
};

export default StickerOverlay;
