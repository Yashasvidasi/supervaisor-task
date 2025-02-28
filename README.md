

## Overview

This repository contains a data structure for representing a hierarchical flow chart with relationships between nodes. The structure is designed to model a multi-step process (like a project lifecycle) with nodes, sub-nodes, and various types of relationships between them.

## Data Structure

The flow chart data is organized into a `FlowData` object that contains two main components:

1. **Steps**: Represents the major phases or stages in a process
2. **Attachments**: Represents the relationships between nodes across different steps

### Core Types

#### `FlowData`

The main container for all flow chart data.

```typescript
interface FlowData {
  steps: Step[]
  attachments: Attachment[]
}
```


#### `Step`

Represents a major phase or stage in the process.

```typescript
interface Step {
  id: string
  name: string
  nodes: Node[]
}
```


#### `Node`

Represents an individual item or task within a step. Nodes can contain sub-nodes for hierarchical organization.

```typescript
interface Node {
  id: string
  label: string
  description?: string
  color?: string
  subNodes?: Node[]
}
```


#### `Attachment`

Defines a relationship between two nodes.

```typescript
interface Attachment {
  id: string
  sourceNodeId: string
  targetNodeId: string
  relationship: Relationship
}
```


#### `Relationship`

Defines the type of relationship between nodes.

```typescript
type Relationship = "depends_on" | "triggers" | "references" | "parent" | "contains" | "custom" | string
```


## Relationship Types

The system supports several types of relationships between nodes:

- **depends_on**: Indicates that one node depends on another (orange color)
- **triggers**: Indicates that one node triggers or activates another (green color)
- **references**: Indicates that one node references another (blue color)
- **parent**: Represents a parent-child relationship (gray color)
- **contains**: Represents a containment relationship (dashed gray line)
- **custom**: Allows for custom relationship types


## Example Data Structure

The provided initial data represents a simplified software development lifecycle with three main steps:

1. **Planning**
    - Requirements (with sub-nodes: User Stories, Acceptance Criteria)
    - Design (with sub-node: UI/UX)
2. **Development**
    - Frontend (with sub-node: React Components)
    - Backend
3. **Testing**
    - Unit Tests
    - Integration Tests

The relationships between these nodes are defined as:

- Requirements **depends_on** Frontend
- Design **triggers** Frontend
- Frontend **references** Unit Tests


## Visual Representation

When rendered, the flow chart will display:

- Steps as separate sections or columns
- Nodes as boxes with their labels and descriptions
- Sub-nodes as nested boxes within their parent nodes
- Relationships as colored lines connecting nodes:
    - Orange lines for "depends_on" relationships
    - Green lines for "triggers" relationships
    - Blue lines for "references" relationships


## Usage

This data structure can be used with visualization libraries like ReactFlow to create interactive flow charts. The structure allows for:

1. Hierarchical organization of processes
2. Clear visualization of dependencies and relationships
3. Flexible customization of node appearances
4. Easy extension with additional relationship types

## Implementation Notes

- Each node, step, and attachment must have a unique ID
- Node colors are defined using hex color codes
- The structure supports unlimited nesting of sub-nodes
- Relationships can span across different steps


## Extending the Structure

The data structure can be extended by:

1. Adding additional properties to nodes for more metadata
2. Creating new relationship types
3. Adding more steps to represent a more complex process
4. Implementing filtering or grouping mechanisms based on node properties
