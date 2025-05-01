"use client"

import { useState } from "react"
import type { ProductType } from "@/types"
import { SketchPicker } from "react-color"

type DesignMode = "text" | "image" | "shapes" | "templates"

export default function DesignTools({
  product,
  onAddElement,
}: {
  product: ProductType
  onAddElement: (element: any) => void
}) {
  const [activeMode, setActiveMode] = useState<DesignMode>("text")
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState("Arial")
  const [color, setColor] = useState("#000000")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleAddText = () => {
    if (!text.trim()) return

    onAddElement({
      type: "text",
      content: text,
      fontSize,
      fontFamily,
      color,
    })

    setText("")
  }

  const handleAddShape = (shape: string) => {
    onAddElement({
      type: "shape",
      shape,
      color,
    })
  }

  const handleAddTemplate = (template: string) => {
    onAddElement({
      type: "template",
      template,
      color,
    })
  }

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex)
  }

  return (
    <div className="space-y-4">
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveMode("text")}
          className={`px-3 py-2 ${activeMode === "text" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
        >
          Text
        </button>
        <button
          onClick={() => setActiveMode("image")}
          className={`px-3 py-2 ${activeMode === "image" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
        >
          Images
        </button>
        <button
          onClick={() => setActiveMode("shapes")}
          className={`px-3 py-2 ${activeMode === "shapes" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
        >
          Shapes
        </button>
        <button
          onClick={() => setActiveMode("templates")}
          className={`px-3 py-2 ${activeMode === "templates" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400"}`}
        >
          Templates
        </button>
      </div>

      {activeMode === "text" && (
        <div className="space-y-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none"
              >
                {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none"
              >
                {["Arial", "Verdana", "Helvetica", "Times New Roman", "Courier New", "Georgia"].map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Color</label>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              ></div>
              <span className="ml-2">{color}</span>
            </div>

            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <div className="fixed inset-0" onClick={() => setShowColorPicker(false)}></div>
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </div>

          <button
            onClick={handleAddText}
            disabled={!text.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-all"
          >
            Add Text
          </button>
        </div>
      )}

      {activeMode === "image" && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-400">Drag and drop an image or click to browse</p>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0]
                  const imageUrl = URL.createObjectURL(file)
                  onAddElement({
                    type: "image",
                    content: imageUrl,
                    width: 1,
                    height: 1,
                  })
                }
              }}
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              onClick={() => document.getElementById("imageUpload")?.click()}
            >
              Upload Image
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Stock Images</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((img) => (
                <div
                  key={img}
                  className="aspect-square bg-gray-700 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500"
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMode === "shapes" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Color</label>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600"
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              ></div>
              <span className="ml-2">{color}</span>
            </div>

            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <div className="fixed inset-0" onClick={() => setShowColorPicker(false)}></div>
                <SketchPicker color={color} onChange={handleColorChange} />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Basic Shapes</h3>
            <div className="grid grid-cols-4 gap-2">
              <div
                className="aspect-square bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600"
                onClick={() => handleAddShape("circle")}
              >
                <div className="w-8 h-8 rounded-full bg-current"></div>
              </div>
              <div
                className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                onClick={() => handleAddShape("square")}
              >
                <div className="w-8 h-8 bg-current"></div>
              </div>
              <div
                className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                onClick={() => handleAddShape("triangle")}
              >
                <div className="w-8 h-8 bg-current" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
              </div>
              <div
                className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600"
                onClick={() => handleAddShape("star")}
              >
                <div
                  className="w-8 h-8 bg-current"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Decorative Elements</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((shape) => (
                <div
                  key={shape}
                  className="aspect-square bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                  onClick={() => handleAddShape(`decorative-${shape}`)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMode === "templates" && (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-2">Popular Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((template) => (
                <div
                  key={template}
                  className="aspect-video bg-gray-700 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500"
                  onClick={() => handleAddTemplate(`template-${template}`)}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Seasonal Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {[5, 6, 7, 8].map((template) => (
                <div
                  key={template}
                  className="aspect-video bg-gray-700 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500"
                  onClick={() => handleAddTemplate(`template-${template}`)}
                ></div>
              ))}
            </div>
          </div>

          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all">
            Browse All Templates
          </button>
        </div>
      )}
    </div>
  )
}
