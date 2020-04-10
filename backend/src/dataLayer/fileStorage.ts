const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
});
const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(itemKey: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: itemKey,
        Expires: parseInt(urlExpiration)
    });
}