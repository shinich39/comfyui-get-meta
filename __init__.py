"""
@author: shinich39
@title: comfyui-get-meta
@nickname: comfyui-get-meta
@version: 1.0.1
@description: Get metadata from image.
"""

from .py import api
from .nodes import *

NODE_CLASS_MAPPINGS = {
  "GetBooleanFromImage": GetBooleanFromImage,
  "GetIntFromImage": GetIntFromImage,
  "GetFloatFromImage": GetFloatFromImage,
  "GetStringFromImage": GetStringFromImage,
  "GetComboFromImage": GetComboFromImage,
  "GetValuesFromImage": GetValuesFromImage,
  "GetWorkflowFromImage": GetWorkflowFromImage,
  "GetPromptFromImage": GetPromptFromImage,
}

NODE_DISPLAY_NAME_MAPPINGS = {
  "GetBooleanFromImage": "Get Boolean from Image",
  "GetIntFromImage": "Get Int from Image",
  "GetFloatFromImage": "Get Float from Image",
  "GetStringFromImage": "Get String from Image",
  "GetComboFromImage": "Get Combo from Image",
  "GetValuesFromImage": "Get Values from Image", # for debugging
  "GetWorkflowFromImage": "Get Workflow from Image",
  "GetPromptFromImage": "Get Prompt from Image",
}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]