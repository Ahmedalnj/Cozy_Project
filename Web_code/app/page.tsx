import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingSlider from "./components/listings/ListingSlider";

interface HomeProps {
  searchParams: Promise<IListingsParams>;
}
const Home = async (props: HomeProps) => {
  const searchParams = await props.searchParams;
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div className="pt-24">
        <ListingSlider listings={listings} currentUser={currentUser} />
      </div>
    </Container>
  );
};
export default Home;
