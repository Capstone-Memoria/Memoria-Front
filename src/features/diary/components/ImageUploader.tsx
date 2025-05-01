import Image from "@/components/base/Image";
import { cn } from "@/lib/utils";
import { AttachedFile } from "@/models/AttachedFile";
import heic2any from "heic2any";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { MdArrowDownward } from "react-icons/md";

type ImageModification = {
  addedImages: File[];
  deletedImageIds: string[];
};

interface ImageUploaderProps {
  onImagesChange: (params: ImageModification) => void;
  initialImages?: ServerUploadedImage[];
}

type ServerUploadedImage = AttachedFile;
type StagedImage = {
  file: File;
  url: string;
};

type EditingImage = ServerUploadedImage | StagedImage;

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  initialImages = [],
}) => {
  const [images, setImages] = useState<EditingImage[]>(initialImages);
  const [toDeleteImageIds, setToDeleteImageIds] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayedImages = useMemo(() => {
    if (isExpanded) {
      // 모든 이미지 보여줌
      return images;
    } else {
      // 최대 6개만 보여줌
      return images.slice(0, 6);
    }
  }, [images, isExpanded]);

  const handleRemoveImage = (editingImage: EditingImage) => {
    if ("id" in editingImage) {
      const newToDeleteImageIds = [...toDeleteImageIds, editingImage.id];
      setToDeleteImageIds(newToDeleteImageIds);
      onImagesChange({
        addedImages: [
          ...images.filter((img) => "url" in img).map((img) => img.file),
        ],
        deletedImageIds: newToDeleteImageIds,
      });
    }

    setImages((prevImages) => prevImages.filter((img) => img !== editingImage));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsConverting(true);

    const processedFiles: File[] = [];

    for (const file of files) {
      if (file.type === "image/heic" || file.type === "image/heif") {
        // HEIC 이미지를 JPG로 변환
        try {
          const jpegBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
          if (Array.isArray(jpegBlob)) {
            // If heic2any returns an array of blobs (e.g., for bursts), take the first one
            processedFiles.push(
              new File(
                [jpegBlob[0] as Blob],
                file.name.replace(/\.(heic|heif)$/i, ".jpg"),
                { type: "image/jpeg" }
              )
            );
          } else {
            processedFiles.push(
              new File(
                [jpegBlob as Blob],
                file.name.replace(/\.(heic|heif)$/i, ".jpg"),
                { type: "image/jpeg" }
              )
            );
          }
        } catch (error) {
          console.error("HEIC to JPG conversion failed:", error);
          // 변환 실패 시 원본 파일 추가 (선택 사항)
          // processedFiles.push(file);
        }
      } else {
        // 그 외 이미지 파일은 그대로 추가
        processedFiles.push(file);
      }
    }

    const newImages = processedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);

    onImagesChange({
      addedImages: [
        ...images.filter((img) => "url" in img).map((img) => img.file),
        ...processedFiles,
      ],
      deletedImageIds: toDeleteImageIds,
    });

    fileInputRef.current!.value = "";
    setIsExpanded(true);
    setIsConverting(false);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <AnimatePresence>
        <div className={"grid grid-cols-3 gap-2 place-items-center"}>
          {displayedImages.map((image) => (
            <motion.div
              key={"id" in image ? image.id : image.url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={
                "relative w-24 h-24 overflow-hidden rounded-md group cursor-pointer"
              }
              onClick={() => handleRemoveImage(image)}
            >
              {"id" in image ? (
                <Image
                  className={"size-full"}
                  imageId={image.id}
                  imageClassName={"object-cover"}
                />
              ) : (
                <img src={image.url} className={"size-full object-cover"} />
              )}
              <div
                className={
                  "absolute inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                }
              >
                <IoCloseCircle className={"text-white text-3xl"} />
              </div>
            </motion.div>
          ))}
          {(isExpanded || images.length < 6) && (
            <motion.div
              layout
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={
                "w-24 h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
              }
              onClick={handleFileUploadClick}
            >
              {isConverting ? (
                <span className={"text-gray-500 text-sm"}>변환 중...</span>
              ) : (
                <span className={"text-gray-500 text-2xl"}>+</span>
              )}
              <input
                type={"file"}
                accept={"image/*"}
                multiple
                onChange={handleFileChange}
                className={"hidden"}
                ref={fileInputRef}
              />
            </motion.div>
          )}
        </div>
        {images.length >= 6 && (
          <div
            className={
              "bg-gray-100 py-2 flex items-center justify-center rounded-md mt-2"
            }
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <MdArrowDownward
              className={cn("text-gray-500 transition-transform", {
                "rotate-180": isExpanded,
              })}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
