import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListing() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    });

    //sanitized favorites
    const safeFavorites = favorites.map((favorite) => {
      return {
        ...favorite,
        createdAt: favorite.createdAt.toISOString(),
      };
    });

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
