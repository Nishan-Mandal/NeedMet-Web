import { useParams } from "react-router-dom";
import { getPageById } from "../services/firebase/firestore/pageService";
import { useQuery } from "@tanstack/react-query";
import { BusinessCTA, SystemState, SEO, Loader } from "../components";
import ErrorImg from '../assets/error.png';
import AboutPage from "./About/AboutPage.jsx";

/* ──────────────────────────────────────────────────────────────
   Sanitize Document Content
   1. Strips rogue <style>...</style> blocks so embedded CSS
      never leaks into the global DOM (breaking Header/Footer/links).
   2. Extracts the inner content from <body> or strips <html> wrappers.
   3. Strips internal duplicate <header>...</header> with <h1>.
─────────────────────────────────────────────────────────────── */
function sanitizeDocumentContent(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return '';

  let sanitized = htmlString;

  // 1. Remove rogue <style> tags so embedded CSS never leaks into the global DOM
  sanitized = sanitized.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  // 2. Extract content inside <body> if a full HTML document was saved
  const bodyMatch = sanitized.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    sanitized = bodyMatch[1];
  } else {
    // Strip <!doctype>, <html>, <head>...</head>, </html>
    sanitized = sanitized
      .replace(/<!doctype[^>]*>/gi, '')
      .replace(/<html\b[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body\b[^>]*>/gi, '')
      .replace(/<\/body>/gi, '');
  }

  // 3. Remove duplicate internal <header>...</header> with <h1> to avoid double title
  sanitized = sanitized.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');

  return sanitized.trim();
}

function LegalPage() {
  const { legalDocument } = useParams();

  // If viewing About Us, render the dedicated, rich AboutPage
  if (legalDocument === 'about_us') {
    return <AboutPage />;
  }

  const { data: page, isLoading: loading } = useQuery({
    queryKey: ['docs', legalDocument],
    queryFn: () => getPageById(legalDocument),
    enabled: !!legalDocument,
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#f8faf9]">
        <Loader text="Loading document..." />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-[#f8faf9]">
        <SystemState
          imageSrc={ErrorImg}
          title="OOPS! Something Went"
          highlight="Wrong"
          message="We couldn't load the content right now. Please check your connection and try again later."
          actionType="refresh"
          actionLabel="Try Again"
        />
      </div>
    );
  }

  const cleanContent = sanitizeDocumentContent(page?.content);

  return (
    <>
      <SEO 
        title={`${page.title} | NeedMet`}
        description={`Read our official ${page.title} document. Understand our community guidelines, listing policies, and terms of service.`}
      />

      <div className="min-h-screen bg-[#f8faf9] py-8 sm:py-12 px-4 sm:px-6 font-primary">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Card */}
          <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-surface text-primary text-xs font-bold mb-3">
              <i className="fa-solid fa-file-shield text-xs"></i>
              Official Policy
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-text m-0">
              {page.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-2 m-0">
              NeedMet Community & Platform Standards
            </p>
          </div>

          {/* Document Content Card */}
          <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div
              className="legal-doc-prose"
              dangerouslySetInnerHTML={{
                __html: cleanContent,
              }}
            />
          </div>

        </div>
      </div>

      <BusinessCTA />
    </>
  );
}

export default LegalPage;