export { default } from "next-auth/middleware";

//protect routes as user should be logged in to see them
export const config = {
  matcher: ["/trips", "/reservations", "/properties", "/favorites"],
};
