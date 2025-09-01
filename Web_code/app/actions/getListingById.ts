import prisma from "@/app/libs/prismadb";

interface Iparams {
    listingId?: string;
}

export default async function getListingById(
    params: Iparams
) {
    try {
        const { listingId } = params;

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
             },
             include: {
                user: true,
                reviews: {
                    select: {
                        rating: true,
                    },
                },
             }
        });

        if ( !listing ) {
            return null;
        }

        // حساب إحصائيات المراجعات
        const reviewCount = listing.reviews.length;
        const averageRating = reviewCount > 0 
            ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
            : 0;

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(), // تحويل تاريخ الإنشاء إلى string
            reviewStats: {
                count: reviewCount,
                averageRating: Math.round(averageRating * 10) / 10, // تقريب إلى رقم عشري واحد
            },
            reviews: undefined, // إزالة بيانات المراجعات الكاملة
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified:
                   listing.user.emailVerified?.toISOString() || null, // تحويل تاريخ التحقق من البريد الإلكتروني إلى string
            }
        };
    } catch (error: unknown ){
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}
