import React from "react";
import { SpotlightListingCard } from "../../../components";
import { useSearch } from "../context/SearchContext";
import SearchListItemCard from "./SearchListItemCard";

export default function SearchResultsFeed() {
  const { paginatedListings, viewMode } = useSearch();

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginatedListings.map((listing) => (
          <SpotlightListingCard
            key={listing.listingId || listing.id}
            listing={listing}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paginatedListings.map((listing) => (
        <SearchListItemCard
          key={listing.listingId || listing.id}
          listing={listing}
        />
      ))}
    </div>
  );
}
