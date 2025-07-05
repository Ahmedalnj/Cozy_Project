import prisma from "@/app/libs/prismadb";

export default async function getListing() {
    
    try{
        const listings = await prisma.listing.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        });

        const safelistedListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(), // تحويل التاريخ إلى سلسلة نصية
        }))

        return safelistedListings; // إرجاع القوائم بأمان
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('حدث خطأ أثناء جلب القوائم:', error.message); // تسجيل الخطأ للتتبع
        } else {
            console.error('حدث خطأ غير معروف أثناء جلب القوائم');
        }
        throw new Error('فشل في جلب القوائم'); // رسالة خطأ عامة للمستخدم
    }

    }
