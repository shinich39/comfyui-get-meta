"use strict";

export function parseWorkflow(workflow, prompt) {
  const result = [];

  // Get Notes from workflow
  if (Array.isArray(workflow?.nodes)) {
    for (const node of workflow.nodes) {
      try {
        if (node.type !== "Note") {
          continue;
        }
        const id = node.id;
        const type = node.type;
        const values = {
          "text": node.widgets_values[0],
        }
        const title = node.title || LiteGraph.registered_node_types[type]?.title;
        result.push({
          id,
          title,
          type,
          values,
        });
      } catch(err) {
        console.error(err);
      }
    }  
  }

  // Get nods from prompt
  if (typeof prompt === "object") {
    for (const [key, value] of  Object.entries(prompt)) {
      try {
        const id = parseInt(key);
        const type = value.class_type;
        const values = value.inputs;
        const node = workflow?.nodes.find(n => n.id == id);
        const title = node?.title || LiteGraph.registered_node_types[type]?.title;
        result.push({
          id,
          title,
          type,
          values,
        });
      } catch(err) {
        console.error(err);
      }
    }
  }

  result.sort((a, b) => a.id - b.id);

  return result;
}