"use client"

import { useState, useEffect } from "react"
import { useDesignStore } from "@/store/designStore"
import { SketchPicker } from "react-color"

export default function Sidebar() {
  const { selectedElementId, elements, updateElementStyle, updateElementContent, deleteElement } = useDesignStore()
  const [activeTab, setActiveTab] = useState("element") // Default to element tab for better UX
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerProperty, setColorPickerProperty] = useState<string | null>(null)
  const [colorPickerColor, setColorPickerColor] = useState("#000000")

  const selectedElement = elements.find((el) => el.id === selectedElementId)

  // When selected element changes, switch to element tab
  useEffect(() => {
    if (selectedElementId) {
      setActiveTab("element")
    }
  }, [selectedElementId])

  const handleStyleChange = (property: string, value: any) => {
    if (selectedElementId) {
      updateElementStyle(selectedElementId, { [property]: value })
    }
  }

  const handleContentChange = (content: string) => {
    if (selectedElementId) {
      updateElementContent(selectedElementId, content)
    }
  }

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId)
    }
  }

  const handleColorPickerOpen = (property: string) => {
    let currentColor = "#000000"

    if (selectedElement) {
      if (property === "color") {
        currentColor = selectedElement.style?.color || "#000000"
      } else if (property === "fill") {
        currentColor = selectedElement.style?.fill || "#000000"
      } else if (property === "stroke") {
        currentColor = selectedElement.style?.stroke || "#000000"
      }
    }

    setColorPickerColor(currentColor)
    setColorPickerProperty(property)
    setShowColorPicker(true)
  }

  const handleColorChange = (color: any) => {
    setColorPickerColor(color.hex)

    if (selectedElementId && colorPickerProperty) {
      updateElementStyle(selectedElementId, { [colorPickerProperty]: color.hex })
    }
  }

  const renderLayersPanel = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Layers</h3>
      {elements.length === 0 ? (
        <div className="text-center text-gray-400 py-4">
          <p>No elements added yet</p>
          <p className="text-xs mt-1">Use the toolbar to add elements</p>
        </div>
      ) : (
        <div className="space-y-1">
          {elements.map((element, index) => (
            <div
              key={element.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                element.id === selectedElementId ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => useDesignStore.setState({ selectedElementId: element.id })}
            >
              <div className="flex items-center">
                <span className="w-5 h-5 flex items-center justify-center mr-2 text-xs text-gray-400">
                  {elements.length - index}
                </span>
                <span className="text-sm truncate">
                  {element.type === "text" ? element.content.substring(0, 20) : `${element.type} ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  className="text-gray-400 hover:text-white p-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Toggle visibility
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="text-gray-400 hover:text-red-500 p-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteElement(element.id)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderElementPanel = () => {
    if (!selectedElement) {
      return (
        <div className="p-4 text-center text-gray-400">
          <p>Select an element to edit its properties</p>
          <p className="text-xs mt-2">Click on any element on the canvas</p>
        </div>
      )
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-300">Element Properties</h3>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-sm">
            Delete
          </button>
        </div>

        {selectedElement.type === "text" && (
          <>
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Text Content</label>
              <textarea
                value={selectedElement.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Text Color</label>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600"
                  style={{ backgroundColor: selectedElement.style?.color || "#000000" }}
                  onClick={() => handleColorPickerOpen("color")}
                ></div>
                <span className="ml-2">{selectedElement.style?.color || "#000000"}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Font Family</label>
              <select
                value={selectedElement.style?.fontFamily || "Arial"}
                onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Font Size</label>
              <input
                type="number"
                value={selectedElement.style?.fontSize || 16}
                onChange={(e) => handleStyleChange("fontSize", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                min={8}
                max={72}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Font Weight</label>
              <select
                value={selectedElement.style?.fontWeight || "normal"}
                onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Light</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Text Align</label>
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-1 ${selectedElement.style?.textAlign === "left" ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => handleStyleChange("textAlign", "left")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className={`flex-1 py-1 ${selectedElement.style?.textAlign === "center" ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => handleStyleChange("textAlign", "center")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className={`flex-1 py-1 ${selectedElement.style?.textAlign === "right" ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => handleStyleChange("textAlign", "right")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 10a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {selectedElement.type === "image" && (
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Object Fit</label>
            <select
              value={selectedElement.style?.objectFit || "contain"}
              onChange={(e) => handleStyleChange("objectFit", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="contain">Contain</option>
              <option value="cover">Cover</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        )}

        {selectedElement.type === "shape" && (
          <>
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Fill Color</label>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600"
                  style={{ backgroundColor: selectedElement.style?.fill || "#000000" }}
                  onClick={() => handleColorPickerOpen("fill")}
                ></div>
                <span className="ml-2">{selectedElement.style?.fill || "#000000"}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Stroke</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedElement.style?.stroke !== "none"}
                  onChange={(e) => handleStyleChange("stroke", e.target.checked ? "#000000" : "none")}
                  className="mr-2"
                />
                {selectedElement.style?.stroke !== "none" && (
                  <div
                    className="w-6 h-6 rounded cursor-pointer border border-gray-600"
                    style={{ backgroundColor: selectedElement.style?.stroke || "#000000" }}
                    onClick={() => handleColorPickerOpen("stroke")}
                  ></div>
                )}
              </div>
            </div>

            {selectedElement.style?.stroke !== "none" && (
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">Stroke Width</label>
                <input
                  type="number"
                  value={selectedElement.style?.strokeWidth || 1}
                  onChange={(e) => handleStyleChange("strokeWidth", Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  min={1}
                  max={10}
                />
              </div>
            )}
          </>
        )}

        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedElement.style?.opacity || 1}
            onChange={(e) => handleStyleChange("opacity", Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>{Math.round((selectedElement.style?.opacity || 1) * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    )
  }

  const renderAssetsPanel = () => (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Assets</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium text-gray-400">Images</h4>
          <button className="text-xs text-purple-400 hover:text-purple-300">Upload</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-square bg-gray-700 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500"
            ></div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium text-gray-400">Shapes</h4>
          <button className="text-xs text-purple-400 hover:text-purple-300">More</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600">
            <div className="w-8 h-8 bg-purple-500 rounded-md"></div>
          </div>
          <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600">
            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
          </div>
          <div className="aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600">
            <div className="w-8 h-8 bg-purple-500" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium text-gray-400">Templates</h4>
          <button className="text-xs text-purple-400 hover:text-purple-300">Browse All</button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="aspect-video bg-gray-700 rounded-md cursor-pointer hover:ring-2 hover:ring-purple-500"
            ></div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "layers" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("layers")}
          >
            Layers
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "element" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("element")}
          >
            Element
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "assets" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("assets")}
          >
            Assets
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "layers" && renderLayersPanel()}
        {activeTab === "element" && renderElementPanel()}
        {activeTab === "assets" && renderAssetsPanel()}
      </div>

      {showColorPicker && (
        <div className="absolute z-50 left-64 mt-2">
          <div className="fixed inset-0" onClick={() => setShowColorPicker(false)}></div>
          <SketchPicker
            color={colorPickerColor}
            onChange={handleColorChange}
            onChangeComplete={(color) => {
              if (selectedElementId && colorPickerProperty) {
                updateElementStyle(selectedElementId, { [colorPickerProperty]: color.hex })
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
