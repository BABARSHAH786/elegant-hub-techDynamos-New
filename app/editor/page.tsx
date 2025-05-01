"use client"

import { useEffect } from "react"
import Toolbar from "@/components/editor/Toolbar"
import Canvas from "@/components/editor/Canvas"
import Sidebar from "@/components/editor/Sidebar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useDesignStore } from "@/store/designStore"

export default function EditorPage() {
  const { addElement } = useDesignStore()

  // Add some initial elements for demo purposes
  useEffect(() => {
    // Add a welcome text
    addElement({
      type: "text",
      content: "Welcome to Elegant Hub",
      position: { x: 250, y: 100 },
      size: { width: 300, height: 60 },
      rotation: 0,
      style: {
        color: "#333333",
        fontSize: 32,
        fontFamily: "Arial",
        fontWeight: "bold",
        textAlign: "center",
      },
    })

    // Add a subtitle
    addElement({
      type: "text",
      content: "Create stunning designs with our powerful editor",
      position: { x: 200, y: 180 },
      size: { width: 400, height: 40 },
      rotation: 0,
      style: {
        color: "#666666",
        fontSize: 18,
        fontFamily: "Arial",
        fontWeight: "normal",
        textAlign: "center",
      },
    })

    // Add a shape
    addElement({
      type: "shape",
      shapeType: "rectangle",
      content: "",
      position: { x: 350, y: 250 },
      size: { width: 100, height: 100 },
      rotation: 0,
      style: {
        fill: "#4f46e5",
        stroke: "none",
        strokeWidth: 0,
        opacity: 1,
      },
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      <div className="flex-1 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Toolbar />
          <Canvas />
        </div>
      </div>

      <Footer />
    </div>
  )
}
