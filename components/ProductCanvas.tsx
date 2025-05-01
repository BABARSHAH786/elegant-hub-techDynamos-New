"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from "@react-three/drei"
import type { ProductType } from "@/types"
import type { Group } from "three"
import * as THREE from "three"

// Product model component
function ProductModel({ product }: { product: ProductType }) {
  const group = useRef<Group>(null)
  const { scene } = useGLTF(`/models/${product}.glb`)

  // This is a placeholder since we don't have actual models
  // In a real app, you would load the correct 3D model based on the product type

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={
            product === "mug"
              ? "#f5f5f5"
              : product === "shirt"
                ? "#3b82f6"
                : product === "pillow"
                  ? "#e5e5e5"
                  : product === "phonecase"
                    ? "#000000"
                    : "#d1d5db"
          }
        />
      </mesh>
    </group>
  )
}

// Placeholder for when we don't have actual models
function PlaceholderProduct({ product }: { product: ProductType }) {
  const group = useRef<Group>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  // Different geometries based on product type
  const renderGeometry = () => {
    switch (product) {
      case "mug":
        return (
          <>
            <cylinderGeometry args={[0.7, 0.7, 1, 32]} />
            <torusGeometry args={[0.4, 0.1, 16, 32, Math.PI * 1.5]} />
          </>
        )
      case "shirt":
        return <boxGeometry args={[1.5, 2, 0.2]} />
      case "pillow":
        return <boxGeometry args={[2, 2, 0.5]} />
      case "phonecase":
        return <boxGeometry args={[0.8, 1.6, 0.1]} />
      case "canvas":
        return <boxGeometry args={[2, 1.5, 0.1]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        {renderGeometry()}
        <meshStandardMaterial
          color={
            product === "mug"
              ? "#f5f5f5"
              : product === "shirt"
                ? "#3b82f6"
                : product === "pillow"
                  ? "#e5e5e5"
                  : product === "phonecase"
                    ? "#000000"
                    : "#d1d5db"
          }
        />
      </mesh>
    </group>
  )
}

// Design elements that are added to the product
function DesignElements({ elements, product }: { elements: any[]; product: ProductType }) {
  const [textures, setTextures] = useState<Record<number, THREE.Texture>>({})

  useEffect(() => {
    const textureLoaders: Record<number, THREE.TextureLoader> = {}
    const newTextures: Record<number, THREE.Texture> = {}

    elements.forEach((element, index) => {
      if (element.type === "image" && element.content) {
        const textureLoader = new THREE.TextureLoader()
        textureLoader.crossOrigin = "anonymous"
        textureLoaders[index] = textureLoader

        textureLoader.load(element.content, (texture) => {
          newTextures[index] = texture
          setTextures((prev) => ({ ...prev, ...newTextures }))
        })
      }
    })
  }, [elements])

  return (
    <group>
      {elements.map((element, index) => {
        if (element.type === "text") {
          return (
            <group key={index} position={[0, 0, 0.51]}>
              <mesh>
                <planeGeometry args={[1, 0.3]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.01} />
              </mesh>
              <Html position={[0, 0, 0.01]} transform scale={0.1} zIndexRange={[100, 0]}>
                <div
                  style={{
                    color: element.color || "#000000",
                    fontSize: `${element.fontSize || 24}px`,
                    fontFamily: element.fontFamily || "Arial",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    width: "500px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {element.content}
                </div>
              </Html>
            </group>
          )
        } else if (element.type === "image" && textures[index]) {
          return (
            <mesh key={index} position={[0, 0, 0.51]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshBasicMaterial map={textures[index]} transparent />
            </mesh>
          )
        } else if (element.type === "shape") {
          return (
            <mesh key={index} position={[0, 0, 0.51]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshBasicMaterial color={element.color || "#ff0000"} transparent opacity={0.8} />
            </mesh>
          )
        } else {
          return null
        }
      })}
    </group>
  )
}

export default function ProductCanvas({
  product,
  designElements,
}: {
  product: ProductType
  designElements: any[]
}) {
  return (
    <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Suspense fallback={null}>
        <PlaceholderProduct product={product} />
        <DesignElements elements={designElements} product={product} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={1.5} far={4} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
