"use client"

import { useState } from "react"

export default function CommunityShowcase() {
  const [activeCategory, setActiveCategory] = useState("trending")

  const mockDesigns = [
    {
      id: 1,
      title: "Mountain Sunrise",
      author: "creative_mind",
      likes: 243,
      product: "mug",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      title: "Ocean Waves",
      author: "design_guru",
      likes: 187,
      product: "shirt",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      title: "Abstract Pattern",
      author: "art_lover",
      likes: 156,
      product: "pillow",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 text-sm">
        <button
          onClick={() => setActiveCategory("trending")}
          className={`px-3 py-1 rounded-full ${
            activeCategory === "trending" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveCategory("new")}
          className={`px-3 py-1 rounded-full ${
            activeCategory === "new" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          New
        </button>
        <button
          onClick={() => setActiveCategory("popular")}
          className={`px-3 py-1 rounded-full ${
            activeCategory === "popular" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Popular
        </button>
      </div>

      <div className="space-y-3">
        {mockDesigns.map((design) => (
          <div key={design.id} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
            <div className="w-12 h-12 bg-gray-700 rounded-md flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{design.title}</p>
              <p className="text-xs text-gray-400">by {design.author}</p>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {design.likes}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
