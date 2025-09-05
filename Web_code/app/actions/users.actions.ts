// actions/admin/users.actions.ts
"use server";
import prisma from "@/app/libs/prismadb";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
  try {
    // التحقق من الصلاحيات أولاً
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // تحديث الدور
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, role: true },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateUserStatus(
  userId: string,
  updates: {
    role?: "ADMIN" | "USER";
    hostStatus?: "NOT_REQUESTED" | "PENDING" | "APPROVED" | "REJECTED";
  }
) {
  try {
    // التحقق من وجود المستخدم أولاً
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // التحقق من صحة البيانات
    if (updates.hostStatus === "APPROVED") {
      // إذا كان التحديث إلى مضيف، يجب التأكد من وجود طلب مضيف صالح
      const hostRequest = await prisma.hostRequest.findFirst({
        where: { 
          userId,
          status: "PENDING"
        }
      });
      
      if (!hostRequest) {
        throw new Error("Cannot approve user as host without a valid request");
      }
    }

    // تحديث المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: { 
        id: true, 
        name: true, 
        role: true, 
        hostStatus: true 
      },
    });

    // إذا تم تغيير hostStatus إلى APPROVED، تحديث طلب المضيف
    if (updates.hostStatus === "APPROVED") {
      await prisma.hostRequest.updateMany({
        where: { userId },
        data: { status: "APPROVED" }
      });
    }

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Failed to update user status:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    // التحقق من وجود المستخدم أولاً
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // حذف المستخدم
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Cannot delete user due to related data",
    };
  }
}

export async function getUsersForAdmin() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hostStatus: true, // إضافة hostStatus
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // تحويل التواريخ إلى strings لتجنب مشاكل JSON serialization
    const formattedUsers = users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return { success: true, data: formattedUsers };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { success: false, message: "Failed to fetch user data" };
  }
}
