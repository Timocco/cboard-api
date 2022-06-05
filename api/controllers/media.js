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

    console.log('\nDATA: ');
    console.log(file);
    console.log(fileUrl);

    url = fileUrl;
  } catch (err) {
    console.log('\nERROR: ');
    console.error(err);
    return res.status(500).json({
      message: 'ERROR: something went wrong: ' + err.message
    });
  }

  return res.status(200).json({ url });
}
