import EmptyState from "../components/ui/EmptyState";
import ClientOnly from "../components/ui/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getListing from "../actions/getListings";
import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="unauthorized" subtitle="Please Login"></EmptyState>
      </ClientOnly>
    );
  }

  const listings = await getListing({
    userId: currentUser.id,
  });

  if (listings.length == 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="no Properties found"
          subtitle="looks like you have no Properties."
        ></EmptyState>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </ClientOnly>
  );
};
export default PropertiesPage;
