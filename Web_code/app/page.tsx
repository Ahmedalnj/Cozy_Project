import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/ui/Container";
import EmptyState from "./components/ui/EmptyState";
import ListingSlider from "./components/listings/cards/ListingSlider";
import HeroSection from "./components/layout/HeroSection";
import FeaturedListings from "./components/features/FeaturedListings";
import FilterResults from "./components/features/FilterResults";
import FilteredListings from "./components/features/FilteredListings";
import Footer from "./components/layout/Footer";

interface HomeProps {
  searchParams: Promise<IListingsParams>;
}

const Home = async (props: HomeProps) => {
  const searchParams = await props.searchParams;
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  // Helper function to check if any filters are applied
  const hasActiveFilters = () => {
    return !!(
      searchParams.locationValue ||
      searchParams.category ||
      searchParams.guestCount ||
      searchParams.roomCount ||
      searchParams.bathroomCount ||
      searchParams.minPrice ||
      searchParams.maxPrice ||
      searchParams.startDate ||
      searchParams.endDate
    );
  };

  const showDefaultContent = !hasActiveFilters();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pt-16">
        {/* Hero Section */}
        {showDefaultContent && <HeroSection />}

        {/* Filter Results */}
        <FilterResults totalResults={listings.length} />

        {/* Featured Listings */}
        {showDefaultContent && (
          <Container>
            <div className="pt-8 pb-12">
              <FeaturedListings listings={listings} currentUser={currentUser} />
            </div>
          </Container>
        )}

        {/* Filtered Results */}
        {hasActiveFilters() && (
          <Container>
            <div className="pt-8 pb-16">
              <FilteredListings listings={listings} currentUser={currentUser} />
            </div>
          </Container>
        )}

        {/* More Listings Slider */}
        {showDefaultContent && listings.length > 0 && (
          <Container>
            <div className="pt-8 pb-16">
              <ListingSlider listings={listings} currentUser={currentUser} />
            </div>
          </Container>
        )}

        {/* Empty State */}
        {listings.length === 0 && showDefaultContent && (
          <EmptyState showReset />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;