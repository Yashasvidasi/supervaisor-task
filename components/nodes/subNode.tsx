"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { Node as FlowNode } from "@/lib/types"

/**
 * This file defines the SubNode component, a specialized node used in React Flow.
 * A SubNode represents a child element in a hierarchical structure, with a dashed border and more transparency.
 */

interface SubNodeData extends FlowNode {
  parentId: string 
  stepId: string   
  isSelected: boolean 
}

/**
 * SubNode Component
 * Represents a visually distinct sub-node within the flowchart.
 * It includes a label, optional description, and input/output handles.
 */
function SubNode({ data }: NodeProps<SubNodeData>) {
  const { label, description, color, isSelected } = data

  return (
    <div
      className={`px-3 py-1 rounded-md border-2 shadow-sm min-w-[150px] transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary ring-opacity-70" : ""
      }`}
      style={{
        backgroundColor: `${color}15`,
        borderColor: color,
        borderStyle: "dashed",
      }}
    >
      {/* Top handle for incoming connections */}
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      {/* Node label, styled with the specified color */}
      <div className="font-medium text-sm text-center" style={{ color }}>
        {label}
      </div>

      {/* Optional description, truncated to one line for compact display */}
      {description && <div className="text-xs mt-1 text-gray-600 line-clamp-1">{description}</div>}

      {/* Bottom handle for outgoing connections */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
}

export default memo(SubNode)
