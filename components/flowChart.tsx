"use client"

import type React from "react"
import { useCallback, useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
  type NodeTypes,
  type EdgeTypes,
  type Connection,
  addEdge,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import type { FlowData } from "@/lib/types"
import SubNode from "@/components/nodes/subNode"
import stepNode from "./nodes/stepNode"
import standardNode from "./nodes/standardNode"
import customEdge from "./edges/customEdge"

/**
 * FlowChart Component
 *
 * This component renders an interactive flowchart using React Flow.
 * It processes structured flow data and dynamically generates nodes and edges.
 */

interface FlowChartProps {
  flowData: FlowData
  selectedNode: string | null
  onSelectNode: (nodeId: string | null) => void
}

// Define custom node types for React Flow
const nodeTypes: NodeTypes = {
  stepNode: stepNode,
  standardNode: standardNode,
  subNode: SubNode,
}

// Define custom edge types for React Flow
const edgeTypes: EdgeTypes = {
  customEdge: customEdge,
}

export default function FlowChart({ flowData, selectedNode, onSelectNode }: FlowChartProps) {
  /**
   * Converts flowData into React Flow nodes and edges.
   */
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: ReactFlowNode[] = []
    const edges: ReactFlowEdge[] = []

    // Layout settings
    let stepX = 0
    const stepWidth = 300
    const stepGap = 100

    // Generate nodes and edges from flowData
    flowData.steps.forEach((step) => {
      const stepNodeId = `step-${step.id}`

      // Add step node
      nodes.push({
        id: stepNodeId,
        type: "stepNode",
        position: { x: stepX, y: 0 },
        data: { label: step.name, stepId: step.id },
        style: { width: stepWidth },
      })

      // Add standard nodes and their sub-nodes
      step.nodes.forEach((node, nodeIndex) => {
        const nodeY = (nodeIndex + 1) * 120

        // Add standard node
        nodes.push({
          id: node.id,
          type: "standardNode",
          position: { x: stepX + 50, y: nodeY },
          data: {
            ...node,
            stepId: step.id,
            isSelected: node.id === selectedNode,
          },
        })

        // Edge connecting step to standard node
        edges.push({
          id: `edge-step-${step.id}-to-${node.id}`,
          source: stepNodeId,
          target: node.id,
          type: "customEdge",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: { relationship: "contains" },
        })

        // Add sub-nodes if they exist
        node.subNodes?.forEach((subNode, subIndex) => {
          const subNodeX = stepX + 150
          const subNodeY = nodeY + (subIndex + 1) * 80

          nodes.push({
            id: subNode.id,
            type: "subNode",
            position: { x: subNodeX, y: subNodeY },
            data: {
              ...subNode,
              parentId: node.id,
              stepId: step.id,
              isSelected: subNode.id === selectedNode,
            },
          })

          // Edge connecting parent node to sub-node
          edges.push({
            id: `edge-${node.id}-to-${subNode.id}`,
            source: node.id,
            target: subNode.id,
            type: "customEdge",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            data: { relationship: "parent" },
          })
        })
      })

      stepX += stepWidth + stepGap
    })

    // Add attachment edges
    flowData.attachments.forEach((attachment) => {
      edges.push({
        id: `attachment-${attachment.id}`,
        source: attachment.sourceNodeId,
        target: attachment.targetNodeId,
        type: "customEdge",
        animated: true,
        style: { strokeWidth: 2, stroke: "#ff9900" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#ff9900",
        },
        data: { relationship: attachment.relationship },
      })
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [flowData, selectedNode])

  // React Flow state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes and edges when flowData changes
  useMemo(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  /**
   * Handles node click event to select a node.
   */
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: ReactFlowNode) => {
      onSelectNode(node.id)
    },
    [onSelectNode]
  )

  /**
   * Handles new connections between nodes.
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "customEdge",
            animated: true,
            data: { relationship: "custom" },
          },
          eds
        )
      )
    },
    [setEdges]
  )

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#aaa" gap={16} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
