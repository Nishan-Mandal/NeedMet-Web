import { useState, useEffect } from 'react';
import { getListingById } from '../services/firebase/firestore/listingService.js';

export const useListingById = (listingId, enabled) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

    const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getListingById(listingId);
      setListing(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!enabled) return;

    fetchData();
    
  }, [listingId, enabled]);

  return { listing, loading, error };
};