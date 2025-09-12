import os
import traceback
import re

from server import PromptServer
from aiohttp import web

from PIL import Image
from PIL.PngImagePlugin import PngImageFile
# from PIL.AvifImagePlugin import AvifImageFile
from PIL.JpegImagePlugin import JpegImageFile
from PIL.WebPImagePlugin import WebPImageFile

def parse_file_path(file_path):
  fullname = os.path.basename(file_path)
  dirname = os.path.dirname(file_path)
  filename, extname = os.path.splitext(fullname)
  abs_path = os.path.abspath(file_path)
  rel_path = os.path.relpath(file_path)
  return {
    "origPath": file_path,
    "absPath": abs_path,
    "relPath": rel_path,
    "fullName": fullname,
    "fileName": filename,
    "extName": extname,
    "dirName": dirname,
  }

def get_metadata(file_path):
  with Image.open(file_path) as image:

    info = image.info

    if info == None:
      info = {}

    # webp
    if isinstance(image, WebPImageFile) and "exif" in info:
      exif = info["exif"]
      info = {}

      if isinstance(exif, bytes):
        exif = exif.decode("utf-8", errors="ignore")
      
      workflowMatch = re.search(r'workflow:(.+?)(?:[^}]*?)prompt:', exif, re.IGNORECASE)
      promptMatch = re.search(r'prompt:(.+?)(?:[^}]*?)$', exif, re.IGNORECASE)

      if workflowMatch != None:
        info["workflow"] = workflowMatch.group(1)
      else:
        info["workflow"] = {}

      if promptMatch != None:
        info["prompt"] = promptMatch.group(1)
      else:
        info["prompt"] = {}

      # debug
      # print(info)

    return {
      **parse_file_path(file_path),
      **{
        "width": image.width,
        "height": image.height,
        "info": info,
        "format": image.format,
      }
    }

@PromptServer.instance.routes.post("/shinich39/comfyui-get-meta/read-metadata")
async def _read_metadata(request):
  try:
    req = await request.json()
    file_path: str = req["path"]
    result = get_metadata(file_path)
    return web.json_response(result)
  except Exception as err:
    print(traceback.format_exc())
    return web.Response(status=400)
  


  