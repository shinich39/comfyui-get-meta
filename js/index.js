"use strict";

import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";
import JSON5 from "./utils/json5.min.js";
import { parseWorkflow } from "./utils/workflow.js";

const PROP_KEY = "GetMeta";

const Types = {
  Meta: [
    "GetBooleanFromImage",
    "GetIntFromImage",
    "GetFloatFromImage",
    "GetStringFromImage",
    "GetComboFromImage",
    "GetNodesFromImage",
  ],
  Image: [
    "LoadImage",
    "LoadImageMask",
    "LoadImage //Inspire",
    "Load image with metadata [Crystools]",
    "Image Load", // was-node-suite-comfyui
  ],
}

async function fetchJSON(url, req) {
  const response = await api.fetchApi(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(req),
  });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

// function parsePath(filePath) {
//   return fetchJSON(`/shinich39/comfyui-get-meta/parse-path`, { path: filePath });
// }

function getMetadata(filePath) {
  return fetchJSON(`/shinich39/comfyui-get-meta/read-metadata`, { path: filePath });
}

function isSupportedNode(node) {
  if (!node || !node.comfyClass) {
    return false;
  }

  if (Types.Image.indexOf(node.comfyClass) > -1) {
    return true;
  }

  return false;
}

async function initMetaNode() {
  try {
    // check initialized
    if (this[PROP_KEY]) {
      return;
    }

    this[PROP_KEY] = {};

    this[PROP_KEY].getImageNode = (function() {
      const input = this.inputs?.find(e => e.name === "image");
      if (!input || !input.link) {
        return;
      }
      const linkId = input.link;
      const link = app.graph.links.get(linkId);
      const targetId = link.origin_id;
      const target = app.graph._nodes.find(e => e.id === targetId);
      return isSupportedNode(target) ? target : undefined;
    }).bind(this);
    
    this[PROP_KEY].getMetadata = (async function() {      
      try {
        const node = this[PROP_KEY].getImageNode();
        if (!node) {
          return;
        }
        if (node[PROP_KEY] instanceof Error) {
          return;
        } else if (typeof node[PROP_KEY] === "object") {
          return node[PROP_KEY];
        }
        const filePath = getFilePathFromImageNode(node);
        if (!filePath) {
          return;
        }

        const { 
          absPath,
          relPath,
          fullName,
          fileName,
          extName,
          dirName,
          width, 
          height, 
          info, 
          format, // "PNG"
        } = await getMetadata(filePath);

        const workflow = info?.workflow ? JSON5.parse(info.workflow) : undefined;
        const prompt = info?.prompt ? JSON5.parse(info.prompt) : undefined;

        const nodes = parseWorkflow(workflow, prompt);
        
        node[PROP_KEY] = {
          absPath,
          relPath,
          fullName,
          fileName,
          extName,
          dirName,
          width,
          height,
          nodes,
          prompt,
          workflow,
          format,
        }

        return node[PROP_KEY];
      } catch(err) {
        console.error(err);
        node[PROP_KEY] = err;
        return;
      }
    }).bind(this);

    this[PROP_KEY].update = (async function() {
      const data = await this[PROP_KEY].getMetadata();
      if (!data) {
        return;
      }

      if (this.comfyClass === "GetNodesFromImage") {
        const entries = data.nodes.reduce((acc, curr) => {
          const { 
            id,
            title,
            type,
            values,
          } = curr;

          const arr = Object.entries(values).reduce((acc, [key, value]) => {
            if (typeof value === "object" && value !== null) {
              return acc;
            }

            if (typeof value === "string") {
              value = value.replace(/\s+/g, " ");
            }

            acc.push([`#${id}.${key}`, value]);

            return acc;
          }, []);

          return acc.concat(arr);
        }, []);

        let maxQueryLength = 0;
        for (const e of entries) {
          if (maxQueryLength < e[0].length) {
            maxQueryLength = e[0].length;
          }
        }

        maxQueryLength += 1;

        for (const e of entries) {
          e[0] = e[0].padEnd(maxQueryLength, " ");
        }

        this.widgets[0].value = entries.map((item) => item.join(": ")).join("\n");

        return;
      }

      const queryWidget = this.widgets[0];
      const valueWidget = this.widgets[1];

      if (queryWidget.value === "PATH" || queryWidget.value === "REL_PATH") {
        valueWidget.value = data?.relPath;
      } else if ( queryWidget.value === "ABS_PATH") {
        valueWidget.value = data?.absPath;
      } else if (queryWidget.value === "FULL_NAME") {
        valueWidget.value = data?.fullName;
      } else if (queryWidget.value === "DIR_NAME") {
        valueWidget.value = data?.dirName;
      } else if (queryWidget.value === "FILE_NAME") {
        valueWidget.value = data?.fileName;
      } else if (queryWidget.value === "EXT_NAME") {
        valueWidget.value = data?.extName.replace(".", "");
      } else if (queryWidget.value === "WIDTH") {
        valueWidget.value = data?.width;
      } else if (queryWidget.value === "HEIGHT") {
        valueWidget.value = data?.height;
      } else {
        const queryValue = queryWidget.value.split(".");
        const nodeName = queryValue.slice(0, queryValue.length - 1).join(".");
        const widgetName = queryValue.slice(queryValue.length - 1).join(".") || ""; // Note.

        // check node index
        let target;
        if (/\[([0-9]+)\]$/.test(nodeName)) {
          target = findNode(
            data.nodes,
            nodeName.replace(/\[([0-9]+)\]$/, ""), 
            parseInt(/\[([0-9]+)\]$/.exec(nodeName).pop())
          );
        } else {
          target = findNode(data.nodes, nodeName, 0);
        }
        
        // set value
        if (target && target.values[widgetName]) {
          if (this.comfyClass === "GetBooleanFromImage") {
            valueWidget.value = Boolean(target.values[widgetName]);
          } else {
            valueWidget.value = target.values[widgetName];
          }
        }
      }
    }).bind(this);

    // prevent update during initialization
    setTimeout(() => {
      this.onConnectionsChange = function() {

        const imageNode = this[PROP_KEY].getImageNode();
        if (!imageNode) {
          return;
        }

        clearCache(imageNode);
        updateMetaNodes();

      }
    }, 1024);

  } catch(err) {
    console.error(err);
  }
}

