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
        <div className="flex flex-col gap-6">
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-80 transition-all duration-300 border-dashed border-2 p-12 border-rose-300 hover:border-rose-400 flex flex-col justify-center items-center gap-4 text-rose-600 rounded-xl bg-rose-50 hover:bg-rose-100 group"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TbPhotoPlus size={32} className="text-white" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">Click to upload photos</div>
              <div className="text-sm text-rose-500 mt-1">Upload up to 10 high-quality images</div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Uploaded Photos ({images.length}/10)</h3>
                <span className="text-sm text-gray-500">Click on X to remove</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group hover:border-rose-300 transition-all duration-300"
                  >
                    <Image
                      src={img}
                      alt={`Uploaded ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <button
                      onClick={() => removeImage(img)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 transform hover:scale-110"
                      type="button"
                    >
                      <IoClose size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Photo {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default ImageUpload;
