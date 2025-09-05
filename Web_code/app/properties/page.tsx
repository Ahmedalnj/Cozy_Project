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
        <EmptyState title="unauthorized" subtitle="please_login"></EmptyState>
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
          title="no_properties_found"
          subtitle="no_properties_subtitle"
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
