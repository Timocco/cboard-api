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

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  var s3_bucket_params = {
    Bucket: containerName,
    Key: finalName,
    Body: buffer
  };

  // uploading media (image) to s3 bucket
  var promiseUploadMediaToS3BuckerAWS = new Promise((resolve, reject) => {
    s3.upload(s3_bucket_params, function(error, file) {
      if (error) {
        console.log('S3 ERROR: ');
        console.error(error, error.stack);
        reject(error);
      }
      // success uploading media to s3 bucket in aws
      else {
        console.log('S3 SUCCESS DATA: 1');
        console.log(file);
        resolve([file, file.Location]);

        // REFRESH CDN
        // if (
        //   process.env.CBOARD_CDN_DISTRIBUTION_ID != null ||
        //   process.env.CBOARD_CDN_DISTRIBUTION_ID != undefined
        // ) {
        //   var cloudfront = new AWS.CloudFront();

        //   var callerReference = Math.round(new Date().getTime() / 1000);
        //   var items =
        //     '/' + process.env.CBOARD_CONTAINER_NAME.split('/')[1] + '/*';

        //   var params = {
        //     DistributionId: process.env.CBOARD_CDN_DISTRIBUTION_ID,
        //     InvalidationBatch: {
        //       CallerReference: callerReference.toString(),
        //       Paths: {
        //         Quantity: 1,
        //         Items: [items]
        //       }
        //     }
        //   };

        //   var cdn = cloudfront.createInvalidation(params, function(
        //     error,
        //     data
        //   ) {
        //     if (error) {
        //       console.log('CDN ERROR: ');
        //       console.error(error /*, error.stack*/);
        //     } else {
        //       console.log('CDN SUCCESS DATA: 1 ');
        //       console.log(data);
        //     }
        //   });
        // }
        // return [file, file.Location];
      }
    });
  });

  return promiseUploadMediaToS3BuckerAWS;
}
