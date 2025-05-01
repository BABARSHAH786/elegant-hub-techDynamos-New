import { create } from "zustand"
import { nanoid } from "nanoid"
import type { DesignElement, Position, Size } from "@/types/editor"

interface HistoryState {
  past: DesignElement[][]
  future: DesignElement[][]
}

interface DesignState {
  elements: DesignElement[]
  selectedElementId: string | null
  canvasSize: { width: number; height: number }
  zoom: number
  panOffset: { x: number; y: number }
  history: HistoryState

  // Actions
  addElement: (element: Omit<DesignElement, "id">) => void
  setSelectedElement: (id: string | null) => void
  updateElementPosition: (id: string, position: Position) => void
  updateElementSize: (id: string, size: Size) => void
  updateElementRotation: (id: string, rotation: number) => void
  updateElementStyle: (id: string, style: Record<string, any>) => void
  updateElementContent: (id: string, content: string) => void
  deleteElement: (id: string) => void
  setCanvasSize: (size: { width: number; height: number }) => void
  setZoom: (zoom: number) => void
  setPanOffset: (offset: { x: number; y: number }) => void
  undo: () => void
  redo: () => void
}

const saveToLocalStorage = (elements: DesignElement[], canvasSize: { width: number; height: number }) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("designElements", JSON.stringify(elements))
      localStorage.setItem("canvasSize", JSON.stringify(canvasSize))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }
}

export const useDesignStore = create<DesignState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  canvasSize: { width: 800, height: 600 },
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  history: {
    past: [],
    future: [],
  },

  addElement: (element) =>
    set((state) => {
      const newElement = { ...element, id: nanoid() }
      const newElements = [...state.elements, newElement]

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        selectedElementId: newElement.id,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  setSelectedElement: (id) => set({ selectedElementId: id }),

  updateElementPosition: (id, position) =>
    set((state) => {
      const newElements = state.elements.map((el) => (el.id === id ? { ...el, position } : el))

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  updateElementSize: (id, size) =>
    set((state) => {
      const newElements = state.elements.map((el) => (el.id === id ? { ...el, size } : el))

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  updateElementRotation: (id, rotation) =>
    set((state) => {
      const newElements = state.elements.map((el) => (el.id === id ? { ...el, rotation } : el))

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  updateElementStyle: (id, style) =>
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              style: { ...el.style, ...style },
            }
          : el,
      )

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  updateElementContent: (id, content) =>
    set((state) => {
      const newElements = state.elements.map((el) => (el.id === id ? { ...el, content } : el))

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  deleteElement: (id) =>
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id)

      saveToLocalStorage(newElements, state.canvasSize)

      return {
        elements: newElements,
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        history: {
          past: [...state.history.past, state.elements],
          future: [],
        },
      }
    }),

  setCanvasSize: (size) => {
    set((state) => {
      saveToLocalStorage(state.elements, size)
      return { canvasSize: size }
    })
  },

  setZoom: (zoom) => set({ zoom }),

  setPanOffset: (panOffset) => set({ panOffset }),

  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state

      const previous = state.history.past[state.history.past.length - 1]
      const newPast = state.history.past.slice(0, -1)

      saveToLocalStorage(previous, state.canvasSize)

      return {
        elements: previous,
        history: {
          past: newPast,
          future: [state.elements, ...state.history.future],
        },
      }
    }),

  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state

      const next = state.history.future[0]
      const newFuture = state.history.future.slice(1)

      saveToLocalStorage(next, state.canvasSize)

      return {
        elements: next,
        history: {
          past: [...state.history.past, state.elements],
          future: newFuture,
        },
      }
    }),
}))
