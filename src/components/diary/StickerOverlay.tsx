import { Sticker } from "@/models/Sticker";
import { useElementSize } from "@reactuses/core";
import { HTMLAttributes, useRef } from "react";
import StaticSticker from "./StaticSticker";

interface StickerOverlayProps extends HTMLAttributes<HTMLDivElement> {
  stickers: Sticker[];
}

const StickerOverlay = ({
  stickers,
  children,
  ...props
}: StickerOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlaySize = useElementSize(overlayRef);

  return (
    <div {...props} ref={overlayRef} className={"relative"}>
      {children}
      {overlaySize &&
        stickers.map((sticker) => (
          <StaticSticker
            key={sticker.uuid}
            sticker={sticker}
            templateWidth={overlaySize[0]}
          />
        ))}
    </div>
  );
};

export default StickerOverlay;
