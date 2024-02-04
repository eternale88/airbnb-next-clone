import getCurrentUser from "@/app/actions/getCurrentUser";
import { getListingsById } from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}
const listingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingsById(params);
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyState />;
  }
  return (
    <ListingClient
      reservations={reservations}
      listing={listing}
      currentUser={currentUser}
    />
  );
};

export default listingPage;
