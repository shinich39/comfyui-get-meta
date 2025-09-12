# ComfyUI-inspire-pack
class AnyType(str):
    def __ne__(self, __value: object) -> bool:
        return False

ANY_TYPE = AnyType("*")

class GetValuesFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "nodes": ("STRING", {"default": "", "multiline": True,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("STRING",)
  RETURN_NAMES = ("STRING",)

  def exec(self, **kwargs):
    return (kwargs["nodes"],)

class GetWorkflowFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "workflow": ("STRING", {"default": "", "multiline": True,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("STRING",)
  RETURN_NAMES = ("STRING",)

  def exec(self, **kwargs):
    return (kwargs["workflow"],)
  
class GetPromptFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "prompt": ("STRING", {"default": "", "multiline": True,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("STRING",)
  RETURN_NAMES = ("STRING",)

  def exec(self, **kwargs):
    return (kwargs["prompt"],)

class GetBooleanFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "query": ("STRING", {"default": "",}),
        "boolean": ("BOOLEAN", {"default": False,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("BOOLEAN",)
  RETURN_NAMES = ("BOOLEAN",)

  def exec(self, **kwargs):
    return (bool(kwargs["boolean"]),)
  
class GetIntFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "query": ("STRING", {"default": "",}),
        "int": ("INT", {"default": 0,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("INT",)
  RETURN_NAMES = ("INT",)

  def exec(self, **kwargs):
    return (int(kwargs["int"]),)
  
class GetFloatFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "query": ("STRING", {"default": "",}),
        "float": ("FLOAT", {"default": 0.00,}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("FLOAT",)
  RETURN_NAMES = ("FLOAT",)

  def exec(self, **kwargs):
    return (float(kwargs["float"]),)
  
class GetStringFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "query": ("STRING", {"default": "",}),
        "string": ("STRING", {"default": "", "multiline": True}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = ("STRING",)
  RETURN_NAMES = ("STRING",)

  def exec(self, **kwargs):
    return (str(kwargs["string"]),)

class GetComboFromImage():
  def __init__(self):
    pass

  @classmethod
  def IS_CHANGED(self, **kwargs):
    return float("NaN")

  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {
        "image": ("IMAGE",),
        "query": ("STRING", {"default": "",}),
        "combo": ("STRING", {"default": "",}),
      },
    }
  
  CATEGORY = "image"
  FUNCTION = "exec"
  RETURN_TYPES = (ANY_TYPE,)
  RETURN_NAMES = ("COMBO",)

  def exec(self, **kwargs):
    return (kwargs["combo"],)
