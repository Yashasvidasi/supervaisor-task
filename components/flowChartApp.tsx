"use client"

import { useCallback, useEffect, useRef } from "react"
import { useState } from "react"
import { ReactFlowProvider } from "reactflow"
import FlowChart from "@/components/flowChart"
import Sidebar from "@/components/sidebar"
import { initialData } from "@/lib/initialData"
import type { FlowData, Step, Node as FlowNode, Attachment, Relationship } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Undo2, Redo2 } from "lucide-react"

/**
 * Main component for managing the FlowChart application.
 * Handles state management, undo/redo functionality, and local storage persistence.
 */

export default function FlowChartApp() {
  const [flowData, setFlowData] = useState<FlowData>(initialData)
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [past, setPast] = useState<FlowData[]>([])
  const [future, setFuture] = useState<FlowData[]>([])

  const isUndoRedoAction = useRef(false)


  /**
   * Load the saved flowchart data from local storage on component mount.
   */
  
  useEffect(() => {
    const savedData = localStorage.getItem("flowChartData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFlowData(parsedData.current)
        setPast([])
        setFuture( [])
      } catch (error) {
        console.error("Failed to parse saved data:", error)
      }
    }
    
  }, [])


  /**
   * Update history when `flowData` changes, ensuring undo/redo actions don't add duplicate entries.
   */

  useEffect(() => {
    if (!isUndoRedoAction.current) {
      console.log("update hua lmaooo",flowData)
      if(past.length === 0){
        setPast([flowData]);
        return
      }
      else if (past[past.length-1].attachments.length === flowData.attachments.length && past[past.length-1].steps.length === flowData.steps.length){
        return
      }
      setPast(prevPast => [...prevPast, flowData])
      setFuture([])
    }
  }, [flowData, past])

  useEffect(() => {
    localStorage.setItem("flowChartData", JSON.stringify({ current: flowData, past, future }))
    isUndoRedoAction.current = false
  }, [flowData, past, future])

  
  const undo = useCallback(() => {
    console.log(past);
    if (past.length > 1) {
      isUndoRedoAction.current = true
      const previous = past[past.length - 2]
      const newPast = past.slice(0, past.length - 1)
      console.log(newPast, previous)
      setPast(newPast)
      setFuture([flowData, ...future])
      setFlowData(previous)
    }
  }, [flowData, past, future])

  
  const redo = useCallback(() => {
    
    if (future.length > 0) {
      isUndoRedoAction.current = true
      const next = future[0]
      const newFuture = future.slice(1)
      setFuture(newFuture)
      setPast([...past, flowData])
      setFlowData(next)
    }
  }, [flowData, past, future])

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault()
        undo()
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  
  const addStep = useCallback((name: string) => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      name,
      nodes: [],
    }

    setFlowData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }))

  }, [])

  
  const addNode = useCallback((stepId: string, node: FlowNode) => {
    setFlowData((prev) => {
      const updatedSteps = prev.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            nodes: [...step.nodes, node],
          }
        }
        return step
      })

      return {
        ...prev,
        steps: updatedSteps,
      }
    })
  }, [])

  
  const addSubNode = useCallback((stepId: string, parentId: string, subNode: FlowNode) => {
    setFlowData((prev) => {
      const updatedSteps = prev.steps.map((step) => {
        if (step.id === stepId) {
          const updatedNodes = step.nodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                subNodes: [...(node.subNodes || []), subNode],
              }
            }
            return node
          })

          return {
            ...step,
            nodes: updatedNodes,
          }
        }
        return step
      })

      return {
        ...prev,
        steps: updatedSteps,
      }
    })
  }, [])

  
  const createAttachment = useCallback((sourceNodeId: string, targetNodeId: string, relationship: Relationship) => {
    const newAttachment: Attachment = {
      id: `attachment-${Date.now()}`,
      sourceNodeId,
      targetNodeId,
      relationship,
    }

    setFlowData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment],
    }))
  }, [])

  
  const deleteNode = useCallback(
    (stepId: string, nodeId: string) => {
      setFlowData((prev) => {
        
        const updatedSteps = prev.steps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              nodes: step.nodes.filter((node) => node.id !== nodeId),
            }
          }
          return step
        })

        
        const nodesToRemove = new Set<string>([nodeId])

        
        const findSubNodes = (stepId: string, nodeId: string) => {
          const step = prev.steps.find((s) => s.id === stepId)
          if (!step) return

          const node = step.nodes.find((n) => n.id === nodeId)
          if (!node || !node.subNodes) return

          node.subNodes.forEach((subNode) => {
            nodesToRemove.add(subNode.id)
            findSubNodes(stepId, subNode.id)
          })
        }

        findSubNodes(stepId, nodeId)

        
        const updatedAttachments = prev.attachments.filter(
          (attachment) => !nodesToRemove.has(attachment.sourceNodeId) && !nodesToRemove.has(attachment.targetNodeId),
        )

        return {
          ...prev,
          steps: updatedSteps,
          attachments: updatedAttachments,
        }
      })

      
      if (selectedNode === nodeId) {
        setSelectedNode(null)
      }
    },
    [selectedNode],
  )

  
  const updateNode = useCallback((stepId: string, nodeId: string, updates: Partial<FlowNode>) => {
    setFlowData((prev) => {
      const updatedSteps = prev.steps.map((step) => {
        if (step.id === stepId) {
          const updatedNodes = step.nodes.map((node) => {
            if (node.id === nodeId) {
              return { ...node, ...updates }
            }

            
            if (node.subNodes) {
              const updatedSubNodes = node.subNodes.map((subNode) =>
                subNode.id === nodeId ? { ...subNode, ...updates } : subNode,
              )

              if (updatedSubNodes.some((sn) => sn.id === nodeId)) {
                return { ...node, subNodes: updatedSubNodes }
              }
            }

            return node
          })

          return { ...step, nodes: updatedNodes }
        }
        return step
      })

      return { ...prev, steps: updatedSteps }
    })
  }, [])

  
  const clearFlowChart = useCallback(() => {
    setFlowData({
      steps: [],
      attachments: [],
    })
    setSelectedStep(null)
    setSelectedNode(null)
  }, [])


  return (
    <div className="flex h-screen">
      <Sidebar
        flowData={flowData}
        selectedStep={selectedStep}
        selectedNode={selectedNode}
        onSelectStep={setSelectedStep}
        onSelectNode={setSelectedNode}
        onAddStep={addStep}
        onAddNode={addNode}
        onAddSubNode={addSubNode}
        onCreateAttachment={createAttachment}
        onDeleteNode={deleteNode}
        onUpdateNode={updateNode}
        onClearFlowChart={clearFlowChart}
      />
      <div className="flex-1 h-full relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button onClick={undo} disabled={past.length === 1} size="sm">
            <Undo2 className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button onClick={redo} disabled={future.length === 0} size="sm">
            <Redo2 className="h-4 w-4 mr-1" />
            Redo
          </Button>
        </div>
        <ReactFlowProvider>
          <FlowChart flowData={flowData} selectedNode={selectedNode} onSelectNode={setSelectedNode} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}

