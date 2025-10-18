import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const API_KEY = "AIzaSyCwk1tay6gpqlVy7SHuA5Iv3lzRb9ENsvY";

export default function FloatingEditor({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 140,
    y: window.innerHeight / 2 - 100,
  });
  const [input, setInput] = useState('');
  const boxRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  }; 
  
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const planId = localStorage.getItem("current_plan_id");
    if (!planId) {
      console.error("No plan ID found in localStorage.");
      alert("No plan ID found. Please reload the itinerary page.");
      return;
    }

    const planKey = `chatHistory-${planId}`;
    const storedPlan = localStorage.getItem(planKey);

    if (!storedPlan) {
      console.error("No plan found in localStorage.");
      alert("No saved itinerary found to edit.");
      return;
    }

    let parsedPlan: any;
    try {
      parsedPlan = JSON.parse(storedPlan);
    } catch (e) {
      console.error("Failed to parse stored plan JSON:", storedPlan);
      alert("Stored itinerary is corrupted.");
      return;
    }

    const prompt = `
You are a travel itinerary planner AI. Your task is to modify ONLY the JSON plan provided below, based on the user's request.

Constraints:
- Respond with VALID JSON ONLY. No markdown, no extra explanation.
- DO NOT change the structure or format.
- Edit only the necessary parts based on the user's message.
- If the message is unclear, make minimal, reasonable assumptions.

Original plan (JSON):
${JSON.stringify(parsedPlan)}

Return ONLY the updated fields that need to be changed. Keep the response short and minimal.
Do NOT return the entire plan—only the modified parts.

HERE IS STUTRE OF THE RESPONSE  YOU NEED TO GERNATE ONLY THAT VARABILE VALUE NEED TO BE REPLACE  

User message:
"${input}"
  `;

    const deepMerge = (target: any, source: any): any => {
      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          if (!target[key]) target[key] = {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let patch: any;
      try {
        patch = JSON.parse(textResponse);
      } catch (err) {
        console.error("Failed to parse AI response as JSON:", textResponse);
        alert("Could not understand the AI's response. Try again.");
        return;
      }

      const updatedPlan = deepMerge(parsedPlan, patch);
      localStorage.setItem(planKey, JSON.stringify(updatedPlan));

      setInput("");
      window.location.reload();
    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong while communicating with the AI.");
    }
  };

  return (
    <div
      ref={boxRef}
      className="fixed w-[280px] bg-white rounded-lg shadow-lg border border-gray-300 z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      }}
    >
      <div
        className="flex items-center justify-between p-2 border-b bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-t-xl"
        onMouseDown={handleMouseDown}
      >
        <h2 className="font-bold text-white text-sm">Chat with Tono</h2>
        <button
          onClick={onClose}
          className="text-white ml-2 text-xs hover:text-red-300"
        >
          ✖
        </button>
      </div>

      <div className="flex items-center p-2 border-t">
        <input
          className="flex-1 px-3 py-1 border rounded-md text-sm"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={handleSend}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
