"use client";

import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FloatingChatbot from "@/components/FloatingEditor";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import EnhancedItinerary, { Itinerary as ItineraryType } from "@/components/GeneratedItinerary";
import { supabase } from "@/api/client";

const ItineraryDetails: React.FC = () => {
  const [location, navigate] = useLocation();
  const [showEditor, setShowEditor] = useState(false);

  const planIdFromUrl = location.split("/")[2];
  const planId = `plan-${planIdFromUrl}`;
  
  const [itineraryContent, setItineraryContent] = useState<ItineraryType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planIdFromUrl) {
      setError("No plan ID provided in URL.");
      setLoading(false);
      return;
    }

    const fetchItinerary = async () => {
      try {
        // FIRST: Try to get from localStorage (chatbot generated plans)
        const historyKey = `chatHistory-${planId}`;
        const storedHistory = localStorage.getItem(historyKey);

        if (storedHistory) {
          console.log("Found itinerary in localStorage");
          const parsedHistory = JSON.parse(storedHistory);
          const lastEntry = parsedHistory.length > 0 ? parsedHistory[parsedHistory.length - 1] : null;

          if (lastEntry?.geminiResponse?.detailedPlan) {
            const detailedPlan = lastEntry.geminiResponse.detailedPlan;
            
            const itinerary: ItineraryType = {
              destination: detailedPlan.destination,
              thumbnail: detailedPlan.thumbnail,
              days: (detailedPlan.dailyPlan || []).map((day: any) => ({
                dayNumber: day.day,
                title: day.title,
                description: day.description,
                morning: { activity: day.activities?.[0] || "", description: day.activitiesDescription?.[0] },
                afternoon: { activity: day.activities?.[1] || "", description: day.activitiesDescription?.[1] },
                evening: { activity: day.activities?.[2] || "", description: day.activitiesDescription?.[2] },
                travelTips: day.travelTips || [],
                meals: day.meals || {},
                notes: day.notes || "",
                image: day.image || "",
                weather: day.weather || "",
                transport: day.transport || "",
              })),
            };

            setItineraryContent(itinerary);
            setLoading(false);
            return;
          }
        }

        // SECOND: If not in localStorage, try database
        console.log("Not found in localStorage, checking database...");
        const { data: latestChat, error: fetchError } = await supabase
          .from("chat_history")
          .select("*")
          .eq("chat_id", `chat-${planIdFromUrl}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (fetchError || !latestChat) {
          setError("Failed to fetch itinerary. Please try generating a new plan.");
          setLoading(false);
          return;
        }

        let messages: any[] = [];
        if (typeof latestChat.messages === "string") messages = JSON.parse(latestChat.messages);
        else messages = latestChat.messages;

        const lastTripPlan = messages
          .filter((m) => m.type === "tripPlan" && m.detailedPlan)
          .slice(-1)[0];

        if (!lastTripPlan || !lastTripPlan.detailedPlan) {
          setError("No itinerary found for this plan ID.");
          setLoading(false);
          return;
        }

        const detailedPlan = lastTripPlan.detailedPlan;

        const itinerary: ItineraryType = {
          destination: detailedPlan.destination,
          thumbnail: detailedPlan.thumbnail,
          days: (detailedPlan.dailyPlan || []).map((day: any) => ({
            dayNumber: day.day,
            title: day.title,
            description: day.description,
            morning: { activity: day.activities?.[0] || "", description: day.activitiesDescription?.[0] },
            afternoon: { activity: day.activities?.[1] || "", description: day.activitiesDescription?.[1] },
            evening: { activity: day.activities?.[2] || "", description: day.activitiesDescription?.[2] },
            travelTips: day.travelTips || [],
            meals: day.meals || {},
            notes: day.notes || "",
            image: day.image || "",
            weather: day.weather || "",
            transport: day.transport || "",
          })),
        };

        setItineraryContent(itinerary);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError("Failed to load itinerary. Please try again.");
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [planIdFromUrl, planId]);

  const handleBack = () => navigate("/my-trips");

  // Export function
  const handleExport = () => {
    if (!itineraryContent) return;

    const formatItineraryForExport = (itinerary: ItineraryType) => {
      let content = `Travel Itinerary: ${itinerary.destination}\n\n`;

      itinerary.days?.forEach((day) => {
        content += `Day ${day.dayNumber}: ${day.title}\n`;
        if (day.morning.activity) content += `  Morning: ${day.morning.activity}\n`;
        if (day.afternoon.activity) content += `  Afternoon: ${day.afternoon.activity}\n`;
        if (day.evening.activity) content += `  Evening: ${day.evening.activity}\n`;
        if (day.notes) content += `  Notes: ${day.notes}\n`;
        content += "\n";
      });

      return content;
    };

    const blob = new Blob([formatItineraryForExport(itineraryContent)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${itineraryContent.destination.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_itinerary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share function
  const handleShare = async () => {
    if (!itineraryContent) return;

    const shareData = {
      title: `Travel Itinerary: ${itineraryContent.destination}`,
      text: `Check out my travel itinerary for ${itineraryContent.destination}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopyToClipboard();
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleCopyToClipboard = () => {
    if (!itineraryContent) return;
    const shareText = `Check out my travel itinerary for ${itineraryContent.destination}: ${window.location.href}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareText).then(() => alert("Link copied to clipboard!"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      } catch {
        alert("Unable to copy link, please copy manually.");
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your itinerary...</p>
      </div>
    );

  if (error || !itineraryContent)
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error || "There was an error loading this itinerary."}</p>
        </div>
        <Button onClick={handleBack} className="bg-primary hover:bg-primary/90">
          Back to My Trips
        </Button>
      </div>
    );

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft size={16} className="mr-1" /> Back
            </Button>
            <h1 className="text-xl font-bold hidden md:block">{itineraryContent.destination}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={16} className="mr-1" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 size={16} className="mr-1" /> Share
            </Button>
          </div>
        </div>
      </div>

      <EnhancedItinerary itinerary={itineraryContent} />
      <FloatingChatbot show={showEditor} onClose={() => setShowEditor(false)} />
    </div>
  );
};

export default ItineraryDetails;