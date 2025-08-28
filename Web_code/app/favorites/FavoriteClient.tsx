"use client";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import { useTranslation } from "react-i18next";
interface FavoriteClient {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}
const FavoriteClient: React.FC<FavoriteClient> = ({
  listings,
  currentUser,
}) => {
  const { t } = useTranslation("common");
  return (
    <Container>
      <Heading title={t("favorites")} subtitle={t("favorites_subtitle")} />
      <div
        className="
      mt-10
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-6
      gap-8"
      >
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
};

export default FavoriteClient;
