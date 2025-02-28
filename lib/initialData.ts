import type { FlowData } from "@/lib/types"

// Initial data for the flow chart
export const initialData: FlowData = {
  steps: [
    {
      id: "step-1",
      name: "Planning",
      nodes: [
        {
          id: "node-1",
          label: "Requirements",
          description: "Gather project requirements",
          color: "#4f46e5",
          subNodes: [
            {
              id: "subnode-1",
              label: "User Stories",
              description: "Define user stories",
              color: "#4f46e5",
            },
            {
              id: "subnode-2",
              label: "Acceptance Criteria",
              description: "Define acceptance criteria",
              color: "#4f46e5",
            },
          ],
        },
        {
          id: "node-2",
          label: "Design",
          description: "Create project design",
          color: "#7c3aed",
          subNodes: [
            {
              id: "subnode-3",
              label: "UI/UX",
              description: "Design user interface",
              color: "#7c3aed",
            },
          ],
        },
      ],
    },
    {
      id: "step-2",
      name: "Development",
      nodes: [
        {
          id: "node-3",
          label: "Frontend",
          description: "Develop frontend components",
          color: "#0ea5e9",
          subNodes: [
            {
              id: "subnode-4",
              label: "React Components",
              description: "Build React components",
              color: "#0ea5e9",
            },
          ],
        },
        {
          id: "node-4",
          label: "Backend",
          description: "Develop backend services",
          color: "#10b981",
          subNodes: [],
        },
      ],
    },
    {
      id: "step-3",
      name: "Testing",
      nodes: [
        {
          id: "node-5",
          label: "Unit Tests",
          description: "Write and run unit tests",
          color: "#f59e0b",
          subNodes: [],
        },
        {
          id: "node-6",
          label: "Integration Tests",
          description: "Write and run integration tests",
          color: "#ef4444",
          subNodes: [],
        },
      ],
    },
  ],
  attachments: [
    {
      id: "attachment-1",
      sourceNodeId: "node-1",
      targetNodeId: "node-3",
      relationship: "depends_on",
    },
    {
      id: "attachment-2",
      sourceNodeId: "node-2",
      targetNodeId: "node-3",
      relationship: "triggers",
    },
    {
      id: "attachment-3",
      sourceNodeId: "node-3",
      targetNodeId: "node-5",
      relationship: "references",
    },
  ],
}

