"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"design" | "templates" | "features">("design")

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Elegant Hub
        </motion.h1>

        <motion.p
          className="text-xl text-center mb-12 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create stunning designs with our powerful editor and extensive tool collection
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs for navigation */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="flex rounded-lg bg-gray-800 p-1">
              <button
                onClick={() => setActiveTab("design")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "design" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Design Studio
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "templates" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "features" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Features
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className={`lg:w-3/4 ${activeTab !== "design" && "hidden lg:block"}`}>
            <div className="bg-gray-800 rounded-xl p-4 shadow-xl mb-8">
              <div className="aspect-[4/3] w-full bg-gray-900 rounded-lg overflow-hidden relative">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Editor Preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">Powerful Design Editor</h2>
                    <p className="text-gray-300 mb-4">
                      Create stunning designs with our intuitive drag-and-drop editor
                    </p>
                    <Link
                      href="/editor"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-all"
                    >
                      Start Designing
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Key Features
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Drag-and-Drop Editor with Canvas Workspace</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Layers Panel and Element Inspector</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Text, Image, Shape, and Drawing Tools</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Asset Management with Template Library</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Advanced Editing with Filters & Effects</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Getting Started
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">1. Choose a Template</h3>
                    <p className="text-sm text-gray-400">Start with a pre-designed template or create from scratch</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">2. Customize Your Design</h3>
                    <p className="text-sm text-gray-400">Add text, images, shapes, and more to make it your own</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">3. Export & Share</h3>
                    <p className="text-sm text-gray-400">Download your design in various formats or share directly</p>
                  </div>

                  <Link
                    href="/editor"
                    className="block text-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-all"
                  >
                    View Tutorial
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Tab (Mobile) */}
          <div className={`${activeTab !== "templates" && "hidden lg:hidden"}`}>
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Templates</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="group relative">
                    <div className="aspect-[3/4] bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=400&width=300&text=Template ${item}`}
                        alt={`Template ${item}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <Link
                        href="/editor"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-all">
                View All Templates
              </button>
            </div>
          </div>

          {/* Features Tab (Mobile) */}
          <div className={`${activeTab !== "features" && "hidden lg:hidden"}`}>
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Features</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-purple-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Design Tools
                  </h3>
                  <ul className="space-y-2 pl-7">
                    <li className="list-disc text-gray-300">Drag-and-Drop Editor</li>
                    <li className="list-disc text-gray-300">Canvas Workspace</li>
                    <li className="list-disc text-gray-300">Layers Panel</li>
                    <li className="list-disc text-gray-300">Element Inspector</li>
                    <li className="list-disc text-gray-300">Text, Image, Shape Tools</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-purple-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Asset Management
                  </h3>
                  <ul className="space-y-2 pl-7">
                    <li className="list-disc text-gray-300">Template Library</li>
                    <li className="list-disc text-gray-300">Photo Library</li>
                    <li className="list-disc text-gray-300">Elements Library</li>
                    <li className="list-disc text-gray-300">Uploads Panel</li>
                    <li className="list-disc text-gray-300">Font Manager</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-purple-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Export & Sharing
                  </h3>
                  <ul className="space-y-2 pl-7">
                    <li className="list-disc text-gray-300">Multiple Download Formats</li>
                    <li className="list-disc text-gray-300">Share Links</li>
                    <li className="list-disc text-gray-300">Collaboration Tools</li>
                    <li className="list-disc text-gray-300">Version History</li>
                    <li className="list-disc text-gray-300">Cloud Autosave</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar for desktop */}
          <div className="lg:w-1/4 space-y-8 hidden lg:block">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Popular Templates</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">Template {item}</p>
                      <p className="text-xs text-gray-400">Professional design</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/templates" className="block text-center text-purple-400 hover:text-purple-300 mt-4 text-sm">
                View All Templates
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Pro Features</h2>
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-4 rounded-lg mb-4">
                <p className="font-medium">Unlock Advanced Tools</p>
                <p className="text-sm text-gray-300 mb-2">Get access to all premium features and templates</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Starting at</span>
                  <span className="text-xs bg-purple-600 px-2 py-1 rounded">$9.99/mo</span>
                </div>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
