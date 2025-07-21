import prisma from "@/app/libs/prismadb";
import { Prisma } from "@prisma/client";
import { SafeListing } from "@/app/types";
import ListingsTable from "@/app/(admin)/admin/components/ListingsTable";

interface ListingsPageProps {
  searchParams?: Promise<{
    page?: string;
    per_page?: string;
    search?: string;
  }>;
}

export default async function AdminListingsPage(props: ListingsPageProps) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const perPage = Number(searchParams?.per_page) || 10;
  const searchQuery = searchParams?.search || "";
  const skip = (currentPage - 1) * perPage;

  const whereClause: Prisma.ListingWhereInput = searchQuery
    ? {
        title: { contains: searchQuery, mode: "insensitive" },
      }
    : {};

  try {
    const listings = await prisma.listing.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    });

    const safeListings: SafeListing[] = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return (
      <div className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">إدارة العقارات</h2>
          <form
            action="/admin/listings"
            method="GET"
            className="flex gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              name="search"
              placeholder="ابحث بالعقارات..."
              className="px-4 py-2 border rounded-lg flex-grow md:flex-grow-0"
              defaultValue={searchQuery}
            />
            <input type="hidden" name="page" value="1" />
            <input type="hidden" name="per_page" value={perPage} />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              بحث
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ListingsTable listings={safeListings} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">إدارة العقارات</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>حدث خطأ أثناء جلب بيانات العقارات. يرجى المحاولة لاحقاً.</p>
        </div>
      </div>
    );
  }
}
