"use client"

import type React from "react"
import { useState } from "react"
import type { Node as FlowNode } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textArea"

/**
 * Props for the NodeForm component.
 * @param initialValues - Optional initial values for pre-filling the form when editing a node.
 * @param onSubmit - Callback function triggered when the form is submitted.
 * @param buttonText - Text to display on the submit button.
 */
interface NodeFormProps {
  initialValues?: Partial<FlowNode>
  onSubmit: (node: FlowNode) => void
  buttonText: string
}

/**
 * NodeForm Component
 * A form for creating or editing a node in the flowchart.
 */
export default function NodeForm({ initialValues, onSubmit, buttonText }: NodeFormProps) {
  // State for managing form fields
  const [label, setLabel] = useState(initialValues?.label || "")
  const [description, setDescription] = useState(initialValues?.description || "")
  const [color, setColor] = useState(initialValues?.color || "#4f46e5")

  /**
   * Handles form submission, constructs a node object, and triggers the onSubmit callback.
   * @param e - Form event to prevent default submission behavior.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const node: FlowNode = {
      id: initialValues?.id || `node-${Date.now()}`, // Generate an ID if not editing
      label,
      description,
      color,
      subNodes: initialValues?.subNodes || [],
    }

    onSubmit(node)

    // Clear form fields if it's a new node creation (not an edit)
    if (!initialValues?.id) {
      setLabel("")
      setDescription("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Input field for node label */}
      <div>
        <Label htmlFor="node-label">Label</Label>
        <Input
          id="node-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Node label"
          required
        />
      </div>

      {/* Input field for node description */}
      <div>
        <Label htmlFor="node-description">Description</Label>
        <Textarea
          id="node-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Node description"
          rows={3}
        />
      </div>

      {/* Color picker input for node color */}
      <div>
        <Label htmlFor="node-color">Color</Label>
        <div className="flex gap-2">
          {/* Color selection input */}
          <Input
            id="node-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 p-1"
          />
          {/* Hex code input field for manually entering color */}
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#RRGGBB"
            className="flex-1"
          />
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  )
}
