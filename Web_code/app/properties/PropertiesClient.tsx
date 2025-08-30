"use client";

import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import { SafeListing, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";
import useEditModal from "../hooks/useEditModal";
import EditModal from "../components/listings/modals/EditModal";

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const editModal = useEditModal();

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Listing deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Error deleting listing");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <>
      <Container>
        <Heading title="Properties" subtitle="List of your Properties" />
        <div
          className="
            mt-10
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-3
            sm:gap-4
            md:gap-6
            lg:gap-8
          "
        >
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              data={listing}
              actionId={listing.id}
              onAction={onCancel}
              disabled={deletingId === listing.id}
              actionLabel="Delete"
              secondaryActionLabel="Update"
              currentUser={currentUser}
              secondaryAction={() => editModal.onOpen(listing)}
            />
          ))}
        </div>
      </Container>
      <EditModal />
    </>
  );
};

export default PropertiesClient;
