import ListingCard from "../ListingCard.jsx";
import NewListingCard from "../NewListingCard.jsx";
import { Link, useLocation } from "react-router-dom";
import NoDataImg from "../../assets/no_data.png";
import SystemState, { InlineNoListingsFound } from "../SystemState.jsx";
import SpotlightListingCard from "../SpotlightListingCard.jsx";

function HeaderWithSeeAll({ title, subTitle = "", see_all_navigate }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 max-[576px]:mb-3">
      <div className="flex flex-col">
        {subTitle && (
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-text-accent mb-3 max-[1024px]:mb-2.5 max-[768px]:mb-2 max-[576px]:mb-1.5 block">
            {subTitle}
          </span>
        )}
        <h2 className="font-heading font-bold text-text-accent tracking-[-0.02em] leading-[1.15] text-[clamp(1.5rem,3vw,2.2rem)] max-[1024px]:text-[1.3rem] max-[768px]:text-[1.2rem] max-[576px]:text-[1.1rem] m-0">
          {title}
        </h2>
      </div>
      <Link
        to={see_all_navigate}
        state={{ title }}
        className="font-primary text-base max-[576px]:text-[0.85rem] text-primary-light hover:text-primary hover:underline cursor-pointer font-medium whitespace-nowrap no-underline shrink-0"
      >
        See All
      </Link>
    </div>
  );
}

function HeaderWithOutSeeAll({ title, subTitle }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 max-[576px]:mb-3 pb-4">
      <div className="flex flex-col">
        {subTitle && (
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-text-accent mb-3 max-[1024px]:mb-2.5 max-[768px]:mb-2 max-[576px]:mb-1.5 block">
            {subTitle}
          </span>
        )}
        <h2 className="font-heading font-bold text-text-accent tracking-[-0.02em] leading-[1.15] text-[clamp(1.5rem,3vw,2.2rem)] max-[1024px]:text-[1.3rem] max-[768px]:text-[1.2rem] max-[576px]:text-[1.1rem] m-0">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function ListingSection({
  title,
  subTitle = "",
  listings = [],
  showSeeAll = true,
  see_all_navigate,
  bgColor,
  CardComponent = SpotlightListingCard,
}) {
  const location = useLocation();
  const isListingPage = location.pathname.includes('/listings');

  return (
    <section
      className="py-[50px] px-[70px] max-[1024px]:py-[35px] max-[1024px]:px-8 max-[576px]:py-[30px] max-[576px]:px-[18px] font-primary bg-white"
      style={{ backgroundColor: bgColor || 'white' }}
    >
      {/* Header */}
      {showSeeAll && see_all_navigate && listings.length !== 0 ? (
        <HeaderWithSeeAll
          title={title}
          subTitle={subTitle}
          see_all_navigate={see_all_navigate}
        />
      ) : (
        <HeaderWithOutSeeAll title={title} subTitle={subTitle} />
      )}

      {/* Cards Grid */}
      {listings.length === 0 ? (
        isListingPage ? (
          <SystemState
            imageSrc={NoDataImg}
            title="No Listings"
            highlight="Found"
            message="Be the first to contribute by adding a store or service related to this category!"
            actionType="redirect"
            actionLabel="+ Contribute Now"
            actionTo="https://play.google.com/store/apps/details?id=com.findon.app"
          />
        ) : (
          <InlineNoListingsFound />
        )
      ) : (
        <div
          className={
            CardComponent === SpotlightListingCard
              ? "grid grid-cols-2 min-[480px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 w-full"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full"
          }
        >
          {listings.map((listing) => (
            <CardComponent key={listing.listingId} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}
