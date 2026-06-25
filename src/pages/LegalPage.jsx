import { useParams } from "react-router-dom";
import { getPageById } from "../services/firebase/firestore/pageService";
import { useQuery } from "@tanstack/react-query";
import { BusinessCTA, SystemState } from "../components";
import ErrorImg from '../assets/error.png'

function LegalPage() {
  const { legalDocument } = useParams();

  const { data: page, isLoading: loading } = useQuery({
    queryKey: ['page', legalDocument],
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
      <div className="legal-page-body" style={{minHeight: '100vh'}}>
        <p style={{
            textAlign: 'center', 
            fontSize: '1.7rem', 
            marginTop: '1rem', 
            fontWeight: 'bold'
          }}
        >
          {page.title}
        </p>
        <div
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