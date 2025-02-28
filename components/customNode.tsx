"use client"

import type React from "react"
import { useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Input } from "@/components/ui/input"

/**
 * This file defines the CustomNode component, a flexible and interactive node type used in React Flow.
 * CustomNode allows users to edit its label dynamically and adapts its styling based on its type.
 */

export default function CustomNode({ data, isConnectable, selected }: NodeProps) {
  // State to manage the editable label of the node
  const [label, setLabel] = useState(data.label)

  /**
   * Handles changes to the node's label input field.
   * Updates both the state and the data object to reflect the new label.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
    data.label = e.target.value
  }

  // Determine node style based on type
  let nodeStyle = "bg-white" // Default background color
  let borderStyle = "border-gray-300" // Default border color

  if (data.type === "start") {
    nodeStyle = "bg-green-50" // Light green background for start nodes
    borderStyle = "border-green-500" // Green border for start nodes
  } else if (data.type === "end") {
    nodeStyle = "bg-red-50" // Light red background for end nodes
    borderStyle = "border-red-500" // Red border for end nodes
  } else if (data.type === "process") {
    nodeStyle = "bg-blue-50" // Light blue background for process nodes
    borderStyle = "border-blue-500" // Blue border for process nodes
  }

  if (selected) {
    borderStyle = "border-primary" // Highlight border when selected
  }

  return (
    <div
      className={`px-4 py-2 rounded-md border-2 ${nodeStyle} ${borderStyle} shadow-sm min-w-[150px] transition-all duration-200 ${
        selected ? "ring-2 ring-primary ring-opacity-70" : "" // Apply a glowing ring effect if selected
      }`}
    >
      {/* Top handle for incoming connections */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3" />

      {/* Editable text input for node label */}
      <div className="text-center">
        <Input
          type="text"
          value={label}
          onChange={handleChange}
          className="text-center border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Bottom handle for outgoing connections */}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3" />
    </div>
  )
}
