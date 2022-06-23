const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

module.exports = {
  createBlockBlobFromText_AWS
};

// Returns [file:BlobResult, fileUrl:string]
async function createBlockBlobFromText_AWS(
  containerName,
  fileName,
  file,
  prefix = ''
) {
  const ts = Math.round(new Date().getTime() / 1000);
  const uuidSuffix = uuidv1()
    .split('-')
    .pop();
  const finalName = `${process.env.CBOARD_CDN_DIRECTORY}/${prefix}_${ts}_${uuidSuffix}_${fileName
    .toLowerCase()
    .trim()}`;

  const { buffer, mimetype } = file;

  const options = {};
  if (mimetype && mimetype.length) {
    options.contentSettings = {
      contentType: mimetype
    };
  }

  /*
    if you want to use AWS S3 bucket:
    you have to have "export AWS_ACCESS_KEY_ID=???"
    and "export AWS_SECRET_ACCESS_KEY=???"
    variables in your environment variables
    so that it could login to it
  */
  const s3 = new AWS.S3();

  var s3_bucket_params = {
    Bucket: containerName,
    Key: finalName,
    Body: buffer
  };

  // try to upload media (image) to s3 bucket
  var promiseUploadMediaToS3BuckerAWS = new Promise((resolve, reject) => {
    s3.upload(s3_bucket_params, function (error, file) {
      if (error) {
        console.log('\nS3 ERROR uploading media: ');
        console.error(error, error.stack);
        reject(error);
      }
      // success uploading media to s3 bucket in aws
      else {
        console.log('\nS3 SUCCESS uploading media: ');
        console.log(file);

        // if you want to use CDN:
        // you have to have "export CBOARD_CDN_DISTRIBUTION_ID=???"
        // variable in your environment variables
        if (
          process.env.CBOARD_CDN_DISTRIBUTION_ID != null ||
          process.env.CBOARD_CDN_DISTRIBUTION_ID != undefined
        ) {
          var cloudfront = new AWS.CloudFront();

          var callerReference = Math.round(new Date().getTime() / 1000);
          var items =
            '/' + process.env.CBOARD_CONTAINER_NAME.split('/')[1] + '/*';

          var params = {
            DistributionId: process.env.CBOARD_CDN_DISTRIBUTION_ID,
            InvalidationBatch: {
              CallerReference: callerReference.toString(),
              Paths: {
                Quantity: 1,
                Items: [items]
              }
            }
          };

          var cdn = cloudfront.createInvalidation(params, function (
            error,
            data
          ) {
            if (error) {
              console.log('\nCDN ERROR refresh cdn: ');
              console.error(error);

              error.message =
                error.message +
                ' BUT media was uploaded successfully to s3 bucket';
              reject(error);
            }
            // success refreshing cdn
            else {
              console.log('\nCDN SUCCESS refresh cdn: ');
              console.log(data);
              resolve([file, file.Location]);
            }
          });
        }
        // do NOT want to use CDN - cludfront,
        // but was successfully uploading media to s3 bucket
        else {
          console.log(
            '\nmedia was uploaded successfully but there is NO configuration for CDN'
          );
          resolve([file, file.Location]);
        }
      }
    });
  });

  return promiseUploadMediaToS3BuckerAWS;
}
