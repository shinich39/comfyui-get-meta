"""
@author: shinich39
@title: comfyui-get-meta
@nickname: comfyui-get-meta
@version: 1.0.0
@description: Get metadata from image.
"""

from .py.api import *
from .nodes.meta import *

NODE_CLASS_MAPPINGS = {
  "GetBooleanFromImage": GetBooleanFromImage,
  "GetIntFromImage": GetIntFromImage,
  "GetFloatFromImage": GetFloatFromImage,
  "GetStringFromImage": GetStringFromImage,
  "GetComboFromImage": GetComboFromImage,
  "GetNodesFromImage": GetNodesFromImage,
}

NODE_DISPLAY_NAME_MAPPINGS = {
  "GetBooleanFromImage": "Get Boolean from Image",
  "GetIntFromImage": "Get Int from Image",
  "GetFloatFromImage": "Get Float from Image",
  "GetStringFromImage": "Get String from Image",
  "GetComboFromImage": "Get Combo from Image",
  "GetNodesFromImage": "Get Nodes from Image",
}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]