const {
  createBlockBlobFromText_AZURE
} = require('../helpers/CloudHelpers/azure');
const { createBlockBlobFromText_AWS } = require('./CloudHelpers/aws');

module.exports = {
  createBlockBlobFromText
};

// Returns [file:BlobResult, fileUrl:string]
async function createBlockBlobFromText(
  containerName,
  fileName,
  file,
  prefix = ''
) {
  /* 
    NOTICE !! 
    you have to have the 
    "USE_CLOUD_SERVICE=AZURE" or "USE_CLOUD_SERVICE=AWS" variable, 
    in your environment variables, for using azure or aws cloud services
  */
  switch (process.env.USE_CLOUD_SERVICE) {
    case 'AWS':
      return createBlockBlobFromText_AWS(containerName, fileName, file, prefix);

    case 'AZURE':
      return createBlockBlobFromText_AZURE(
        containerName,
        fileName,
        file,
        prefix
      );
  }
}
