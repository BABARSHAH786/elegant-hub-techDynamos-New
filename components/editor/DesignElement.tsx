"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useDesignStore } from "@/store/designStore"
import type { DesignElement as DesignElementType } from "@/types/editor"

interface DesignElementProps {
  element: DesignElementType
  isSelected: boolean
  zoom: number
}

export default function DesignElement({ element, isSelected, zoom }: DesignElementProps) {
  const { setSelectedElement, updateElementPosition, updateElementSize } = useDesignStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef({ x: 0, y: 0 })
  const startSizeRef = useRef({ width: 0, height: 0 })

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedElement(element.id)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    startPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - startPosRef.current.x) / zoom
      const deltaY = (e.clientY - startPosRef.current.y) / zoom
      updateElementPosition(element.id, {
        x: element.position.x + deltaX,
        y: element.position.y + deltaY,
      })
      startPosRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    startPosRef.current = { x: e.clientX, y: e.clientY }
    startSizeRef.current = { width: element.size.width, height: element.size.height }
  }

  const handleResize = (e: React.MouseEvent) => {
    if (isResizing && resizeDirection) {
      const deltaX = (e.clientX - startPosRef.current.x) / zoom
      const deltaY = (e.clientY - startPosRef.current.y) / zoom

      let newWidth = startSizeRef.current.width
      let newHeight = startSizeRef.current.height
      let newX = element.position.x
      let newY = element.position.y

      if (resizeDirection.includes("e")) {
        newWidth = Math.max(20, startSizeRef.current.width + deltaX)
      }
      if (resizeDirection.includes("w")) {
        const widthChange = Math.min(startSizeRef.current.width - 20, deltaX)
        newWidth = startSizeRef.current.width - widthChange
        newX = element.position.x + widthChange
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(20, startSizeRef.current.height + deltaY)
      }
      if (resizeDirection.includes("n")) {
        const heightChange = Math.min(startSizeRef.current.height - 20, deltaY)
        newHeight = startSizeRef.current.height - heightChange
        newY = element.position.y + heightChange
      }

      updateElementSize(element.id, { width: newWidth, height: newHeight })
      updateElementPosition(element.id, { x: newX, y: newY })
    }
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    setResizeDirection(null)
  }

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              color: element.style?.color || "#000000",
              fontFamily: element.style?.fontFamily || "Arial",
              fontSize: `${element.style?.fontSize || 16}px`,
              fontWeight: element.style?.fontWeight || "normal",
              textAlign: (element.style?.textAlign as any) || "left",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: element.style?.textAlign === "center" ? "center" : "flex-start",
              padding: "4px",
              userSelect: "none",
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
              width: "100%",
              height: "100%",
              objectFit: element.style?.objectFit || "contain",
              opacity: element.style?.opacity || 1,
            }}
            draggable={false}
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
        )
      default:
        return <div>Unknown element type</div>
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? "z-10" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.style?.opacity || 1,
      }}
      onClick={handleElementClick}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {renderElement()}

      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none"></div>

          {/* Resize handles */}
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -top-1 -left-1 cursor-nwse-resize"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -top-1 -right-1 cursor-nesw-resize"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -bottom-1 -left-1 cursor-nesw-resize"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full -bottom-1 -right-1 cursor-nwse-resize"
            onMouseDown={(e) => handleResizeStart(e, "se")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize"
            onMouseDown={(e) => handleResizeStart(e, "w")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize"
            onMouseDown={(e) => handleResizeStart(e, "e")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full left-1/2 -top-1 -translate-x-1/2 cursor-ns-resize"
            onMouseDown={(e) => handleResizeStart(e, "n")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-full left-1/2 -bottom-1 -translate-x-1/2 cursor-ns-resize"
            onMouseDown={(e) => handleResizeStart(e, "s")}
            onMouseMove={handleResize}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          ></div>
        </>
      )}
    </div>
  )
}
