const modelConfig = {
    "gpt-4o-mini": {
      multimodal: true,
      simple: true,
      rag: true,
      dataWizard: true,
      fileUpload:["application/pdf", "text/plain"],
      imageUpload:["image/png", "image/jpeg", "image/jpg"]
    },
    "gpt-3.5-turbo": {
      multimodal: false,
      simple: true,
      rag: true,
      dataWizard: false,
      fileUpload:["application/pdf", "text/plain"],
      imageUpload:null
    }
  };
  
  export default modelConfig;
    