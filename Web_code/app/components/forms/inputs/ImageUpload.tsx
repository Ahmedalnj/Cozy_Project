"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUploadThing } from "../../../../lib/uploadthing-client";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  disabled?: boolean;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  addImage,
  removeImage,
  disabled = false,
  maxFiles = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, isUploading: isUploadingFromHook } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("Upload completed:", res);
        if (res && res.length > 0) {
          res.forEach((file) => {
            addImage(file.url);
          });
          toast.success("تم رفع الصور بنجاح");
        }
        setIsUploading(false);
      },
      onUploadError: (error: Error) => {
        console.error("Upload error details:", error);
        toast.error(`حدث خطأ أثناء رفع الصور: ${error.message}`);
        setIsUploading(false);
      },
      onUploadBegin: (name) => {
        console.log("Upload started for:", name);
      },
    }
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (images.length + acceptedFiles.length > maxFiles) {
        toast.error(`يمكنك رفع ${maxFiles} صور كحد أقصى`);
        return;
      }

      setIsUploading(true);
      startUpload(acceptedFiles);
    },
    [images.length, maxFiles, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled:
      disabled ||
      isUploading ||
      isUploadingFromHook ||
      images.length >= maxFiles,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      {/* منطقة السحب والإفلات */}
      <div
        {...getRootProps()}
        className={`
          relative
          border-2
          border-dashed
          rounded-lg
          p-6
          text-center
          cursor-pointer
          transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${
            disabled || isUploading || isUploadingFromHook
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
          ${images.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-2">
          {isUploading || isUploadingFromHook ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600">جاري رفع الصور...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600">
                {isDragActive ? (
                  <p>اسحب الصور هنا...</p>
                ) : (
                  <div>
                    <p className="font-medium">اضغط أو اسحب الصور هنا</p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WEBP حتى 4MB
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* عرض الصور المرفوعة */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              الصور المرفوعة ({images.length}/{maxFiles})
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* زر الحذف */}
                <button
                  onClick={() => removeImage(image)}
                  disabled={disabled}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* رقم الصورة */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* رسائل المساعدة */}
      {images.length === 0 && !isUploading && (
        <div className="text-center text-sm text-gray-500">
          <ImageIcon className="h-6 w-6 mx-auto mb-2 text-gray-300" />
          <p>لم يتم رفع أي صور بعد</p>
          <p className="text-xs mt-1">
            ارفع صور عالية الجودة لإظهار منشأتك بأفضل شكل
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
