import { useParams } from "react-router-dom";
import { getPageById } from "../services/firebase/firestore/pageService";
import { useQuery } from "@tanstack/react-query";
import { BusinessCTA, SystemState, SEO } from "../components";
import ErrorImg from '../assets/error.png'

function LegalPage() {
  const { legalDocument } = useParams();

  const { data: page, isLoading: loading } = useQuery({
    queryKey: ['docs', legalDocument],
    queryFn: () => getPageById(legalDocument),
    enabled: !!legalDocument,
  });

  if (loading) return <p style={{minHeight: '100vh', textAlign: 'center', height: '5rem', marginTop: '2rem'}}>Loading...</p>;
  if (!page) 
    return (
      <div className="legal-page-body" style={{minHeight: '100vh'}}>
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

  return (
    <>
      {page && (
        <SEO 
          title={`${page.title} | NeedMet`}
          description={`Read our official ${page.title} document. Understand our community guidelines, listing policies, and terms of service.`}
        />
      )}
      <div className="legal-page-body min-h-screen max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-center text-[1.7rem] mt-4 font-heading font-bold text-text-accent">
          {page.title}
        </h1>
        <div
          className="prose max-w-none mt-6 text-slate-700 dark:text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: page?.content || "",
          }}
        />
      </div>

      <BusinessCTA />
    </>
  );
}

export default LegalPage;