# comfyui-get-meta

Get metadata from image.

## Usage  

#### Nodes

Add node > image > ...  

Get Boolean from Image  
Get Int from Image  
Get Float from Image  
Get String from Image  
Get Combo from Image  
Get Nodes from Image  
Get Prompt from Image  
Get Workflow from Image  

#### Query

#NODE_ID.WIDGET_NAME  
NODE_TYPE.WIDGET_NAME  
NODE_TYPE\[NODE_INDEX\].WIDGET_NAME  
NODE_TITLE.WIDGET_NAME  
NODE_TITLE\[NODE_INDEX\].WIDGET_NAME  

#1.seed                          // Int  
KSampler.seed                    // Int  
KSampler.denoise                 // Float  
KSampler\[0\].seed               // Int  
KSampler.scheduler               // String  
Load Checkpoint.ckpt_name        // Combo  
CheckpointLoaderSimple.ckpt_name // Combo  
...

If node is Note, enter Note.text to get note value.

#### Special Query

REL_PATH    // String  
ABS_PATH    // String  
FULL_NAME   // String  
DIR_NAME    // String  
FILE_NAME   // String  
EXT_NAME    // String  
WIDTH       // Int  
HEIGHT      // Int  

## Acknowledgements

- [JSON5](https://json5.org/)