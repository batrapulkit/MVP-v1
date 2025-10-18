import { useEffect, useState } from "react";

type UserLocation = {
  city: string;
  state: string;
  countryCode: string;
  currency: string;
};

export default function useUserLocation() {
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || "";
        const state = address.state || "";
        const countryCode = address.country_code?.toUpperCase() || "";

        if (!countryCode) {
          setLocationError("Unable to determine your country.");
          return;
        }

        const countryRes = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        const countryData = await countryRes.json();
        const currencyObj = countryData[0]?.currencies;
        const currencyCode = currencyObj ? Object.keys(currencyObj)[0] : "";

        const locationData: UserLocation = {
          city,
          state,
          countryCode,
          currency: currencyCode,
        };

        localStorage.setItem("userLocation", JSON.stringify(locationData));
        console.log("Stored user location:", locationData);
      } catch (err) {
        setLocationError("Failed to fetch location details.");
        console.error("Error fetching location or currency", err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationError("Location access denied. Please enable it in browser settings.");
          console.warn("Geolocation permission denied:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Optionally, return the error so consuming components can display it
  return { locationError };
}
