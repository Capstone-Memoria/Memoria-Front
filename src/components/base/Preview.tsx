import api from "@/api";
import { cn } from "@/lib/utils";
import { useImageStore } from "@/stores/ImageStore";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Spinner from "./Spinner";

interface PreviewProps {
  imageId: string | undefined;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Preview: React.FC<PreviewProps> = ({ imageId, open, setIsOpen }) => {
  const imageStore = useImageStore();
  const [loadedImage, setLoadedImage] = useState<string>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (loadedImage) {
        URL.revokeObjectURL(loadedImage);
      }
    };
  }, [loadedImage]);

  useEffect(() => {
    if (imageId) {
      imageMutation.mutate();
    }
  }, [imageId]);

  const imageMutation = useMutation({
    mutationFn: async () => {
      if (!imageId) throw new Error("Image ID is required");

      const cachedImage = imageStore.get(imageId);
      if (cachedImage && cachedImage.image) {
        return cachedImage.image;
      }

      const newlyFetchedImage = await api.image.fetchImage(imageId);
      imageStore.add(imageId, {
        imageURL: URL.createObjectURL(newlyFetchedImage),
        image: newlyFetchedImage,
      });
      return newlyFetchedImage;
    },
    onSuccess: (data) => {
      const url = URL.createObjectURL(data);
      imageStore.add(imageId!, {
        imageURL: url,
        image: data,
      });
      setLoadedImage(url);
    },
    onError: () => {
      setError(true);
    },
  });

  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [touchStartPosition, setTouchStartPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [currentTouchPosition, setCurrentTouchPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setTouchStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setCurrentTouchPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setCurrentTouchPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsTouching(false);

    const distance = Math.sqrt(
      (currentTouchPosition.x - touchStartPosition.x) ** 2 +
        (currentTouchPosition.y - touchStartPosition.y) ** 2
    );

    if (distance > 100) {
      setIsOpen(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-lg touch-none"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={"flex items-center justify-center"}
          >
            {imageMutation.isPending && !loadedImage && (
              <div className={"text-white"}>
                <Spinner />
              </div>
            )}
            {!imageMutation.isPending && loadedImage && (
              <img
                className={cn({
                  "transition-transform duration-300": !isTouching,
                })}
                style={{
                  transform: isTouching
                    ? `translate(${(currentTouchPosition.x - touchStartPosition.x) / 3}px, ${(currentTouchPosition.y - touchStartPosition.y) / 3}px) scale(${
                        1 -
                        Math.abs(
                          currentTouchPosition.x - touchStartPosition.x
                        ) /
                          2500
                      })`
                    : "translate(0px, 0px) scale(1)",
                }}
                src={loadedImage}
                alt={"preview"}
              />
            )}
            {error && (
              <div className={"text-red-500"}>
                이미지를 불러오는데 실패했습니다.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("root")!
  );
};

export default Preview;
