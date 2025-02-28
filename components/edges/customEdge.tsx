"use client"

import { memo } from "react"
import { type EdgeProps, getBezierPath } from "reactflow"
import type { Relationship } from "@/lib/types"

/**
 * Defines the data structure for custom edge properties.
 */

interface CustomEdgeData {
  relationship: Relationship
}

/**
 * CustomEdge component for rendering edges in a React Flow graph.
 *
 * This component customizes edge styles and labels based on the type of relationship
 * between nodes. It supports different edge styles for relationships such as
 * "parent", "contains", "depends_on", "triggers", and "references".
 *
 */
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps<CustomEdgeData>) {

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  let edgeStyle = { ...style }
  let labelStyle = {}
  let labelBgStyle = {}

  /**
   * Apply different styles based on the relationship type.
   */
  if (data?.relationship === "parent") {
    edgeStyle = {
      ...edgeStyle,
      stroke: "#888888",
      strokeWidth: 1.5,
    }
  } else if (data?.relationship === "contains") {
    edgeStyle = {
      ...edgeStyle,
      stroke: "#aaaaaa",
      strokeDasharray: "5,5",
      strokeWidth: 1,
    }
  } else if (data?.relationship === "depends_on") {
    edgeStyle = {
      ...edgeStyle,
      stroke: "#ff9900",
      strokeWidth: 2,
    }
    labelStyle = { fill: "#ff9900" }
    labelBgStyle = { fill: "#fff8e6" }
  } else if (data?.relationship === "triggers") {
    edgeStyle = {
      ...edgeStyle,
      stroke: "#00cc66",
      strokeWidth: 2,
    }
    labelStyle = { fill: "#00cc66" }
    labelBgStyle = { fill: "#e6fff0" }
  } else if (data?.relationship === "references") {
    edgeStyle = {
      ...edgeStyle,
      stroke: "#3366ff",
      strokeWidth: 2,
    }
    labelStyle = { fill: "#3366ff" }
    labelBgStyle = { fill: "#e6f0ff" }
  }

  /**
   * Calculate the midpoint of the edge to position the label.
   */
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  /**
   * Display labels only for specific relationship types.
   */
  const showLabel = data?.relationship && !["parent", "contains"].includes(data.relationship)

  return (
    <>
      {/* Render the edge path with the appropriate styling */}
      <path id={id} style={edgeStyle} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />

      {/* Render a label for the edge if applicable */}
      {showLabel && (
        <g transform={`translate(${midX - 40}, ${midY - 10})`}>
          <rect width="80" height="20" rx="5" ry="5" style={labelBgStyle} className="react-flow__edge-label-bg" />
          <text
            x="40"
            y="14"
            textAnchor="middle"
            dominantBaseline="middle"
            style={labelStyle}
            className="react-flow__edge-text text-xs"
          >
            {data?.relationship}
          </text>
        </g>
      )}
    </>
  )
}

export default memo(CustomEdge)