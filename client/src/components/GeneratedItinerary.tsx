import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  Share2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";

const YOUR_PEXELS_API_KEY =
  "P2dLrk5TWTRGCbNvBizKynGkuHNP68q4a4gC6PXuIEmGtlxzHSivyUPw";

/** TYPES */
type Activity = { activity: string; description?: string };
export type Meals = { breakfast?: string; lunch?: string; dinner?: string };
export type Day = {
  dayNumber: number;
  title: string;
  description?: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  travelTips?: string[];
  meals?: Meals;
  notes?: string;
  image?: string;
  weather?: string;
  transport?: string;
};
export type Itinerary = { days: Day[]; destination: string; thumbnail: string };

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,255,240,0.15)" }}
    transition={{ type: "spring", stiffness: 120 }}
    className={`p-6 rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl
      bg-gradient-to-br from-[#0b0c0e]/80 via-[#15181b]/80 to-[#0a0a0a]/80 border border-white/10 
      hover:border-[#00ffe0]/30 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;

const EnhancedItinerary: React.FC = () => {
  const [location] = useLocation();
  const [rawPath] = location.split("?");
  const planIdFromUrl = (rawPath || "").split("/")[2] || "";
  const planId = planIdFromUrl ? `plan-${planIdFromUrl}` : "";

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [dayData, setDayData] = useState<Day[]>([]);
  const [error, setError] = useState<string>("");
  const [geminiResponse, setGeminiResponse] = useState<any>(null);
  const [backgroundPhotos, setBackgroundPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(u);
      setIsSpeaking(true);
    }
  };

  /** Load itinerary */
  useEffect(() => {
    if (!planId) {
      setError("Plan ID is missing from URL");
      return;
    }
    const historyKey = `chatHistory-${planId}`;
    const storedHistory = localStorage.getItem(historyKey);
    if (!storedHistory) {
      setError("No itinerary found in storage for this plan id.");
      return;
    }

    try {
      const parsedHistory = JSON.parse(storedHistory);
      const lastEntry =
        parsedHistory.length > 0 ? parsedHistory[parsedHistory.length - 1] : null;
      if (lastEntry?.geminiResponse?.detailedPlan) {
        setGeminiResponse(lastEntry.geminiResponse);
        const geminiData = lastEntry.geminiResponse;

        const days: Day[] = geminiData.detailedPlan.dailyPlan.map((day: any) => ({
          dayNumber: day.day,
          title: day.title,
          description: day.description || "",
          morning: {
            activity: day.activities?.[0] || "No morning activity listed.",
            description: day.activitiesDescription?.[0] || "",
          },
          afternoon: {
            activity: day.activities?.[1] || "No afternoon activity listed.",
            description: day.activitiesDescription?.[1] || "",
          },
          evening: {
            activity: day.activities?.[2] || "No evening activity listed.",
            description: day.activitiesDescription?.[2] || "",
          },
          travelTips: day.travelTips || [],
          meals: day.meals || {},
          notes: day.notes || "",
          image: day.image || "",
          weather: day.weather || "",
          transport: day.transport || "",
        }));

        setItinerary({
          days,
          destination: geminiData.detailedPlan.destination,
          thumbnail: geminiData.detailedPlan.thumbnail,
        });
        setDayData(days);
        setError("");
      } else setError("Itinerary data format is incorrect or missing detailedPlan.");
    } catch (err) {
      setError("Failed to parse stored itinerary data.");
      console.error("Parse error:", err);
    }
  }, [planId]);

  /** Pexels: per-day images */
  useEffect(() => {
    const enhance = async () => {
      if (!itinerary?.days) return;
      let photos: string[] = [];
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            itinerary.thumbnail || itinerary.destination
          )}&per_page=15`,
          { headers: { Authorization: YOUR_PEXELS_API_KEY } }
        );
        if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
        const data = await response.json();
        photos = data?.photos
          ?.map((p: any) => p.src?.landscape || p.src?.medium)
          .filter(Boolean);
      } catch (e) {
        console.error("Pexels error:", e);
      }
      setDayData(
        itinerary.days.map((d, i) => ({
          ...d,
          image:
            photos[i] ||
            d.image ||
            "https://via.placeholder.com/1200x800?text=No+Image",
        }))
      );
    };
    enhance();
  }, [itinerary]);

  /** Notes */
  useEffect(() => {
    if (!itinerary) {
      setNotes("");
      return;
    }
    const saved = localStorage.getItem(
      `notes-${itinerary.destination}-${currentDay}`
    );
    if (saved !== null) setNotes(saved);
    else if (dayData[currentDay]?.notes)
      setNotes(dayData[currentDay].notes || "");
    else setNotes("");
  }, [currentDay, itinerary, dayData]);

  const handleNoteChange = (val: string) => {
    if (!itinerary) return;
    setNotes(val);
    localStorage.setItem(`notes-${itinerary.destination}-${currentDay}`, val);
  };

  const current = dayData[currentDay];
  if (!current)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        {error || "Loading itinerary..."}
      </div>
    );

  return (
    <div className="relative min-h-screen font-sans text-white bg-gradient-to-br from-[#050505] via-[#0a0f14] to-[#0b1c25] overflow-hidden">
      {/* Soft ambient gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,240,0.07),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,215,0,0.05),transparent_60%)]"></div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 max-w-8xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Hero */}
        <motion.div
          variants={itemVariants}
          className="w-full relative rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,255,240,0.05)]"
        >
          <motion.img
            src={current.image}
            alt={`Visual for day ${current.dayNumber}`}
            className="w-full h-[600px] object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
              <div className="flex flex-col text-left">
                <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-[#00ffe0] via-[#00d4ff] to-[#7afcff] text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]">
                  {itinerary?.destination}
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold mt-2 text-gray-100">
                  Day {current.dayNumber}: {current.title}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-8 w-full mt-8">
          <Card className="col-span-4 lg:col-span-2">
            <CardContent className="space-y-4 text-gray-100">
              <h3 className="text-2xl font-bold text-[#00ffe0]">Daily Plan</h3>
              {["morning", "afternoon", "evening"].map((time) => {
                const activity = current[time as keyof Day] as Activity;
                return (
                  <div key={time}>
                    <h4 className="font-semibold text-lg capitalize text-[#ffd166]">
                      {time}
                    </h4>
                    <p>{activity?.activity || ""}</p>
                    {activity?.description && (
                      <p className="text-sm text-gray-400">
                        {activity.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {geminiResponse?.detailedPlan?.flights && (
            <Card className="col-span-4 sm:col-span-2 lg:col-span-1">
              <CardContent className="space-y-2 text-gray-100">
                <h3 className="text-2xl font-bold text-[#00ffe0]">
                  Flight Details
                </h3>
                <p>
                  <strong>Route:</strong>{" "}
                  {geminiResponse.detailedPlan.flights.departure}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {geminiResponse.detailedPlan.flights.price}
                </p>
                <p>
                  <strong>Airline:</strong>{" "}
                  {geminiResponse.detailedPlan.flights.airline}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {geminiResponse.detailedPlan.flights.duration}
                </p>
              </CardContent>
            </Card>
          )}

          {current.meals && (
            <Card className="col-span-4 sm:col-span-2 lg:col-span-1">
              <CardContent className="space-y-4 text-gray-100">
                <h3 className="text-2xl font-bold text-[#00ffe0]">
                  Meals & Transport
                </h3>
                {current.meals.breakfast && (
                  <p>
                    <strong>Breakfast:</strong> {current.meals.breakfast}
                  </p>
                )}
                {current.meals.lunch && (
                  <p>
                    <strong>Lunch:</strong> {current.meals.lunch}
                  </p>
                )}
                {current.meals.dinner && (
                  <p>
                    <strong>Dinner:</strong> {current.meals.dinner}
                  </p>
                )}
                {current.transport && (
                  <p className="text-sm text-gray-400">
                    🚗 {current.transport}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {current.travelTips && current.travelTips.length > 0 && (
            <Card className="col-span-4 sm:col-span-2 lg:col-span-2">
              <CardContent className="space-y-4 text-gray-100">
                <h3 className="text-2xl font-bold text-[#00ffe0]">
                  Travel Tips
                </h3>
                <ul className="list-disc pl-5 text-sm text-gray-400">
                  {current.travelTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="col-span-4">
            <CardContent className="space-y-4 text-gray-100">
              <h3 className="text-2xl font-bold text-[#00ffe0]">Your Notes</h3>
              <textarea
                className="w-full border p-4 rounded-xl text-sm bg-white/5 text-gray-100 placeholder-gray-400 border-white/10 focus:border-[#00ffe0] focus:ring-1 focus:ring-[#00ffe0]"
                value={notes}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Write your thoughts..."
                rows={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* NAV + TTS */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between gap-4 w-full max-w-2xl mt-8"
        >
          <Button
            onClick={() => setCurrentDay((prev) => Math.max(0, prev - 1))}
            disabled={currentDay === 0}
            className="hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button
            onClick={() =>
              speak(current.title + ". " + (current.description || ""))
            }
            className={`transition-all ${
              isSpeaking
                ? "bg-[#00ffe0] text-black shadow-[0_0_25px_rgba(0,255,255,0.5)]"
                : "hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" /> Stop
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" /> Listen
              </>
            )}
          </Button>
          <Button
            onClick={() =>
              setCurrentDay((prev) => Math.min(dayData.length - 1, prev + 1))
            }
            disabled={currentDay === dayData.length - 1}
            className="hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        <motion.a
          variants={itemVariants}
          href={`https://twitter.com/intent/tweet?text=Check out my travel itinerary for ${encodeURIComponent(
            itinerary?.destination ?? ""
          )}!`}
          target="_blank"
          className="mt-8 text-[#00ffe0] underline flex items-center hover:text-[#7afcff] transition-all"
          rel="noopener noreferrer"
        >
          <Share2 className="inline w-5 h-5 mr-2" /> Share Your Journey
        </motion.a>
      </motion.div>
    </div>
  );
};

export default EnhancedItinerary;
