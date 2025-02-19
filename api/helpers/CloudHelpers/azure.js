const uuidv1 = require('uuid/v1');
const azure = require('azure-storage');

try {
  const blobService = azure.createBlobService(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
} catch {
  console.log('failed to create blob storage');
}

module.exports = {
  createBlockBlobFromText_AZURE
};

function createContainerIfNotExists(shareName) {
  return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(shareName, function(error, result) {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}

// Returns [file:BlobResult, fileUrl:string]
async function createBlockBlobFromText_AZURE(
  containerName,
  fileName,
  file,
  prefix = ''
) {
  await createContainerIfNotExists(containerName);

  const ts = Math.round(new Date().getTime() / 1000);
  const uuidSuffix = uuidv1()
    .split('-')
    .pop();
  const finalName = `${prefix}_${ts}_${uuidSuffix}_${fileName
    .toLowerCase()
    .trim()}`;

  const { buffer, mimetype } = file;

  const options = {};
  if (mimetype && mimetype.length) {
    options.contentSettings = {
      contentType: mimetype
    };
  }

  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromText(
      containerName,
      finalName,
      buffer,
      options,
      function(error, file) {
        if (error) {
          reject(error);
          return;
        }

        resolve([file, blobService.getUrl(file.container, file.name)]);
      }
    );
  });
}
