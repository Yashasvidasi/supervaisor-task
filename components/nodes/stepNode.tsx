"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

/**
 * This file defines the StepNode component, a simple node type used in React Flow.
 * Each step node represents a labeled step in a process and has a single output handle for connections.
 */

interface StepNodeData {
  label: string 
  stepId: string
}

/**
 * StepNode Component
 * Represents a minimal step in the flowchart with a label and an output handle.
 */
function StepNode({ data }: NodeProps<StepNodeData>) {
  return (
    <div className="px-4 py-2 rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm min-w-[150px]">
      {/* Display the step label in bold and center-aligned */}
      <div className="font-bold text-center">{data.label}</div>

      {/* Bottom handle to allow outgoing connections */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export default memo(StepNode)
