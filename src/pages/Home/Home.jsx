import React, { useEffect, Fragment } from "react";
import {
  Hero,
  TestimonialSection,
  WhyDiscoverNeedMet,
} from "./Sections";
import {
  CategorySection,
  ListingSection,
  SystemState,
  Hyperlocal,
  TrendingSearches,
  BusinessCTA,
  HomeLoader,
  Banner,
  SEO,
  SpotlightListingCard,
} from "../../components";

import ErrorImg from "../../assets/error.png";
import {
  getNewListings,
  getRecommendedListings,
  getListingByCategory,
} from "../../services/firebase/firestore/listingService.js";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getHomeDetails } from "../../services/firebase/firestore/homeService.js";
import useInfo from "../../contexts/infoContext.jsx";
import { generateSlug } from "../../utils/slugify.js";

function Home() {
  const { data: homeData, isLoading: homeLoading, error: homeError } = useQuery({
    queryKey: ["homeDetails"],
    queryFn: () => getHomeDetails(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000,
  });

  const { setContactNo } = useInfo();
  useEffect(() => {
    if (homeData?.whatsappSupport) {
      setContactNo(homeData.whatsappSupport);
    }
  }, [homeData, setContactNo]);

  const categoryList = homeData?.listings ?? [];

  const { data: recommendedListings = [] } = useQuery({
    queryKey: ["recommendedListings", "short"],
    queryFn: () => getRecommendedListings({ quantity: 20 }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 24 * 60 * 60 * 1000,
  });

  const { data: newListings = [] } = useQuery({
    queryKey: ["newListings", "short"],
    queryFn: () => getNewListings({ quantity: 20 }),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 24 * 60 * 60 * 1000,
  });

  const categoryQueries = useQueries({
    queries: categoryList.map((category) => ({
      queryKey: ["categoryListings", category],
      queryFn: () => getListingByCategory({ category: [category], quantity: 20 }),
      enabled: !!category,
      staleTime: 30 * 60 * 1000, // 30 minutes
      gcTime: 24 * 60 * 60 * 1000,
    })),
  });

  if (homeLoading) {
    return <HomeLoader />;
  }

  if (homeError) {
    return (
      <SystemState
        imageSrc={ErrorImg}
        title="OOPS! Something Went"
        highlight="Wrong"
        message="We couldn't load the content right now. Please check your connection and try again later."
        actionType="refresh"
        actionLabel="Try Again"
      />
    );
  }

  return (
    <div className="w-full bg-background min-h-screen text-on-surface font-primary antialiased">
      <SEO
        title="NeedMet | Find Local Businesses & Services Near You"
        description="Search and discover trusted local service providers, shops, salons, electricians, and businesses in your area. Fast, verified, and community-recommended."
      />

      {/* 1. HERO SECTION */}
      <Hero data={homeData} />

      {/* 2. EXPLORE POPULAR CATEGORIES */}
      <CategorySection
        title="Explore Popular Categories"
        subTitle="DISCOVER LOCAL SERVICES"
        data={homeData}
        see_all_navigate="/all_categories"
      />

      {/* 3. TRENDING SEARCHES */}
      <div className="px-[18px] sm:px-8 lg:px-[70px] py-4 bg-background">
        <TrendingSearches />
      </div>

      {/* 4. BUSINESSES NEAR YOU / RECOMMENDED */}
      {recommendedListings.length > 0 && (
        <ListingSection
          title="Businesses Near You"
          subTitle="LOCAL SPOTLIGHT"
          listings={recommendedListings}
          see_all_navigate="/listings/recommended"
          bgColor="transparent"
          CardComponent={SpotlightListingCard}
        />
      )}

      {/* 5. EXPLORE BUSINESSES BY LOCATION (REGIONAL HUBS) */}
      <Hyperlocal />

      {/* 6. WHY DISCOVER WITH NEEDMET */}
      <WhyDiscoverNeedMet />

      {/* 7. NEWLY ADDED LISTINGS */}
      {newListings.length > 0 && (
        <ListingSection
          title="Newly Added"
          subTitle="FRESH ON NEEDMET"
          listings={newListings}
          see_all_navigate="/listings/newly_added"
          bgColor="var(--background-secondary)"
          CardComponent={SpotlightListingCard}
        />
      )}

      {/* 8. FIRST PROMO BANNER */}
      {homeData?.banners?.[0] && (
        <Banner
          imageUrl={homeData.banners[0].imageUrl}
          webUrl={homeData.banners[0].webUrl}
          route={homeData.banners[0].route}
        />
      )}

      {/* 9. CATEGORY LISTINGS & BANNERS */}
      {categoryList.map((category, index) => {
        const listings = categoryQueries[index]?.data ?? [];

        if (!listings || listings.length === 0) return null;

        const bannerIndex = (index + 1) % (homeData?.banners?.length || 1);

        return (
          <Fragment key={category}>
            <ListingSection
              title={category}
              subTitle="SPECIALLY FOR YOU"
              listings={listings}
              see_all_navigate={`/listings/category/${generateSlug(category)}`}
              bgColor="transparent"
              CardComponent={SpotlightListingCard}
            />

            {homeData?.banners?.[bannerIndex] && (
              <Banner
                imageUrl={homeData.banners[bannerIndex].imageUrl}
                webUrl={homeData.banners[bannerIndex].webUrl}
                route={homeData.banners[bannerIndex].route}
              />
            )}
          </Fragment>
        );
      })}

      {/* 10. TESTIMONIALS */}
      <TestimonialSection />

      {/* 11. LIST YOUR BUSINESS CTA */}
      <BusinessCTA bgColor="var(--primary-surface)" />
    </div>
  );
}

export default Home;