function initImageNode() {
  const self = this;

  // intercept change image callback
  const setCallback = function(widget) {
    if (!widget) {
      return;
    }
    const orig = widget.callback;
    widget.callback = function () {
      const r = orig ? orig.apply(this, arguments) : undefined;

      // update path nodes when image loader path changed
      clearCache(self);
      updateMetaNodes();
      
      return r;
    }
  }

  // prevent send callback during initialization
  setTimeout(() => {
    switch(this.comfyClass) {
      // core
      case "LoadImage":
      case "LoadImageMask":
        setCallback(this.widgets?.find(e => e.name === "image"));
        break;
      // ComfyUI-Inspire-Pack
      case "LoadImage //Inspire": 
        setCallback(this.widgets?.find(e => e.name === "image"));
        break;
      // ComfyUI-Crystools
      case "Load image with metadata [Crystools]":
        setCallback(this.widgets?.find(e => e.name === "image"));
        break;
      // WAS Node Suite
      case "Image Load": 
        setCallback(this.widgets?.find(e => e.name === "image_path"));
        break;
    }
  }, 1024);
}

function getFilePathFromImageNode(node) {
  if (node && node.widgets) {
    let prefix, suffix;
    switch(node.comfyClass) {
      // core
      case "LoadImage":
      case "LoadImageMask": 
        prefix = "ComfyUI/input";
        suffix = node.widgets.find(e => e.name === "image")?.value;
        break;
      // ComfyUI-Inspire-Pack
      case "LoadImage //Inspire": 
        prefix = "ComfyUI/input";
        suffix = node.widgets.find(e => e.name === "image")?.value;
        break;
      // ComfyUI-Crystools
      case "Load image with metadata [Crystools]": 
        prefix = "ComfyUI/input";
        suffix = node.widgets.find(e => e.name === "image")?.value;
        break;
      // WAS Node Suite
      case "Image Load": 
        suffix = node.widgets.find(e => e.name === "image_path")?.value;
        break;
    }
    if (prefix && suffix) {
      return `${prefix}/${suffix}`.replace(/[\\/]+/g, "/");
    } else if (suffix) {
      return suffix.replace(/[\\/]+/g, "/");;
    }
  }
}

/**
 * id > title > type
 */
function matchNode(n, q) {
  if (!n || !q) {
    return false;
  }

  const idMatch = q.match(/^#([0-9]+)$/);
  if (idMatch) {
    return n.id && n.id == idMatch[1];
  }

  if (n.title && n.title === q) {
    return true;
  }

  if (n.type && n.type === q) {
    return true;
  }

  return false;
}

function findNode(nodes, query, index, reverse) {
  if (!index) {
    index = 0;
  }
  let count = 0;
  if (!reverse) {
    for (let i = 0; i < nodes.length; i++) {
      if (matchNode(nodes[i], query)) {
        if (count === index) {
          return nodes[i];
        } else {
          count++;
        }
      }
    }
  } else {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (matchNode(nodes[i], query)) {
        if (count === index) {
          return nodes[i];
        } else {
          count++;
        }
      }
    }
  }
}

function clearCache(node) {
  if (node && node[PROP_KEY]) {
    delete node[PROP_KEY];
  }
}

function clearCaches() {
  for (const node of app.graph._nodes) {
    if (Types.Image.indexOf(node.comfyClass) > -1) {
      clearCache(node);
    }
  }
}

async function updateMetaNodes() {
  for (const node of app.graph._nodes) {
    if (Types.Meta.indexOf(node.comfyClass) > -1) {
      try {
        await node[PROP_KEY].update();
      } catch(err) {
        console.error(err);
      }
    }
  }
}

app.registerExtension({
	name: `shinich39.GetMeta`,
  setup() {

    api.addEventListener("promptQueued", async function() {
      clearCaches();
      await updateMetaNodes();
      // console.log("[comfyui-get-meta] updated.");
    });

    console.log("[comfyui-get-meta] initialized");
  },
  nodeCreated(node) {
    if (Types.Meta.indexOf(node.comfyClass) > -1) {
      initMetaNode.apply(node);
    } else if (Types.Image.indexOf(node.comfyClass) > -1) {
      initImageNode.apply(node);
    }
  },
});