// app/admin/listings/page.tsx
import prisma from "@/app/libs/prismadb";
import { SafeListing } from "@/app/types";
import ListingsTable from "@/app/admin/components/ListingsTable";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  const safeListings: SafeListing[] = listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 space-y-4">
      <ListingsTable listings={safeListings} />
    </div>
  );
}
