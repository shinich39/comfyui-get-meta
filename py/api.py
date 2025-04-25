import os
import traceback

from server import PromptServer
from aiohttp import web

from PIL import Image
from PIL.PngImagePlugin import PngImageFile

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
    if isinstance(image, PngImageFile):
      return {
        **parse_file_path(file_path),
        **{
          "width": image.width,
          "height": image.height,
          "info": image.info,
          "format": image.format,
        }
      }

# @PromptServer.instance.routes.post("/shinich39/comfyui-get-meta/parse-path")
# async def _parse_path(request):
#   try:
#     req = await request.json()
#     file_path = req["path"]
#     return web.json_response(parse_file_path(file_path))
#   except Exception as err:
#     print(traceback.format_exc())
#     return web.Response(status=400)

@PromptServer.instance.routes.post("/shinich39/comfyui-get-meta/read-metadata")
async def _read_metadata(request):
  try:
    req = await request.json()
    file_path = req["path"]
    return web.json_response(get_metadata(file_path))
  except Exception as err:
    print(traceback.format_exc())
    return web.Response(status=400)