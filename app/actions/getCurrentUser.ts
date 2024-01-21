// get current user, using server component, nextjs, without
// api call by calling prisma db directly

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

import prisma from "@/app/libs/prismadb";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt?.toISOString() || "",
      updatedAt: currentUser.updatedAt?.toISOString() || "",
      emailVerified: currentUser.emailVerified?.toString() || null,
    };
  } catch (err: any) {
    return null;
  }
}
