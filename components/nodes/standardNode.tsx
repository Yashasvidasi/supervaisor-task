"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { Node as FlowNode } from "@/lib/types"

/**
 * This file defines the structure, styling, and behavior of a standard node in the React Flow graph.
 * Each node represents an entity with a label, description, and color, and can be connected to other nodes.
 */

interface StandardNodeData extends FlowNode {
  stepId: string 
  isSelected: boolean 
}

/**
 * StandardNode Component
 * Represents a styled node in the flowchart with connection handles for linking to other nodes.
 */
function StandardNode({ data }: NodeProps<StandardNodeData>) {
  const { label, description, color, isSelected } = data

  return (
    <div
      className={`px-4 py-2 rounded-md border-2 shadow-sm min-w-[180px] transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary ring-opacity-70" : ""
      }`}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
      }}
    >
      {/* Top handle to allow incoming connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Node label, styled with the specified color */}
      <div className="font-medium text-center" style={{ color }}>
        {label}
      </div>

      {/* Optional description, truncated to two lines for readability */}
      {description && <div className="text-xs mt-1 text-gray-600 line-clamp-2">{description}</div>}

      {/* Bottom handle to allow outgoing connections */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default memo(StandardNode)
