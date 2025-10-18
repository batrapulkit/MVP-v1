"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, Bot, ImageIcon } from "lucide-react"

const API_KEY = "AIzaSyCwk1tay6gpqlVy7SHuA5Iv3lzRb9ENsvY"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isLoading?: boolean
  type?: "text" | "tripPlan"
  content?: string
  detailedPlan?: any
}

interface Props {
  show?: boolean
  onClose?: () => void
  chatKey?: string
}

const FloatingChatbot = ({ show, onClose, chatKey }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi! I can help you modify your current trip plan. What changes would you like to make?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [currentPlanData, setCurrentPlanData] = useState<any>(null)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load current plan data on mount
  useEffect(() => {
    let planId = chatKey

    // Fallback to localStorage if no chatKey provided
    if (!planId) {
      planId = localStorage.getItem("current_plan_id")
    }

    if (planId) {
      setCurrentPlanId(planId)
      const historyKey = `chatHistory-${planId}`
      const storedHistory = localStorage.getItem(historyKey)

      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory)
          const lastEntry = parsedHistory.length > 0 ? parsedHistory[parsedHistory.length - 1] : null

          if (lastEntry?.geminiResponse?.detailedPlan) {
            setCurrentPlanData(lastEntry.geminiResponse)
          }
        } catch (error) {
          console.error("Failed to load current plan:", error)
        }
      }
    }
  }, [chatKey])

  // Handle show/hide from parent component
  useEffect(() => {
    if (show !== undefined) {
      setIsOpen(show)
    }
  }, [show])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const callGemini = async (userMessage: string, conversationHistory: Message[]) => {
    try {
      const rawLocation = localStorage.getItem("userLocation")
      let locationDetails = {
        city: "",
        state: "",
        countryCode: "",
        currency: "",
      }

      if (rawLocation) {
        try {
          locationDetails = JSON.parse(rawLocation)
        } catch (e) {
          console.warn("Failed to parse location from localStorage")
        }
      }

      // Format conversation history
      const historyString = conversationHistory
        .map((msg) => {
          const senderLabel = msg.sender === "user" ? "User" : "AI"
          return `${senderLabel}: ${msg.text}`
        })
        .join("\n")

      const currentPlanJson = currentPlanData
        ? JSON.stringify(currentPlanData.detailedPlan, null, 2)
        : "No current plan available"

      const prompt = `You are an AI travel assistant helping to modify an existing trip plan.

Current Trip Plan:
${currentPlanJson}

Conversation History:
${historyString}

User's current city: ${locationDetails.city || "unknown"}
Currency: ${locationDetails.currency || "unknown"}

The user wants to modify their existing trip plan. Based on their request, you should:

1. If they want to modify specific aspects (dates, activities, hotels, etc.), update ONLY those parts while keeping the rest intact.
2. If they're asking general questions about their trip, provide helpful information.
3. If they want major changes, generate a new complete plan.

CRITICAL: Return ONLY a valid JSON object matching this exact structure (no explanations, no markdown, no extra text):

{
  "content": "string with a sweet message about the trip and destination",
  "detailedPlan": {
    "destination": "string (required)",
    "description": "string (required - a sweet description for the place)",
    "thumbnail": "string with a famous landmark or place name",
    "duration": "string (required)",
    "travelers": "number (required)",
    "budget": "string (required)",
    "interest": "string (required)",
    "totalCost": "string",
    "flights": {
      "departure": "string",
      "price": "string",
      "airline": "string",
      "duration": "string"
    },
    "hotel": {
      "name": "string",
      "location": "string",
      "price": "string",
      "rating": "number",
      "amenities": ["string"]
    },
    "dailyPlan": [
      {
        "day": "number",
        "title": "string",
        "description": "string",
        "activities": ["string", "string"],
        "activitiesDescription": ["string", "string"],
        "travelTips": ["string", "string"],
        "meals": {
          "breakfast": "string",
          "lunch": "string",
          "dinner": "string"
        },
        "notes": "string",
        "image": "string",
        "weather": "string",
        "transport": "string"
      }
    ],
    "weather": {
      "temp": "string",
      "condition": "string",
      "recommendation": "string"
    }
  },
  "isModification": true,
  "changesApplied": ["string", "string"],
  "suggestions": ["string", "string"]
}

IMPORTANT RULES:
- ALL fields in detailedPlan MUST be included, even if unchanged from the current plan
- Use the current plan data to fill unchanged fields
- Only modify the specific fields the user requested
- If current plan data is missing, create reasonable defaults
- Do NOT return incomplete objects or arrays
- Do NOT wrap the response in additional arrays or objects
- Do NOT use markdown formatting

For general questions (not modifications), return:
{
  "content": "Your helpful response",
  "isModification": false,
  "suggestions": ["string", "string"]
}

User's request: ${userMessage}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        },
      )

      const data = await response.json()
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!textResponse) {
        return { error: "No response from Gemini." }
      }

      try {
        let cleanText = textResponse.trim()

        cleanText = cleanText
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .replace(/`{3,}/g, "")
          .replace(/`+/g, "")
          .replace(/^\s*json\s*/i, "")

        let jsonContent = cleanText

        // Strategy 1: Find JSON object boundaries more precisely
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonContent = jsonMatch[0]
        }

        // Strategy 2: Remove any text before first { and after last }
        const firstBrace = jsonContent.indexOf("{")
        const lastBrace = jsonContent.lastIndexOf("}")

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)
        }

        jsonContent = jsonContent.replace(/`+/g, "").replace(/\\n/g, "\n").replace(/\\"/g, '"').trim()

        console.log("[v0] Attempting to parse cleaned JSON:", jsonContent.substring(0, 200) + "...")

        let parsed = JSON.parse(jsonContent)

        // Handle double-stringified JSON
        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed)
          } catch (e) {
            console.warn("[v0] Failed to parse double-stringified JSON, using as-is")
          }
        }

        // Normalize the response to expected format
        let normalizedResponse = null

        if (Array.isArray(parsed)) {
          console.log("[v0] Received array response, extracting first item")
          const firstItem = parsed[0]

          if (firstItem?.geminiResponse) {
            // Handle localStorage format with geminiResponse wrapper
            normalizedResponse = {
              content: firstItem.geminiResponse.content || "I've updated your trip plan!",
              detailedPlan: firstItem.geminiResponse.detailedPlan,
              isModification: true,
              changesApplied: firstItem.geminiResponse.changesApplied || ["Updated plan from response"],
              suggestions: firstItem.geminiResponse.suggestions || [],
            }
          } else if (firstItem?.detailedPlan) {
            // Handle direct plan object in array
            normalizedResponse = {
              content: firstItem.content || "Here's your updated plan!",
              detailedPlan: firstItem.detailedPlan,
              isModification: true,
              changesApplied: firstItem.changesApplied || ["Updated plan structure"],
              suggestions: firstItem.suggestions || [],
            }
          } else {
            // Use first item as-is
            normalizedResponse = firstItem
          }
        } else if (parsed && typeof parsed === "object") {
          // Handle direct object response (expected format)
          normalizedResponse = parsed
        }

        if (!normalizedResponse) {
          throw new Error("Could not normalize response format")
        }

        // Validate and fill missing fields for modification responses
        if (normalizedResponse.isModification && normalizedResponse.detailedPlan) {
          const requiredFields = {
            destination: currentPlanData?.detailedPlan?.destination || "Unknown destination",
            description: currentPlanData?.detailedPlan?.description || "A wonderful travel experience",
            thumbnail: currentPlanData?.detailedPlan?.thumbnail || "Landmark",
            duration: currentPlanData?.detailedPlan?.duration || "3 days",
            travelers: currentPlanData?.detailedPlan?.travelers || 1,
            budget: currentPlanData?.detailedPlan?.budget || "Mid-range",
            interest: currentPlanData?.detailedPlan?.interest || "General",
            totalCost: currentPlanData?.detailedPlan?.totalCost || "TBD",
            flights: currentPlanData?.detailedPlan?.flights || {},
            hotel: currentPlanData?.detailedPlan?.hotel || {},
            dailyPlan: currentPlanData?.detailedPlan?.dailyPlan || [],
            weather: currentPlanData?.detailedPlan?.weather || {},
          }

          // Merge current plan with updates, preserving existing data
          normalizedResponse.detailedPlan = {
            ...requiredFields,
            ...normalizedResponse.detailedPlan,
          }
        }

        console.log("[v0] Successfully parsed and normalized response")
        return normalizedResponse
      } catch (e) {
        console.error("[v0] JSON parsing failed:", e)
        console.log("[v0] Raw response that failed:", textResponse.substring(0, 500))

        return {
          content: `I understand your request, but I'm having trouble processing the response format. Let me try a different approach.\n\nError details:`,
          isModification: false,
          error: "Failed to parse AI response as JSON",
          suggestions: [
            "Try asking to change one specific thing at a time",
            "Be more specific about dates, locations, or activities",
            "Ask me to explain what I can help you modify",
          ],
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error)
      return { error: "Could not connect to Gemini. Please try again." }
    }
  }

  const updateStoredPlan = (newPlanData: any) => {
    const targetPlanId = chatKey || currentPlanId
    if (!targetPlanId) return

    const historyKey = `chatHistory-${targetPlanId}`
    const existing = JSON.parse(localStorage.getItem(historyKey) || "[]")

    if (existing.length > 0) {
      const lastEntry = existing[existing.length - 1]

      // Preserve existing structure and only update specific parts
      if (lastEntry.geminiResponse) {
        // Merge new data with existing, preserving unchanged fields
        lastEntry.geminiResponse = {
          ...lastEntry.geminiResponse,
          content: newPlanData.content || lastEntry.geminiResponse.content,
          detailedPlan: {
            ...lastEntry.geminiResponse.detailedPlan,
            ...newPlanData.detailedPlan,
          },
          suggestions: newPlanData.suggestions || lastEntry.geminiResponse.suggestions,
        }
      } else {
        // If no existing geminiResponse, create new one
        lastEntry.geminiResponse = newPlanData
      }

      localStorage.setItem(historyKey, JSON.stringify(existing))
      setCurrentPlanData(lastEntry.geminiResponse)

      // Trigger a page refresh or custom event to update the UI
      window.dispatchEvent(new CustomEvent("planUpdated", { detail: lastEntry.geminiResponse }))
    }
  }

  // Handle message sending
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return

    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Add user message
    const userMessage: Message = {
      id: messageId,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsTyping(true)

    // Add loading message
    const tempBotMessage: Message = {
      id: `bot-${messageId}`,
      text: "",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages((prev) => [...prev, tempBotMessage])

    try {
      // Get current messages for context
      const currentMessages = [...messages, userMessage]
      const botResponse = await callGemini(currentInput, currentMessages)

      if (botResponse.error) {
        throw new Error(botResponse.error)
      }

      console.log("Bot response received:", botResponse)

      // Check if this is a modification response
      if (botResponse.isModification && botResponse.detailedPlan) {
        // Update the stored plan
        const newPlanData = {
          content: botResponse.content,
          detailedPlan: botResponse.detailedPlan,
          suggestions: botResponse.suggestions || [],
        }
        updateStoredPlan(newPlanData)

        // Create response message with modification info
        let responseText = botResponse.content
        if (botResponse.changesApplied && botResponse.changesApplied.length > 0) {
          responseText += `\n\n✅ Changes applied:\n${botResponse.changesApplied
            .map((change: any) => `• ${change}`)
            .join("\n")}`
        }

        // Add bot message with response text
        const botMessage: Message = {
          id: `bot-${messageId}`,
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      } else {
        // Add bot message with general response
        const botMessage: Message = {
          id: `bot-${messageId}`,
          text: botResponse.content,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // // Add error message
      // const errorMessage: Message = {
      //   id: `error-${messageId}`,
      //   text: error.message,
      //   sender: "bot",
      //   timestamp: new Date(),
      // }

      // setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Handle closing the chatbot
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setIsOpen(false)
  }

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 max-w-full bg-white rounded-lg shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot size={24} />
          <span className="font-bold">Trip Assistant</span>
        </div>
        <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>
      <div className="p-4 flex flex-col space-y-4 overflow-y-auto max-h-[500px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-4 rounded-lg max-w-[70%] ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            >
              {msg.isLoading ? (
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div>
                  {msg.text}
                  {msg.type === "tripPlan" && (
                    <div className="mt-2">
                      <ImageIcon size={16} className="mr-2" />
                      <span>{msg.content}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex p-4 border-t">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSendMessage} className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          <Send size={24} />
        </button>
      </div>
    </div>
  )
}

export default FloatingChatbot
