"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

interface ImageUploadProps {
  images: string[];
  addImage: (img: string) => void;
  removeImage: (img: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  addImage,
  removeImage,
}) => {
  const handleUpload = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      if (
        result.info &&
        typeof result.info !== "string" &&
        result.info.secure_url
      ) {
        addImage(result.info.secure_url);
      }
    },
    [addImage]
  );

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="fnhetpim"
      options={{ maxFiles: 10 }}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-8 border-neutral-300 flex flex-col justify-center items-center gap-2 text-neutral-600 rounded-lg"
          >
            <TbPhotoPlus size={40} />
            <div className="font-semibold text-sm">Click to upload</div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border group"
                >
                  <Image
                    src={img}
                    alt={`Uploaded ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(img)}
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    type="button"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default ImageUpload;
