import { useState } from "react";
import styles from "../../style/Common/CurrentLocationPicker.module.css";
import { Loader, Button } from "../../components";
import { useToast } from "../../contexts/toastContext";

export default function CurrentLocationPicker({ onLocationSelect }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const getCurrentLocation = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      showToast("Geolocation is not supported.", "error");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );

          const data = await response.json();

          console.log("Geocode response:", data);

          if (data.status !== "OK" || !data.results?.length) {
            throw new Error(
              data.error_message || `Geocoding failed: ${data.status}`
            );
          }

          const result = data.results[0];

          onLocationSelect({
            address: result.formatted_address,
            latitude,
            longitude,
          });

          showToast("Current location selected successfully.", "regular");
        } catch (err) {
          console.error("Location fetch error:", err);
          showToast(err.message || "Unable to fetch address.", "error");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === 1) {
          showToast("Location permission denied.", "error");
        } else if (err.code === 2) {
          showToast("Location unavailable.", "error");
        } else if (err.code === 3) {
          showToast("Location request timed out.", "error");
        } else {
          showToast("Failed to get current location.", "error");
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={styles.wrapper}>
      <Button
        type="button"
        variant="ghost"
        onClick={getCurrentLocation}
        style={{ fontSize: "24px" }}
        disabled={loading}
        icon={
          loading ? (
            <Loader variant="button" />
          ) : (
            <i className="fa-solid fa-location-crosshairs" style={{ color: "var(--text-accent)" }}></i>
          )
        }
      />
    </div>
  );
}