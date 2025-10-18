import React, { useState, useEffect } from "react";

interface LocationErrorBannerProps {
  message: string;
  onEnable?: () => void; // Optional callback if parent wants to handle location logic
}

export default function LocationErrorBanner({ message, onEnable }: LocationErrorBannerProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
  }, [message]);

  const handleEnableLocation = () => {
    if (onEnable) {
      onEnable(); // let parent handle location fetch
    } else {
      // Default behavior: Try to request location
      navigator.geolocation.getCurrentPosition(
        () => {
          // Success: just hide the banner
          setVisible(false);
        },
        (err) => {
          alert("Permission denied or unavailable: " + err.message);
        }
      );
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 text-sm animate-fade-in flex items-center justify-between gap-4 min-w-[280px] max-w-[90vw]">
      <span className="flex-1">{message}</span>

      {/* <button
        onClick={handleEnableLocation}
        className="bg-white text-red-600 px-3 py-1 text-xs rounded hover:bg-gray-100"
      >
        Enable
      </button> */}

      <button
        onClick={() => setVisible(false)}
        className="text-white text-lg font-bold hover:text-gray-200 px-2"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}
