"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDesignStore } from "@/store/designStore"
import DesignElement from "./DesignElement"

export default function Canvas() {
  const { elements, selectedElementId, setSelectedElement, updateElementPosition, canvasSize, zoom, panOffset } =
    useDesignStore()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })

  // Handle canvas click to deselect elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
    }
  }

  // Center the canvas on initial load
  useEffect(() => {
    if (canvasRef.current && typeof window !== "undefined") {
      const containerWidth = canvasRef.current.parentElement?.clientWidth || window.innerWidth
      const containerHeight = canvasRef.current.parentElement?.clientHeight || window.innerHeight

      const centerX = (containerWidth - canvasSize.width * zoom) / 2
      const centerY = (containerHeight - canvasSize.height * zoom) / 2

      useDesignStore.setState({ panOffset: { x: centerX, y: centerY } })
    }
  }, [canvasSize.width, canvasSize.height, zoom])

  // Handle space bar + drag to pan the canvas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isDragging) {
        document.body.style.cursor = "grab"
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab"
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        document.body.style.cursor = "default"
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "default"
        }
        setIsDragging(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.body.style.cursor = "default"
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start panning if space is pressed
    if (e.buttons === 1 && e.getModifierState("Space")) {
      setIsDragging(true)
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing"
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPanOffset = {
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      }
      useDesignStore.setState({ panOffset: newPanOffset })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab"
      }
    }
  }

  return (
    <div
      className="flex-1 overflow-hidden bg-gray-700 relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        onClick={handleCanvasClick}
        style={{
          backgroundImage:
            "linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      >
        <div
          ref={canvasRef}
          className="bg-white shadow-xl relative design-canvas"
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {elements.map((element) => (
            <DesignElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
