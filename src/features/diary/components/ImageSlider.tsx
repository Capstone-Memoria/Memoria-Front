import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

interface ImageSliderProps {
  images: Array<{ url: string; file: File }>;
  onRemoveImage: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onRemoveImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 최소 스와이프 거리 설정
  const minSwipeDistance = 50;

  const nextSlide = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length <= 1) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // 이미지가 변경되면 첫 번째 이미지를 보여줌
  useEffect(() => {
    setCurrentIndex(0);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full my-3 rounded-lg overflow-hidden bg-gray-100">
      <div
        ref={sliderRef}
        className="w-full relative aspect-video"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={image.url}
              alt={`이미지 ${index + 1}`}
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white z-20"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(index);
              }}
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-20"
            onClick={prevSlide}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-1 z-20"
            onClick={nextSlide}
          >
            <FiChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
