import api from "@/api";
import { useImageStore } from "@/stores/ImageStore";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId?: string;
  imageClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const Image: React.FC<ImageProps> = ({
  imageId,
  imageClassName,
  onLoad,
  onError,
  ...props
}) => {
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
      onLoad?.();
    },
    onError: () => {
      setError(true);
      onError?.();
    },
  });

  return (
    <div
      {...props}
      className={clsx(
        "flex items-center justify-center bg-gray-100",
        {
          "animate-pulse": imageMutation.isPending,
          "cursor-pointer transition-colors hover:bg-gray-200": !!loadedImage,
        },
        props.className
      )}
    >
      {!!loadedImage && (
        <img
          src={loadedImage}
          className={clsx("size-full", imageClassName)}
          draggable={false}
        />
      )}
      {error && <MdError className={"text-xl text-gray-400"} />}
      {!imageId && <div className={"size-full bg-green-200"}></div>}
    </div>
  );
};

export default Image;
