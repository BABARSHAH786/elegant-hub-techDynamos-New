"use client"

import { useEffect, useState } from "react"
import { useDesignStore } from "@/store/designStore"
import Link from "next/link"

export default function PreviewPage() {
  const [elements, setElements] = useState<any[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Load design data from localStorage on component mount
  useEffect(() => {
    // Try to get design data from localStorage
    const storedElements = localStorage.getItem("designElements")
    const storedCanvasSize = localStorage.getItem("canvasSize")

    if (storedElements) {
      setElements(JSON.parse(storedElements))
    } else {
      // If no stored data, get from the store
      const storeElements = useDesignStore.getState().elements
      setElements(storeElements)

      // Save to localStorage for future use
      localStorage.setItem("designElements", JSON.stringify(storeElements))
    }

    if (storedCanvasSize) {
      setCanvasSize(JSON.parse(storedCanvasSize))
    } else {
      const storeCanvasSize = useDesignStore.getState().canvasSize
      setCanvasSize(storeCanvasSize)
      localStorage.setItem("canvasSize", JSON.stringify(storeCanvasSize))
    }
  }, [])

  const renderElement = (element: any) => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              transform: `rotate(${element.rotation || 0}deg)`,
              color: element.style?.color || "#000000",
              fontFamily: element.style?.fontFamily || "Arial",
              fontSize: `${element.style?.fontSize || 16}px`,
              fontWeight: element.style?.fontWeight || "normal",
              textAlign: (element.style?.textAlign as any) || "left",
              display: "flex",
              alignItems: "center",
              justifyContent: element.style?.textAlign === "center" ? "center" : "flex-start",
              padding: "4px",
              userSelect: "none",
              opacity: element.style?.opacity || 1,
            }}
          >
            {element.content}
          </div>
        )
      case "image":
        return (
          <img
            src={element.content || "/placeholder.svg"}
            alt="Design element"
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              transform: `rotate(${element.rotation || 0}deg)`,
              objectFit: element.style?.objectFit || "contain",
              opacity: element.style?.opacity || 1,
            }}
          />
        )
      case "shape":
        const shapePath = (() => {
          switch (element.shapeType) {
            case "rectangle":
              return "M0,0 L100,0 L100,100 L0,100 Z"
            case "circle":
              return "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z"
            case "triangle":
              return "M50,0 L100,100 L0,100 Z"
            default:
              return "M0,0 L100,0 L100,100 L0,100 Z"
          }
        })()

        return (
          <div
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              transform: `rotate(${element.rotation || 0}deg)`,
              opacity: element.style?.opacity || 1,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <path
                d={shapePath}
                fill={element.style?.fill || "#000000"}
                stroke={element.style?.stroke || "none"}
                strokeWidth={element.style?.strokeWidth || 0}
                opacity={element.style?.opacity || 1}
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Design Preview</h1>
        <div className="flex space-x-2">
          <Link href="/editor" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
            Back to Editor
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="bg-white shadow-xl relative"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        >
          {elements.map((element) => (
            <div key={element.id}>{renderElement(element)}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
