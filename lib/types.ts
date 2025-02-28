export type Relationship = "depends_on" | "triggers" | "references" | "parent" | "contains" | "custom" | string

// Node type
export interface Node {
  id: string
  label: string
  description?: string
  color?: string
  subNodes?: Node[]
}

// Step type
export interface Step {
  id: string
  name: string
  nodes: Node[]
}

// Attachment type (relationship between nodes)
export interface Attachment {
  id: string
  sourceNodeId: string
  targetNodeId: string
  relationship: Relationship
}

// Main flow data structure
export interface FlowData {
  steps: Step[]
  attachments: Attachment[]
}

