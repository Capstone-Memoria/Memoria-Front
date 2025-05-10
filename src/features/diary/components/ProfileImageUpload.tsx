import Image from "@/components/base/Image";
import { useEffect, useRef, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";

interface ProfileImageUploadProps {
  currentImageId?: string;
  overwrittenImage?: File;
  onImageSelected: (file: File) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageId,
  overwrittenImage,
  onImageSelected,
}) => {
  const [overwrittenImageURL, setOverwrittenImageURL] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (overwrittenImage) {
      setOverwrittenImageURL(URL.createObjectURL(overwrittenImage));
    }

    return () => {
      if (overwrittenImageURL) {
        URL.revokeObjectURL(overwrittenImageURL);
      }
    };
  }, [overwrittenImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    e.target.value = "";
  };
  return (
    <>
      <div
        className={"size-32 border rounded-lg bg-gray-100 overflow-hidden"}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        {overwrittenImageURL ? (
          <img
            src={overwrittenImageURL}
            alt={"profile"}
            className={"size-full object-cover"}
          />
        ) : (
          <Image imageId={currentImageId} className={"size-full"} />
        )}
      </div>
      <input
        ref={fileInputRef}
        className={"hidden"}
        type={"file"}
        accept={"image/*"}
        onChange={handleImageChange}
      />
    </>
  );
};

export default ProfileImageUpload;
