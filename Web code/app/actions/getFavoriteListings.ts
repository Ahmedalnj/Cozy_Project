import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../actions/getCurrentUser";

export default async function getFavoriteListings() {

    try {
        
        const currentUser = await getCurrentUser();
        if(!currentUser){
            return [];
        }

        const favorites = await prisma.listing.findMany({
            where:{
                id:{
                    in:[...(currentUser.favoriteIds || [])]
                }
            }
        });

        const safeFavorites =favorites.map((favorite) => ({
            ...favorite,
            createdAt:favorite.createdAt.toISOString()
        }));

        return safeFavorites;

    } catch (error:unknown) {
        throw new Error(error instanceof Error ? error.message : String(error));
        
    }
    
}