const AWS = require("aws-sdk");
const { aws } = require("../../config");

exports.upload = (base64, folder) => {
  let base64Image = base64?.split(";base64,").pop();
  var bitmap = new Buffer.from(base64Image, "base64");

  AWS.config.update({
    accessKeyId: aws.accessKey,
    secretAccessKey: aws.secretKey,
    region: aws.region,
  });

  var s3 = new AWS.S3();

  const params = {
    Bucket: aws.bucketName,
    Body: bitmap,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
    Key: `${folder}/` + Date.now() + ".jpg",
  };

  return new Promise((resolve, reject) => {
    try {
      s3.upload(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        }
        if (data) {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.copyImage = (image) => {
  AWS.config.update({
    accessKeyId: aws.accessKey,
    secretAccessKey: aws.secretKey,
    region: aws.region,
  });

  var s3 = new AWS.S3();

  const bucketName = aws.bucketName;
  const sourceFolder = "temp";
  const fileName = image.split("/").pop();
  const destFolder = "blogs";
  const s3Params = {
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceFolder}/${fileName}`,
    ACL: "public-read",
    Key: `${destFolder}/${fileName}`,
  };

  return new Promise((resolve, reject) => {
    try {
      s3.copyObject(s3Params, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        }

        if (data) {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
