"use client"

import type React from "react"

import { useState } from "react"
import type { FlowData, Relationship } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RelationshipFormProps {
  flowData: FlowData
  onCreateAttachment: (sourceNodeId: string, targetNodeId: string, relationship: Relationship) => void
}

export default function RelationshipForm({ flowData, onCreateAttachment }: RelationshipFormProps) {
  const [sourceNodeId, setSourceNodeId] = useState("")
  const [targetNodeId, setTargetNodeId] = useState("")
  const [relationship, setRelationship] = useState<Relationship>("depends_on")
  const [customRelationship, setCustomRelationship] = useState("")

  // Get all nodes from all steps (flattened)
  const getAllNodes = () => {
    const allNodes: { id: string; label: string; stepName: string; isSubNode: boolean }[] = []

    flowData.steps.forEach((step) => {
      step.nodes.forEach((node) => {
        allNodes.push({
          id: node.id,
          label: node.label,
          stepName: step.name,
          isSubNode: false,
        })

        if (node.subNodes) {
          node.subNodes.forEach((subNode) => {
            allNodes.push({
              id: subNode.id,
              label: subNode.label,
              stepName: step.name,
              isSubNode: true,
            })
          })
        }
      })
    })

    return allNodes
  }

  const allNodes = getAllNodes()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let finalRelationship: Relationship = relationship
    if (relationship === "custom" && customRelationship.trim()) {
      finalRelationship = customRelationship.trim() as Relationship
    }

    onCreateAttachment(sourceNodeId, targetNodeId, finalRelationship)

    // Reset form
    setSourceNodeId("")
    setTargetNodeId("")
    setRelationship("depends_on")
    setCustomRelationship("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="source-node">Source Node</Label>
        <Select value={sourceNodeId} onValueChange={setSourceNodeId} required>
          <SelectTrigger id="source-node">
            <SelectValue placeholder="Select source node" />
          </SelectTrigger>
          <SelectContent>
            {allNodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.label} ({node.stepName}
                {node.isSubNode ? ", sub-node" : ""})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="target-node">Target Node</Label>
        <Select value={targetNodeId} onValueChange={setTargetNodeId} required>
          <SelectTrigger id="target-node">
            <SelectValue placeholder="Select target node" />
          </SelectTrigger>
          <SelectContent>
            {allNodes
              .filter((node) => node.id !== sourceNodeId)
              .map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.label} ({node.stepName}
                  {node.isSubNode ? ", sub-node" : ""})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="relationship">Relationship Type</Label>
        <Select value={relationship} onValueChange={setRelationship} required>
          <SelectTrigger id="relationship">
            <SelectValue placeholder="Select relationship type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="depends_on">Depends On</SelectItem>
            <SelectItem value="triggers">Triggers</SelectItem>
            <SelectItem value="references">References</SelectItem>
            <SelectItem value="custom">Custom...</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {relationship === "custom" && (
        <div>
          <Label htmlFor="custom-relationship">Custom Relationship</Label>
          <Input
            id="custom-relationship"
            value={customRelationship}
            onChange={(e) => setCustomRelationship(e.target.value)}
            placeholder="Enter custom relationship"
            required={relationship === "custom"}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!sourceNodeId || !targetNodeId}>
        Create Relationship
      </Button>
    </form>
  )
}

