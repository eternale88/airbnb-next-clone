import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function getListingsById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        // so we can have proper image and name of user who owns it
        user: true,
      },
    });

    if (!listing) {
      return null;
    }

    // could just return the listing, but this is sanitizing data for showing in the ui, as sometimes cuases errors.
    return {
      ...listing,
      createdAt: listing.createdAt.toString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toString(),
        updatedAt: listing.user.updatedAt.toString(),
        emailVerified: listing.user.emailVerified?.toString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
