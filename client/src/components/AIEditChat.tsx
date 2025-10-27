import { useState, useRef, useEffect } from "react";
import { Edit2, Send, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// This component can be added to your existing EnhancedItinerary page
const AIEditChat = ({ 
  itinerary, 
  currentDayData, 
  onPlanUpdate,
  planId 
}: {
  itinerary: any;
  currentDayData: any;
  onPlanUpdate: (updatedPlan: any) => void;
  planId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I can help you modify your itinerary. Just tell me what changes you'd like to make! For example:\n\n• 'Remove the Eiffel Tower visit'\n• 'I don't want activities that require tickets'\n• 'Make the morning activity more relaxing'\n• 'Add more food experiences'"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const callGeminiForEdit = async (userRequest: string) => {
    try {
      const prompt = `You are an AI travel planner assistant. A user wants to modify their existing itinerary.

CURRENT ITINERARY DETAILS:
Destination: ${itinerary.destination}
Current Day: Day ${currentDayData.dayNumber} - ${currentDayData.title}

Morning Activity: ${currentDayData.morning.activity}
Description: ${currentDayData.morning.description}

Afternoon Activity: ${currentDayData.afternoon.activity}
Description: ${currentDayData.afternoon.description}

Evening Activity: ${currentDayData.evening.activity}
Description: ${currentDayData.evening.description}

Meals:
- Breakfast: ${currentDayData.meals?.breakfast || "Not specified"}
- Lunch: ${currentDayData.meals?.lunch || "Not specified"}
- Dinner: ${currentDayData.meals?.dinner || "Not specified"}

Travel Tips: ${currentDayData.travelTips?.join(", ") || "None"}

USER'S MODIFICATION REQUEST:
"${userRequest}"

Based on the user's request, generate an UPDATED version of this day's itinerary. Return ONLY valid JSON (no markdown):

{
  "message": "A friendly message explaining what changes you made (2-3 sentences)",
  "updatedDay": {
    "dayNumber": ${currentDayData.dayNumber},
    "title": "Updated day title if needed, or keep original",
    "description": "Brief description",
    "activities": ["Morning activity", "Afternoon activity", "Evening activity"],
    "activitiesDescription": ["Morning description", "Afternoon description", "Evening description"],
    "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
    "meals": {
      "breakfast": "Breakfast suggestion",
      "lunch": "Lunch suggestion",
      "dinner": "Dinner suggestion"
    },
    "notes": "Any important notes",
    "weather": "${currentDayData.weather}",
    "transport": "Transport details"
  }
}

IMPORTANT: Make meaningful changes based on the user's request. If they want to remove something, replace it with a suitable alternative. If they want to avoid certain types of activities, ensure the new activities match their preference.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error("No response from AI");
      }

      let cleanText = textResponse.trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/```\s*$/g, "");

      const parsed = JSON.parse(cleanText);

      if (parsed?.message && parsed?.updatedDay) {
        return parsed;
      }

      throw new Error("Invalid response format");

    } catch (error) {
      console.error("Gemini Error:", error);
      return { 
        error: error.message || "Failed to process your request",
        message: "Sorry, I couldn't process that request. Please try rephrasing it."
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Call AI to get modifications
      const result = await callGeminiForEdit(userMessage);

      if (result.error) {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: result.message 
        }]);
      } else {
        // Add AI response
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: result.message + "\n\n✅ I've updated your itinerary. The changes will be saved automatically!"
        }]);

        // Update the plan
        onPlanUpdate(result.updatedDay);

        // Save to localStorage
        const historyKey = `chatHistory-${planId}`;
        const storedHistory = localStorage.getItem(historyKey);
        
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          const lastEntry = parsedHistory[parsedHistory.length - 1];
          
          // Find and update the specific day
          const dayIndex = lastEntry.geminiResponse.detailedPlan.dailyPlan.findIndex(
            (d: any) => d.day === result.updatedDay.dayNumber
          );
          
          if (dayIndex !== -1) {
            lastEntry.geminiResponse.detailedPlan.dailyPlan[dayIndex] = result.updatedDay;
            localStorage.setItem(historyKey, JSON.stringify(parsedHistory));
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Edit Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#00ffe0] to-[#00d4ff] text-black p-4 rounded-full shadow-[0_0_30px_rgba(0,255,240,0.5)] hover:shadow-[0_0_40px_rgba(0,255,240,0.7)] transition-all duration-300 z-50 flex items-center gap-2 font-semibold"
        >
          <Sparkles className="w-6 h-6" />
          <span className="hidden sm:inline">Edit with AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-gradient-to-br from-[#0b0c0e] via-[#15181b] to-[#0a0a0a] border-l border-[#00ffe0]/20 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#00ffe0]/20 bg-gradient-to-r from-[#00ffe0]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00ffe0] to-[#00d4ff] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#00ffe0]">AI Editor</h3>
                <p className="text-xs text-gray-400">Modify your itinerary</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#00ffe0] to-[#00d4ff] text-black"
                      : "bg-white/5 text-gray-100 border border-white/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-gray-100 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00ffe0]" />
                  <span className="text-sm">AI is updating your plan...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#00ffe0]/20 bg-black/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tell me what to change..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00ffe0] focus:ring-1 focus:ring-[#00ffe0] transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-[#00ffe0] to-[#00d4ff] text-black p-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,240,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Quick suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Remove ticket activities",
                "Make it more relaxing",
                "Add food experiences",
                "Change morning activity"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIEditChat;
