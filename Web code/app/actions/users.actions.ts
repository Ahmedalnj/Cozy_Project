// actions/admin/users.actions.ts
'use server';
import prisma from '@/app/libs/prismadb';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, role: string) {
  try {
    // التحقق من الصلاحيات أولاً
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      throw new Error('المستخدم غير موجود');
    }

    // تحديث الدور
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, role: true }
    });

    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'تم تحديث صلاحيات المستخدم بنجاح',
      data: updatedUser
    };
  } catch (error) {
    console.error('فشل في تحديث الصلاحيات:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    // التحقق من وجود المستخدم أولاً
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userToDelete) {
      throw new Error('المستخدم غير موجود');
    }

    // حذف المستخدم
    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    };
  } catch (error) {
    console.error('فشل في حذف المستخدم:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'لا يمكن حذف المستخدم لوجود بيانات مرتبطة'
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
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: users };
  } catch (error) {
    console.error('فشل في جلب المستخدمين:', error);
    return { success: false, message: 'فشل في جلب بيانات المستخدمين' };
  }
}