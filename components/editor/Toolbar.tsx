"use client"
import { useDesignStore } from "@/store/designStore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import html2canvas from "html2canvas"

export default function Toolbar() {
  const {
    addElement,
    selectedElementId,
    elements,
    updateElementStyle,
    canvasSize,
    setCanvasSize,
    zoom,
    setZoom,
    history,
    undo,
    redo,
  } = useDesignStore()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  const handleAddText = () => {
    addElement({
      type: "text",
      content: "New Text",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      rotation: 0,
      style: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "Arial",
        fontWeight: "normal",
        textAlign: "left",
      },
    })
  }

  const handleAddImage = () => {
    // Open file input
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          addElement({
            type: "image",
            content: event.target?.result as string,
            position: { x: 100, y: 100 },
            size: { width: 200, height: 200 },
            rotation: 0,
            style: {
              objectFit: "contain",
              opacity: 1,
            },
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleAddShape = (shapeType: string) => {
    addElement({
      type: "shape",
      shapeType,
      content: "",
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      rotation: 0,
      style: {
        fill: "#4f46e5",
        stroke: "none",
        strokeWidth: 0,
        opacity: 1,
      },
    })
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.1))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  const handleSave = () => {
    try {
      setIsSaving(true)
      localStorage.setItem("designElements", JSON.stringify(elements))
      localStorage.setItem("canvasSize", JSON.stringify(canvasSize))

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      successMessage.textContent = "Design saved successfully!"
      document.body.appendChild(successMessage)

      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 3000)
    } catch (error) {
      console.error("Error saving design:", error)

      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.className = "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50"
      errorMessage.textContent = "Failed to save design. Please try again."
      document.body.appendChild(errorMessage)

      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage)
      }, 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async (format: string) => {
    setIsExporting(true)
    setExportFormat(null)

    try {
      // Find the canvas element
      const canvasElement = document.querySelector(".design-canvas") as HTMLElement

      if (!canvasElement) {
        throw new Error("Canvas element not found")
      }

      // Use html2canvas to capture the canvas
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
      })

      // Create download link
      const link = document.createElement("a")

      if (format === "png") {
        link.href = canvas.toDataURL("image/png")
        link.download = `elegant-hub-design-${Date.now()}.png`
      } else if (format === "jpg") {
        link.href = canvas.toDataURL("image/jpeg", 0.9)
        link.download = `elegant-hub-design-${Date.now()}.jpg`
      }

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      successMessage.textContent = `Design exported as ${format.toUpperCase()} successfully!`
      document.body.appendChild(successMessage)

      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 3000)
    } catch (error) {
      console.error("Error exporting design:", error)

      // Show error message
      const errorMessage = document.createElement("div")
      errorMessage.className = "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50"
      errorMessage.textContent = "Failed to export design. Please try again."
      document.body.appendChild(errorMessage)

      // Remove message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(errorMessage)
      }, 3000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={history.past.length === 0}
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="h-6 border-r border-gray-600 mx-2"></div>

        {/* Add elements */}
        <button onClick={handleAddText} className="p-2 rounded hover:bg-gray-700" title="Add Text">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button onClick={handleAddImage} className="p-2 rounded hover:bg-gray-700" title="Add Image">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="relative group">
          <button className="p-2 rounded hover:bg-gray-700" title="Add Shape">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </button>
          <div className="absolute left-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
            <div className="py-1">
              <button
                onClick={() => handleAddShape("rectangle")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Rectangle
              </button>
              <button
                onClick={() => handleAddShape("circle")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Circle
              </button>
              <button
                onClick={() => handleAddShape("triangle")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Triangle
              </button>
            </div>
          </div>
        </div>

        <div className="h-6 border-r border-gray-600 mx-2"></div>

        {/* Zoom controls */}
        <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-700" title="Zoom Out">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm text-gray-300">{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-700" title="Zoom In">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button onClick={handleZoomReset} className="p-2 rounded hover:bg-gray-700" title="Reset Zoom">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => window.open("/editor/preview", "_blank")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          Preview
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-3 py-1 rounded text-sm"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <div className="relative group">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center"
            onClick={() => setExportFormat(exportFormat ? null : "png")}
          >
            Export
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {exportFormat && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => handleExport("png")}
                  disabled={isExporting}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  PNG Image
                </button>
                <button
                  onClick={() => handleExport("jpg")}
                  disabled={isExporting}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                >
                  JPG Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
