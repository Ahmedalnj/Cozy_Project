import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingSlider from "./components/listings/ListingSlider";
import HeroSection from "./components/HeroSection";
import FeaturedListings from "./components/FeaturedListings";
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
      <div className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Listings */}
        <Container>
          <div className="pt-8 pb-12">
            <FeaturedListings listings={listings} currentUser={currentUser} />
          </div>
        </Container>

        {/* More Listings Slider */}
        {listings.length > 0 && (
          <Container>
            <div className="pt-8 pb-16">
              <ListingSlider
                listings={listings}
                currentUser={currentUser}
                title="اكتشف أماكن جديدة"
              />
            </div>
          </Container>
        )}

        {listings.length === 0 && (
          <Container>
            <div className="pt-8 pb-16">
              <EmptyState showReset />
            </div>
          </Container>
        )}
      </div>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
};

export default Home;
