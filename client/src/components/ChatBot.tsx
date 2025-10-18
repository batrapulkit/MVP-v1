import { useState, useEffect, useRef } from "react";
import TypingIndicator from "@/components/chatbot/components/TypingIndicator";
import TripPlanMessage from "@/components/chatbot/components/TripPlanMessage";
import { useLocation } from "wouter";
import { saveChat } from "@/api/services";
import { marked } from "marked";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const ChatBot = ({
  isOpen = true,
  onClose,
  onStartPlanning,
  initialInput = "",
}) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! Welcome to Tono Travel Planner! Let's get started. Where would you like to travel?",
      suggestions: [
        "Paris, France",
        "Tokyo, Japan",
        "New York, USA",
        "London, UK",
        "Bali, Indonesia",
        "Rome, Italy"
      ],
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [conversationState, setConversationState] = useState("location");
  const [collectedData, setCollectedData] = useState({
    location: "",
    date: "",
    budget: "",
    travelers: "",
    interest: "",
  });
  const chatRef = useRef(null);
  const chatIdRef = useRef<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (initialInput && initialInput.trim() !== "") {
      handleInputSubmit(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    if (isOpen && !chatIdRef.current) {
      chatIdRef.current = `chat-${Date.now()}`;
      localStorage.setItem("currentChatId", chatIdRef.current);
    }

    if (!isOpen) {
      chatIdRef.current = null;
      localStorage.removeItem("currentChatId");
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.name === "Google US English");
      if (preferredVoice) {
        speech.voice = preferredVoice;
      }
      window.speechSynthesis.speak(speech);
    } else {
      console.log("Text-to-speech not supported in this browser.");
    }
  };

  const callGemini = async (userMessage: string, messages: any[], finalCollectedData?: any) => {
    try {
      const rawLocation = localStorage.getItem("userLocation");
      let locationDetails = {
        city: "",
        state: "",
        countryCode: "",
        currency: ""
      };

      if (rawLocation) {
        try {
          locationDetails = JSON.parse(rawLocation);
        } catch (e) {
          console.warn("Failed to parse location from localStorage");
        }
      }

      const dataToUse = finalCollectedData || collectedData;

      const prompt = `You are an AI travel planner. Based on the collected information, generate a complete trip itinerary.

Collected Trip Details:
- Destination: ${dataToUse.location}
- Travel Dates/Duration: ${dataToUse.date}
- Number of Travelers: ${dataToUse.travelers}
- Budget: ${dataToUse.budget}
- Interests: ${dataToUse.interest}

User's current city: ${locationDetails.city || "unknown"}
Currency: ${locationDetails.currency || "unknown"}

Generate a comprehensive trip plan. Return ONLY valid JSON with no markdown formatting.

{
  "content": "A warm welcome message about the trip (50-80 words)",
  "detailedPlan": {
    "destination": "${dataToUse.location}",
    "description": "Brief engaging description (40-60 words)",
    "thumbnail": "Famous landmark name",
    "duration": "${dataToUse.date}",
    "travelers": ${dataToUse.travelers.match(/\d+/)?.[0] || 1},
    "budget": "${dataToUse.budget}",
    "interest": "${dataToUse.interest}",
    "totalCost": "Estimated total with range",
    "flights": {
      "departure": "${locationDetails.city || 'Major city'}",
      "price": "$XXX-XXX",
      "airline": "Airline name",
      "duration": "X hours"
    },
    "hotel": {
      "name": "Hotel name",
      "location": "Area in destination",
      "price": "$XXX/night",
      "rating": 4.5,
      "amenities": ["WiFi", "Breakfast", "Pool", "Gym"]
    },
    "dailyPlan": [
      {
        "day": 1,
        "title": "Day title",
        "description": "Brief day description",
        "activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4", "Activity 5", "Activity 6"],
        "activitiesDescription": ["Detail 1 (30-40 words)", "Detail 2", "Detail 3", "Detail 4", "Detail 5", "Detail 6"],
        "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
        "meals": {
          "breakfast": "Breakfast suggestion",
          "lunch": "Lunch suggestion",
          "dinner": "Dinner suggestion"
        },
        "notes": "Additional notes",
        "image": "Landmark name",
        "weather": "Weather description",
        "transport": "Transport mode"
      }
    ],
    "weather": {
      "temp": "XX-XX°C",
      "condition": "General condition",
      "recommendation": "What to pack"
    }
  },
  "suggestions": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
}

Generate ${dataToUse.date} days in dailyPlan array. Return pure JSON only.`.trim();

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
              maxOutputTokens: 8192,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log("Gemini Response:", data);

      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error("No text in response");
      }

      let cleanText = textResponse.trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/```\s*$/g, "");

      const parsed = JSON.parse(cleanText);

      if (parsed?.content && parsed?.detailedPlan) {
        return parsed;
      }

      throw new Error("Invalid JSON structure");

    } catch (error) {
      console.error("Gemini Error:", error);
      return { error: error.message || "API call failed" };
    }
  };

  const generateTripPlan = async (finalData) => {
    console.log("🚀 Starting trip generation with:", finalData);
    
    try {
      setLoading(true);

      // Validate all fields
      const required = ['location', 'date', 'budget', 'travelers', 'interest'];
      const missing = required.filter(key => !finalData[key]);
      
      if (missing.length > 0) {
        console.error("❌ Missing fields:", missing);
        throw new Error(`Missing: ${missing.join(', ')}`);
      }

      // Confirmation
      const confirmMsg = { 
        sender: "bot", 
        text: "Perfect! Creating your personalized trip plan... ✈️", 
        suggestions: [], 
        type: "text" 
      };
      setMessages(prev => [...prev, confirmMsg]);
      await new Promise(r => setTimeout(r, 1000));

      // Generating
      const genMsg = { 
        sender: "bot", 
        text: "🔄 Tono is crafting your itinerary...", 
        suggestions: [], 
        type: "text" 
      };
      setMessages(prev => [...prev, genMsg]);
      await new Promise(r => setTimeout(r, 1500));

      // Call API
      const botResponse = await callGemini("", messages, finalData);

      if (botResponse.error) {
        throw new Error(botResponse.error);
      }

      const uniqueId = Date.now().toString();
      const planId = `plan-${uniqueId}`;

      const botMessage = { 
        sender: "bot", 
        id: uniqueId, 
        plan_id: planId, 
        ...botResponse, 
        type: "tripPlan" 
      };

      setMessages(prev => [...prev, botMessage]);

      // Save to localStorage
      const historyKey = `chatHistory-${planId}`;
      localStorage.setItem(historyKey, JSON.stringify([{
        id: uniqueId,
        plan_id: planId,
        timestamp: new Date().toISOString(),
        userPrompt: `${finalData.location} | ${finalData.date} | ${finalData.budget} | ${finalData.travelers} | ${finalData.interest}`,
        geminiResponse: botResponse,
      }]));

      console.log("✅ Saved to:", historyKey);

    } catch (error) {
      console.error("❌ Generation error:", error);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: `⚠️ Error: ${error.message}. Please try again.`, 
        suggestions: [], 
        type: "text" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputSubmit = async (inputValue?: string) => {
    const userText = (inputValue ?? input).trim();
    if (!userText || loading) return;

    console.log("\n📍 State:", conversationState, "| Input:", userText);
    
    // Check for casual conversation keywords BEFORE processing trip planning
    const lowerUserText = userText.toLowerCase();
    
    const greetingKeywords = [
      "hi", "hello", "hey", "hola", "namaste", "what's up", "sup",
      "good morning", "good afternoon", "good evening", "greetings"
    ];

    const identityKeywords = [
      "who are you", "what is your name", "what are you", "are you an ai",
      "tell me about yourself"
    ];

    const pleasantryKeywords = [
      "how are you", "how are you doing", "how's it going"
    ];
    
    let hardcodedResponse = null;

    if (greetingKeywords.some(keyword => lowerUserText === keyword)) {
      hardcodedResponse = "👋 Hello! I'm here to help you plan your perfect trip. What's your destination?";
    } else if (identityKeywords.some(keyword => lowerUserText.includes(keyword))) {
      hardcodedResponse = "I'm Tono, your AI Travel Planning Expert for Triponic. I'm here to turn your travel dreams into a seamless itinerary!";
    } else if (pleasantryKeywords.some(keyword => lowerUserText.includes(keyword))) {
      hardcodedResponse = "I'm doing great, thanks for asking! How about we start planning your next adventure?";
    } else if (lowerUserText === "thanks" || lowerUserText === "thank you") {
      hardcodedResponse = "You're most welcome! Let me know if you need any more help.";
    } else if (lowerUserText === "bye" || lowerUserText === "goodbye") {
      hardcodedResponse = "Goodbye! Happy travels and see you soon on Triponic.";
    }

    if (hardcodedResponse) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userText, type: "text", suggestions: [] },
        { sender: "bot", text: hardcodedResponse, type: "text", suggestions: [] },
      ]);
      setInput("");
      return;
    }

    // Continue with normal trip planning flow
    setInput("");
    
    const userMsg = { sender: "user", text: userText, type: "text", suggestions: [] };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    // Define the flow sequence
    const flowSequence = {
      location: {
        storeIn: "location",
        nextQuestion: "Great! When are you planning to travel? Please provide your travel dates or duration.",
        nextSuggestions: [],
        nextState: "date"
      },
      date: {
        storeIn: "date",
        nextQuestion: "Nice! What's your budget range for this trip?",
        nextSuggestions: ["Budget-friendly ($500-1500)", "Mid-range ($1500-3000)", "Luxury ($3000-5000)", "Premium ($5000+)", "No specific budget", "Need budget suggestions"],
        nextState: "budget"
      },
      budget: {
        storeIn: "budget",
        nextQuestion: "How many travelers will be going on this trip?",
        nextSuggestions: ["Just me (1)", "2 people", "3-4 people", "5-6 people", "Large group (7+)", "Family with kids"],
        nextState: "travelers"
      },
      travelers: {
        storeIn: "travelers",
        nextQuestion: "Great! What are your main interests or what type of activities do you prefer?",
        nextSuggestions: ["Adventure & outdoor", "Culture & history", "Food & dining", "Relaxation & spa", "Nightlife & entertainment", "Shopping & markets"],
        nextState: "interest"
      },
      interest: {
        storeIn: "interest",
        nextState: "generate"
      }
    };

    const currentStep = flowSequence[conversationState];
    
    if (!currentStep) {
      console.error("❌ Invalid state:", conversationState);
      setLoading(false);
      return;
    }

    // Update collected data
    const updatedData = { ...collectedData, [currentStep.storeIn]: userText };
    setCollectedData(updatedData);
    
    console.log("✅ Updated:", updatedData);

    // Save user message
    if (chatIdRef.current) {
      saveChat(chatIdRef.current, [userMsg]).catch(e => console.error("Save failed:", e));
    }

    // Check if we should generate or ask next question
    if (currentStep.nextState === "generate") {
      console.log("🎯 All data collected, generating...");
      setConversationState("generate");
      await generateTripPlan(updatedData);
    } else {
      // Ask next question
      setTimeout(() => {
        const botMsg = {
          sender: "bot",
          text: currentStep.nextQuestion,
          suggestions: currentStep.nextSuggestions,
          type: "text"
        };
        
        setMessages(prev => [...prev, botMsg]);
        setConversationState(currentStep.nextState);
        
        if (chatIdRef.current) {
          saveChat(chatIdRef.current, [botMsg]).catch(e => console.error("Save failed:", e));
        }
        
        setLoading(false);
        console.log("➡️ Next state:", currentStep.nextState);
      }, 800);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleInputSubmit(suggestion);
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setRecording(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " : "") + transcript);
      setRecording(false);
    };
    recognition.onerror = () => {
      setRecording(false);
    };
    recognition.onend = () => {
      setRecording(false);
    };
    recognition.start();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-3xl max-h-[95vh] flex flex-col overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h8m-8 4h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow">Chat with Tono</h2>
              <p className="text-white/90 text-xs sm:text-sm">Your AI Travel Planning Expert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="text-white hover:text-gray-200 transition rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 text-gray-900 bg-gradient-to-b from-gray-50 via-white to-gray-100"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((msg, i) => {
            if (msg.type === "tripPlan") {
              return (
                <TripPlanMessage
                  key={msg.id || i}
                  data={msg}
                  setInput={setInput}
                  handleInputSubmit={handleInputSubmit}
                />
              );
            }
            return (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col space-y-2 max-w-[80vw] sm:max-w-[70%]">
                  <div
                    className={`rounded-2xl px-4 py-2 text-base whitespace-pre-wrap border relative transition-all duration-200 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white border-blue-700 rounded-br-none shadow-lg"
                        : "bg-white border-gray-300 text-gray-800 rounded-bl-none shadow-md"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(msg.text || ""),
                          }}
                        />
                        {msg.text && (
                          <button
                            onClick={() => speak(msg.text || "")}
                            className="absolute -top-2 -right-2 bg-gray-200 text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-300 transition-colors"
                            aria-label="Read message aloud"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.383 3.018a1.5 1.5 0 011.66 0l4.5 2.25A1.5 1.5 0 0116 6.643v6.714a1.5 1.5 0 01-1.457.76l-4.5-2.25a1.5 1.5 0 01-.826-1.34V4.358a1.5 1.5 0 01.826-1.34zM11 11.25V5.5L7 7.5v6l4-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.sender === "bot" && msg.suggestions?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-3 py-1.5 rounded-full border border-blue-300 transition-colors disabled:opacity-50"
                          disabled={loading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && <TypingIndicator />}
        </div>

        <div className="border-t border-gray-200 bg-white rounded-b-3xl">
          <div className="px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
              placeholder="Type your travel request..."
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm transition"
              disabled={loading}
            />
            <button
              onClick={() => handleInputSubmit()}
              className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition shadow"
              disabled={loading || !input.trim()}
              type="button"
            >
              <span className="hidden sm:inline">Send</span>
              <svg className="sm:hidden h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={handleMicClick}
              className={`bg-gray-200 text-gray-700 rounded-full p-2 shadow hover:bg-gray-300 active:bg-gray-400 transition ${recording ? "animate-pulse ring-2 ring-blue-400" : ""}`}
              aria-label="Speak your request"
              type="button"
              disabled={loading || recording}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zm5 10a1 1 0 1 1 2 0c0 4.418-3.582 8-8 8s-8-3.582-8-8a1 1 0 1 1 2 0c0 3.314 2.686 6 6 6s6-2.686 6-6zm-7 8h2v2a1 1 0 1 1-2 0v-2z"/>
              </svg>
            </button>
          </div>

          <div className="px-3 sm:px-4 pb-4">
            <button
              onClick={() => {
                if (onStartPlanning) onStartPlanning();
                if (onClose) onClose();
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow"
            >
              Use Planning Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;