import React from "react";
import { SEO, BusinessCTA } from "../../components";
import { SearchProvider, useSearch } from "./context/SearchContext";
import {
  SearchHeader,
  SearchEmptyLanding,
  SearchFilterSidebar,
  MobileFilterDrawer,
  SearchResultsMetaBar,
  ActiveFiltersBar,
  SearchLoadingSkeleton,
  SearchZeroResults,
  SearchResultsFeed,
  SearchPagination,
  MobileSortFilterBar,
  MobileSortBottomSheet,
} from "./Sections";

function SearchContent() {
  const { activeQuery, listingsLoading, filteredListings } = useSearch();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background-secondary font-primary text-on-surface antialiased flex flex-col">
      <SEO
        title={
          activeQuery.trim()
            ? `Search results for "${activeQuery}" in Haldia | NeedMet`
            : "Search Verified Local Businesses & Services | NeedMet"
        }
        description={
          activeQuery.trim()
            ? `Find top verified ${activeQuery} in Haldia, West Bengal. Real-time ratings, reviews, contact details, and locations on NeedMet.`
            : "Discover trusted shops, salons, repairs, doctors, and services in Haldia. 100% verified community directory."
        }
        canonicalUrl="https://needmet.in/search"
      />

      {/* ── TOP SEARCH BAR ── */}
      <SearchHeader />

      {/* ── MOBILE SORT & FILTER BAR (AT THE TOP, SCROLLS NATURALLY WITH PAGE) ── */}
      {activeQuery.trim() !== "" && <MobileSortFilterBar />}

      {/* ── INITIAL EMPTY STATE (BEFORE SEARCHING) ── */}
      {!activeQuery.trim() && <SearchEmptyLanding />}

      {/* ── SEARCH RESULTS MAIN DISCOVERY LAYOUT ── */}
      {activeQuery.trim() !== "" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 w-full flex-1">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Desktop Filters */}
            <SearchFilterSidebar />

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />

            {/* Results Feed Column */}
            <main className="flex-1 min-w-0 w-full space-y-5">
              <SearchResultsMetaBar />
              <ActiveFiltersBar />

              {/* Shimmer loading skeleton */}
              {listingsLoading && <SearchLoadingSkeleton />}

              {/* Zero matches state */}
              {!listingsLoading && filteredListings.length === 0 && (
                <SearchZeroResults />
              )}

              {/* Listings feed & pagination */}
              {!listingsLoading && filteredListings.length > 0 && (
                <>
                  <SearchResultsFeed />
                  <SearchPagination />
                </>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ── MOBILE SORT BOTTOM SHEET (MODAL SLIDES UP FROM BOTTOM) ── */}
      <MobileSortBottomSheet />

      {/* Business Partner CTA */}
      <div className="mt-8 pb-20 md:pb-8">
        <BusinessCTA />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchContent />
    </SearchProvider>
  );
}