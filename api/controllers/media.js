const { createBlockBlobFromText } = require('../helpers/blob');

module.exports = {
  uploadMedia
};

async function uploadMedia(req, res) {
  let url = null;

  try {
    const uploadedFile = req.files.file[0];

    /* 
    NOTICE !! 
    you have to have the 
    "CBOARD_CONTAINER_NAME=????" variable in your environment variables
    */
    var containerName = process.env.CBOARD_CONTAINER_NAME;

    const [file, fileUrl] = await createBlockBlobFromText(
      containerName,
      uploadedFile.originalname,
      uploadedFile,
      ''
    );

    url = fileUrl;
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'ERROR: Unable to upload media file: ' + err.message
    });
  }

  return res.status(200).json({ url });
}
