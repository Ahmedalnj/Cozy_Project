"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      if (
        result.info &&
        typeof result.info !== "string" &&
        result.info.secure_url
      ) {
        onChange(result.info.secure_url);
      }
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="fnhetpim"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => (
        <div
          onClick={() => open?.()}
          className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
        >
          <TbPhotoPlus size={50} />
          <div className="font-semibold text-lg">click to upload</div>
          {value && (
            <div className="absolute inset-0 w-full h-full">
              <Image
                fill
                style={{ objectFit: "cover" }}
                src={value}
                alt="Upload"
              />
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default ImageUpload;
