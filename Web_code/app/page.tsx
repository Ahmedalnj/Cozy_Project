import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingSlider from "./components/listings/ListingSlider";
import HeroSection from "./components/HeroSection";
import FeaturedListings from "./components/FeaturedListings";
import FilterResults from "./components/FilterResults";
import FilteredListings from "./components/FilteredListings";
import Footer from "./components/Footer";


interface HomeProps {
  searchParams: Promise<IListingsParams>;
}

const Home = async (props: HomeProps) => {
  const searchParams = await props.searchParams;
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 pt-16">
        {/* Hero Section - Show only when no filters are applied */}
        {!searchParams.locationValue &&
          !searchParams.category &&
          !searchParams.guestCount &&
          !searchParams.roomCount &&
          !searchParams.bathroomCount &&
          !searchParams.minPrice &&
          !searchParams.maxPrice &&
          !searchParams.startDate &&
          !searchParams.endDate && <HeroSection />}

        {/* Filter Results - Show only when there are active filters */}
        <FilterResults totalResults={listings.length} />

        {/* Featured Listings - Show only when no filters are applied */}
        {!searchParams.locationValue &&
          !searchParams.category &&
          !searchParams.guestCount &&
          !searchParams.roomCount &&
          !searchParams.bathroomCount &&
          !searchParams.minPrice &&
          !searchParams.maxPrice &&
          !searchParams.startDate &&
          !searchParams.endDate && (
            <Container>
              <div className="pt-8 pb-12">
                <FeaturedListings
                  listings={listings}
                  currentUser={currentUser}
                />
              </div>
            </Container>
          )}

        {/* Filtered Results - Show when filters are applied */}
        {(searchParams.locationValue ||
          searchParams.category ||
          searchParams.guestCount ||
          searchParams.roomCount ||
          searchParams.bathroomCount ||
          searchParams.minPrice ||
          searchParams.maxPrice ||
          searchParams.startDate ||
          searchParams.endDate) && (
          <Container>
            <div className="pt-8 pb-16">
              <FilteredListings listings={listings} currentUser={currentUser} />
            </div>
          </Container>
        )}

        {/* More Listings Slider - Show only when no filters are applied */}
        {!searchParams.locationValue &&
          !searchParams.category &&
          !searchParams.guestCount &&
          !searchParams.roomCount &&
          !searchParams.bathroomCount &&
          !searchParams.minPrice &&
          !searchParams.maxPrice &&
          !searchParams.startDate &&
          !searchParams.endDate &&
          listings.length > 0 && (
            <Container>
              <div className="pt-8 pb-16">
                                 <ListingSlider
                   listings={listings}
                   currentUser={currentUser}
                 />
              </div>
            </Container>
          )}

        {/* Empty State - Show when no listings and no filters */}
        {listings.length === 0 &&
          !searchParams.locationValue &&
          !searchParams.category &&
          !searchParams.guestCount &&
          !searchParams.roomCount &&
          !searchParams.bathroomCount &&
          !searchParams.minPrice &&
          !searchParams.maxPrice &&
          !searchParams.startDate &&
          !searchParams.endDate && (
            <EmptyState showReset />
          )}
      </div>
      <Footer />
    </div>
  );
};
export default Home;
