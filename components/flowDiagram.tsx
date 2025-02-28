"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Save } from "lucide-react"
import CustomNode from "@/components/customNode"

// Define custom node types used in the flowchart
const nodeTypes: NodeTypes = {
  customNode: CustomNode,
}

// Initial set of nodes for the flowchart
const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 250, y: 100 },
    data: { label: "Start Process", type: "start" },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 250, y: 250 },
    data: { label: "Process Data", type: "process" },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 250, y: 400 },
    data: { label: "End Process", type: "end" },
  },
]

// Initial edges representing connections between nodes
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
]

/**
 * FlowDiagram Component
 * Manages the flowchart state, including nodes, edges, and interactions like adding, deleting, and saving nodes.
 */
export default function FlowDiagram() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // State for managing nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // State for tracking selected node and its label
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [nodeName, setNodeName] = useState("")

  /**
   * Handles new connections between nodes.
   * Updates edges state when a connection is made.
   */
  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  /**
   * Adds a new node to the flowchart at a random position.
   */
  const onAddNode = useCallback(() => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "customNode",
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: `New Node ${nodes.length + 1}`,
        type: "process",
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }, [nodes, setNodes])

  /**
   * Deletes the currently selected node along with any associated edges.
   */
  const onDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode))
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode && edge.target !== selectedNode,
        ),
      )
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  /**
   * Handles node selection and updates the selected node state.
   * @param _ - Mouse event (not used)
   * @param node - The clicked node object
   */
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node.id)
    setNodeName(node.data.label)
  }, [])

  /**
   * Saves the current state of the flowchart (nodes and edges) to local storage.
   */
  const onSave = useCallback(() => {
    if (typeof window !== "undefined") {
      const flow = {
        nodes,
        edges,
      }
      localStorage.setItem("flowState", JSON.stringify(flow))
      alert("Flow saved successfully!")
    }
  }, [nodes, edges])

  return (
    <ReactFlowProvider>
      <div className="h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          {/* Background grid */}
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />

          {/* Top-right control panel */}
          <Panel position="top-right" className="flex gap-2">
            <Button onClick={onAddNode} size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Node
            </Button>
            <Button
              onClick={onDeleteNode}
              size="sm"
              variant="destructive"
              disabled={!selectedNode}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button onClick={onSave} size="sm" variant="outline" className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
