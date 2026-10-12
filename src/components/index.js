// ── Layout ──
export { Header, Footer, ScrollToTop } from './Layout';

// ── Shared Sections ──
export {
  BusinessCTA,
  ListingSection,
  CategorySection,
  Hyperlocal,
  TrendingSearches,
} from './Sections';

// ── Core Domain / Shared Widgets ──
export { default as ListingCard } from './ListingCard.jsx';
export { default as NewListingCard } from './NewListingCard.jsx';
export { default as SpotlightListingCard } from './SpotlightListingCard.jsx';
export { default as SearchAutocomplete } from './SearchAutocomplete.jsx';
export { default as SystemState, InlineNoListingsFound } from './SystemState.jsx';
export { default as SEO } from './SEO.jsx';
export { default as Banner } from './Banner.jsx';
export { default as SectionCard } from './SectionCard.jsx';
export { default as KeyValueFields } from './KeyValueFields.jsx';
export { default as ImageSlider } from './ImageSlider.jsx';

// ── Common UI Primitives ──
export { default as Button } from './Common/Button.jsx';
export { default as Loader, Skeleton } from './Common/Loader.jsx';
export { default as Toast, ToastContainer } from './Common/Toast.jsx';
export { default as TextInput } from './Common/TextInput.jsx';
export { default as TextArea } from './Common/TextArea.jsx';
export { default as ToggleSwitch } from './Common/ToggleSwitch.jsx';
export { default as SelectInput } from './Common/SelectInput.jsx';
export { default as ImageUploader } from './Common/ImageUploader.jsx';
export { default as TagInput } from './Common/TagInput.jsx';
export { default as CurrentLocationPicker } from './Common/CurrentLocationPicker.jsx';
export { default as SearchableSelect } from './Common/SearchableSelect.jsx';
export { default as OpenHours, defaultHours } from './Common/OpenHours.jsx';

// ── Loaders ──
export { default as HomeLoader } from './Loader/HomeLoader.jsx';
export { default as ListingSectionLoader } from './Loader/ListingSectionLoader.jsx';
export { default as AllCategoryLoader } from './Loader/AllCategoryLoader.jsx';
export { default as ListingDetailsLoader } from './Loader/ListingDetailsLoader.jsx';
export { default as SearchPageLoader } from './Loader/SearchPageLoader.jsx';

// ── Testimonials & QR ──
export { default as TestimonialCard } from './Testimonial/TestimonialCard.jsx';
export { default as PosterTemplate } from './QR/PosterTemplate.jsx';
export { default as QrPosterModal } from './QR/QrPosterModal.jsx';

// ── Page Sections (Backward Compatibility Re-exports) ──
export { Hero, TestimonialSection } from '../pages/Home/Sections';
export {
  HeroGallery,
  ActionBar,
  BusinessInfoCard,
  OpeningHoursCard,
  DetailInfoCard,
  RatingsV2,
} from '../pages/ListingDetails/Sections';