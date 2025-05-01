"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { ProductType } from "@/types"

type AIMode = "suggest" | "enhance" | "generate"

export default function AIAssistant({
  product,
  onClose,
  onSuggest,
}: {
  product: ProductType
  onClose: () => void
  onSuggest: (element: any) => void
}) {
  const [mode, setMode] = useState<AIMode>("suggest")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  // Mock AI suggestion generation
  const generateSuggestions = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: 1,
          title: "Minimalist Design",
          description: "Clean lines with subtle color accents",
          color: "#3b82f6",
          type: "text",
        },
        {
          id: 2,
          title: "Bold Typography",
          description: "Strong statement text with high contrast",
          color: "#ef4444",
          type: "text",
        },
        {
          id: 3,
          title: "Nature Inspired",
          description: "Organic patterns with earthy tones",
          color: "#10b981",
          type: "shape",
        },
      ]

      setSuggestions(mockSuggestions)
      setIsGenerating(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    generateSuggestions()
  }

  const handleSuggestionSelect = (suggestion: any) => {
    onSuggest({
      type: suggestion.type || "shape",
      content: suggestion.title,
      color: suggestion.color,
      fontSize: 24,
      fontFamily: "Arial",
    })
    onClose()
  }

  useEffect(() => {
    // Generate initial suggestions
    generateSuggestions()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Design Assistant
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setMode("suggest")}
              className={`px-4 py-2 rounded-lg ${
                mode === "suggest" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Get Suggestions
            </button>
            <button
              onClick={() => setMode("enhance")}
              className={`px-4 py-2 rounded-lg ${
                mode === "enhance" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Enhance Design
            </button>
            <button
              onClick={() => setMode("generate")}
              className={`px-4 py-2 rounded-lg ${
                mode === "generate" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Generate New
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              {mode === "suggest" && "What kind of design are you looking for?"}
              {mode === "enhance" && "How would you like to improve your current design?"}
              {mode === "generate" && "Describe the design you want to generate:"}
            </label>
            <div className="flex">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "suggest"
                    ? "e.g., Minimalist logo for a coffee shop"
                    : mode === "enhance"
                      ? "e.g., Make colors more vibrant"
                      : "e.g., A mountain landscape with sunset colors"
                }
                className="flex-1 px-4 py-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-r-lg"
              >
                {isGenerating ? "Thinking..." : "Go"}
              </button>
            </div>
          </form>

          <div>
            <h3 className="text-lg font-medium mb-4">
              {mode === "suggest" && "Design Suggestions"}
              {mode === "enhance" && "Enhancement Ideas"}
              {mode === "generate" && "Generated Designs"}
            </h3>

            {isGenerating ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Our AI is crafting designs just for you...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="aspect-square rounded-md mb-3" style={{ backgroundColor: suggestion.color }}></div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-gray-400">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <p className="text-xs text-gray-400">
            AI-powered design suggestions are based on current trends and your preferences. Results may vary.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
