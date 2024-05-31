const AWS = require("aws-sdk");
const { aws } = require("../../config");

exports.upload = (base64, folder) => {
  let base64Image = base64?.split(";base64,").pop();
  var bitmap = new Buffer.from(base64Image, "base64");

  AWS.config.update({
    accessKeyId: "AKIA26SJZPW5L5CGFNAJ",
    secretAccessKey: "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",
    region: "ap-southeast-1",
  });

  var s3 = new AWS.S3();

  const params = {
    Bucket: "aimgame-dev",
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
    accessKeyId: "AKIA26SJZPW5L5CGFNAJ",
    secretAccessKey: "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",
    region: "ap-southeast-1",
  });

  var s3 = new AWS.S3();

  const bucketName = "aimgame-dev";
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
