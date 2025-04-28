import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { MdArrowDownward } from "react-icons/md";

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
  const [images, setImages] = useState<string[]>([]);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImageUrls]);
    setFileObjects((prevFiles) => [...prevFiles, ...files]);
    onImagesChange([...fileObjects, ...files]);

    setIsExpanded(true);

    // 파일 입력 초기화
    event.target.value = "";
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newFileObjects = fileObjects.filter(
      (_, index) => index !== indexToRemove
    );
    setImages(newImages);
    setFileObjects(newFileObjects);
    onImagesChange(newFileObjects);
  };

  const displayedImages = isExpanded ? images : images.slice(0, 6);

  return (
    <div className={"flex flex-col gap-2"}>
      <AnimatePresence>
        <div className={"grid grid-cols-3 gap-2"}>
          {displayedImages.map((image, index) => (
            <motion.div
              key={image}
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
              onClick={() => handleRemoveImage(index)}
            >
              <img
                src={image}
                alt={`uploaded image ${index + 1}`}
                className={"object-cover w-full h-full"}
              />
              <div
                className={
                  "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
              onClick={handleButtonClick}
            >
              <span className={"text-gray-500 text-2xl"}>+</span>
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
