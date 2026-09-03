import { createContext, useContext, useEffect, useState } from "react";

const ListingDraftContext = createContext(null);
const DRAFT_KEY = "add-listing-draft";

export function ListingDraftProvider({ children }) {
  const [draftFormData, setDraftFormDataState] = useState(null);
  // console.log(draftFormData)

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        setDraftFormDataState(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to parse listing draft:", error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  const saveDraftFormData = (data) => {
    if (!data) return;

    // keep full data in context for preview
    setDraftFormDataState(data);

    // remove images before localStorage save
    const { images, addedBy, ...rest } = data;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
  };

  const clearDraftFormData = () => {
    setDraftFormDataState(null);
    localStorage.removeItem(DRAFT_KEY);
  };

  return (
    <ListingDraftContext.Provider
      value={{
        draftFormData,
        setDraftFormData: saveDraftFormData,
        clearDraftFormData,
      }}
    >
      {children}
    </ListingDraftContext.Provider>
  );
}

export function useListingDraft() {
  const context = useContext(ListingDraftContext);
  if (!context) {
    throw new Error("useListingDraft must be used inside ListingDraftProvider");
  }
  return context;
}