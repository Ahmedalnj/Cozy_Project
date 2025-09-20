import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const f = createUploadthing();

// Middleware للتحقق من صلاحيات المستخدم
const auth = (req: Request) => getServerSession(authOptions);

export const ourFileRouter = {
  // رفع الصور للمنشآت
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // التحقق من تسجيل الدخول
      const session = await auth(req);
      if (!session?.user?.id) throw new Error("غير مصرح لك");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("تم رفع الملف بنجاح:", file.name);
      console.log("معرف المستخدم:", metadata.userId);

      return { uploadedBy: metadata.userId };
    }),

  // رفع صورة الملف الشخصي
  profileImageUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth(req);
      if (!session?.user?.id) throw new Error("غير مصرح لك");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("تم رفع صورة الملف الشخصي:", file.name);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
