# comfyui-get-meta

Get metadata from image.

## Usage  

Add node > image > Get ??? from Image

#### Rules

#NODE_ID.WIDGET_NAME  
NODE_TYPE.WIDGET_NAME  
NODE_TYPE\[NODE_INDEX\].WIDGET_NAME  
NODE_TITLE.WIDGET_NAME  
NODE_TITLE\[NODE_INDEX\].WIDGET_NAME  

#### Example

#1.seed  
KSampler.seed  
KSampler.denoise // Float  
KSampler\[0\].seed // Int  
KSampler.schedule_name // String  
Load Checkpoint.ckpt_name // Combo  
CheckpointLoaderSimple.ckpt_name // Combo  

## Acknowledgements

- [JSON5](https://json5.org/)