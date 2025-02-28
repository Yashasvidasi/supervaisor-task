"use client"

import { useState } from "react"
import type { FlowData, Node as FlowNode, Relationship } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, FileJson } from "lucide-react"
import NodeForm from "@/components/nodeForm"
import RelationshipForm from "@/components/relationshipForm"

interface SidebarProps {
  flowData: FlowData
  selectedStep: string | null
  selectedNode: string | null
  onSelectStep: (stepId: string | null) => void
  onSelectNode: (nodeId: string | null) => void
  onAddStep: (name: string) => void
  onAddNode: (stepId: string, node: FlowNode) => void
  onAddSubNode: (stepId: string, parentId: string, subNode: FlowNode) => void
  onCreateAttachment: (sourceNodeId: string, targetNodeId: string, relationship: Relationship) => void
  onDeleteNode: (stepId: string, nodeId: string) => void
  onUpdateNode: (stepId: string, nodeId: string, updates: Partial<FlowNode>) => void
  onClearFlowChart: () => void
}

export default function Sidebar({
  flowData,
  selectedStep,
  selectedNode,
  onSelectStep,
  onSelectNode,
  onAddStep,
  onAddNode,
  onAddSubNode,
  onCreateAttachment,
  onDeleteNode,
  onUpdateNode,
  onClearFlowChart,
}: SidebarProps) {
  const [newStepName, setNewStepName] = useState("")
  const [activeTab, setActiveTab] = useState("steps")

  // Find selected node and its step
  const findNodeAndStep = (nodeId: string) => {
    for (const step of flowData.steps) {
      // Check main nodes
      const node = step.nodes.find((n) => n.id === nodeId)
      if (node) {
        return { node, step }
      }

      // Check sub-nodes
      for (const parentNode of step.nodes) {
        if (parentNode.subNodes) {
          const subNode = parentNode.subNodes.find((sn) => sn.id === nodeId)
          if (subNode) {
            return { node: subNode, step, parentNode }
          }
        }
      }
    }
    return { node: null, step: null }
  }

  const selectedNodeInfo = selectedNode ? findNodeAndStep(selectedNode) : { node: null, step: null }

  // Handle adding a new step
  const handleAddStep = () => {
    if (newStepName.trim()) {
      onAddStep(newStepName)
      setNewStepName("")
    }
  }

  // Handle adding a new node to a step
  const handleAddNode = (stepId: string, node: FlowNode) => {
    onAddNode(stepId, node)
  }

  // Handle adding a sub-node to a parent node
  const handleAddSubNode = (stepId: string, parentId: string, subNode: FlowNode) => {
    onAddSubNode(stepId, parentId, subNode)
  }

  // Export flow data as JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(flowData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `flow-chart-data-${new Date().toISOString()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="w-80 h-full border-r bg-background p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Flow Chart Builder</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
        </TabsList>

        {/* Steps Tab */}
        <TabsContent value="steps" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-step">Add New Step</Label>
            <div className="flex gap-2">
              <Input
                id="new-step"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="Step name"
              />
              <Button onClick={handleAddStep} size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            <Accordion type="single" collapsible className="w-full">
              {flowData.steps.map((step) => (
                <AccordionItem key={step.id} value={step.id}>
                  <AccordionTrigger className="text-sm">
                    {step.name} ({step.nodes.length} nodes)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 space-y-2">
                      {step.nodes.map((node) => (
                        <div key={node.id} className="text-sm">
                          <button
                            className={`text-left w-full p-1 rounded hover:bg-accent ${
                              selectedNode === node.id ? "bg-accent" : ""
                            }`}
                            onClick={() => onSelectNode(node.id)}
                          >
                            {node.label}
                            {node.subNodes && node.subNodes.length > 0 && ` (${node.subNodes.length} sub-nodes)`}
                          </button>

                          {node.subNodes && node.subNodes.length > 0 && (
                            <div className="pl-4 mt-1 space-y-1">
                              {node.subNodes.map((subNode) => (
                                <button
                                  key={subNode.id}
                                  className={`text-left w-full p-1 rounded hover:bg-accent ${
                                    selectedNode === subNode.id ? "bg-accent" : ""
                                  }`}
                                  onClick={() => onSelectNode(subNode.id)}
                                >
                                  {subNode.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        {/* Nodes Tab */}
        <TabsContent value="nodes" className="space-y-4">
          <div className="space-y-2">
            <Label>Add Node</Label>
            <Select onValueChange={(value) => onSelectStep(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a step" />
              </SelectTrigger>
              <SelectContent>
                {flowData.steps.map((step) => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStep && <NodeForm onSubmit={(node) => handleAddNode(selectedStep, node)} buttonText="Add Node" />}
          </div>

          {selectedNode && selectedNodeInfo.node && selectedNodeInfo.step && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label>Selected Node</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteNode(selectedNodeInfo.step!.id, selectedNode)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

              <NodeForm
                initialValues={selectedNodeInfo.node}
                onSubmit={(updates) => onUpdateNode(selectedNodeInfo.step!.id, selectedNode, updates)}
                buttonText="Update Node"
              />

              {/* Add sub-node form if this is a main node */}
              {!selectedNodeInfo.parentNode && (
                <div className="border-t pt-4 mt-4">
                  <Label className="mb-2 block">Add Sub-Node</Label>
                  <NodeForm
                    onSubmit={(subNode) => handleAddSubNode(selectedNodeInfo.step!.id, selectedNode, subNode)}
                    buttonText="Add Sub-Node"
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relations" className="space-y-4">
          <RelationshipForm flowData={flowData} onCreateAttachment={onCreateAttachment} />

          <div className="space-y-2 mt-4">
            <Label>Existing Attachments</Label>
            <div className="space-y-1">
              {flowData.attachments.map((attachment) => {
                // Find source and target nodes to display their labels
                const sourceInfo = findNodeAndStep(attachment.sourceNodeId)
                const targetInfo = findNodeAndStep(attachment.targetNodeId)

                return (
                  <div key={attachment.id} className="text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">From:</span> {sourceInfo.node?.label || attachment.sourceNodeId}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {targetInfo.node?.label || attachment.targetNodeId}
                    </div>
                    <div>
                      <span className="font-medium">Relationship:</span> {attachment.relationship}
                    </div>
                  </div>
                )
              })}

              {flowData.attachments.length === 0 && (
                <div className="text-sm text-muted-foreground">No attachments created yet</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 space-y-2 border-t pt-4">
        <Button onClick={handleExportJson} variant="outline" className="w-full">
          <FileJson className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={onClearFlowChart} variant="destructive" className="w-full">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Flow Chart
        </Button>
      </div>
    </div>
  )
}

