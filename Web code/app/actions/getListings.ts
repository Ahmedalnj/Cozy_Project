import prisma from "@/app/libs/prismadb";

export interface IListingsParams{
    userId?:string;
}
export default async function getListing(
    params:IListingsParams
) {
    
    try{
        const {userId} =params;

        let query :any ={};

        if(userId){
            query.userId=userId;
        }
        const listings = await prisma.listing.findMany({
            where:query,
            orderBy:{
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(), // تحويل التاريخ إلى سلسلة نصية
        }))

        return safeListings; // إرجاع القوائم بأمان
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('حدث خطأ أثناء جلب القوائم:', error.message); // تسجيل الخطأ للتتبع
        } else {
            console.error('حدث خطأ غير معروف أثناء جلب القوائم');
        }
        throw new Error('فشل في جلب القوائم'); // رسالة خطأ عامة للمستخدم
    }

    }
