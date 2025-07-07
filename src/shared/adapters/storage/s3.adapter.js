const AWS = require('aws-sdk');
const crypto = require('crypto');
const stream = require('stream');
const fs = require('fs');

class S3Adapter {
  constructor(options = {}) {
    this.s3 = new AWS.S3({
      region: options.region,
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      endpoint: options.endpoint,
      ...options.config
    });
  }

  // Authentication & Setup
  async validateCredentials() {
    try {
      await this.s3.listBuckets().promise();
      return true;
    } catch (error) {
      throw new Error('Invalid AWS credentials or configuration.');
    }
  }

  // Object Operations
  async uploadObject(bucket, key, body, options = {}) {
    return this.s3.upload({
      Bucket: bucket,
      Key: key,
      Body: body,
      ...options
    }).promise();
  }

  async downloadObject(bucket, key) {
    const data = await this.s3.getObject({ Bucket: bucket, Key: key }).promise();
    return data.Body;
  }

  async deleteObject(bucket, key) {
    return this.s3.deleteObject({ Bucket: bucket, Key: key }).promise();
  }

  async copyObject(srcBucket, srcKey, destBucket, destKey) {
    return this.s3.copyObject({
      CopySource: `/${srcBucket}/${srcKey}`,
      Bucket: destBucket,
      Key: destKey
    }).promise();
  }

  async moveObject(srcBucket, srcKey, destBucket, destKey) {
    await this.copyObject(srcBucket, srcKey, destBucket, destKey);
    return this.deleteObject(srcBucket, srcKey);
  }

  async getObjectMetadata(bucket, key) {
    return this.s3.headObject({ Bucket: bucket, Key: key }).promise();
  }

  async checkObjectExists(bucket, key) {
    try {
      await this.getObjectMetadata(bucket, key);
      return true;
    } catch {
      return false;
    }
  }

  async getObjectUrl(bucket, key) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  getSignedUrl(bucket, key, expiresIn = 3600) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expiresIn
    });
  }

  // Bucket Operations
  async createBucket(bucketName) {
    return this.s3.createBucket({ Bucket: bucketName }).promise();
  }

  async deleteBucket(bucketName) {
    return this.s3.deleteBucket({ Bucket: bucketName }).promise();
  }

  async listBuckets() {
    const data = await this.s3.listBuckets().promise();
    return data.Buckets;
  }

  // Listing & Search
  async listObjects(bucket, prefix = '') {
    const params = { Bucket: bucket, Prefix: prefix };
    const data = await this.s3.listObjectsV2(params).promise();
    return data.Contents;
  }

  async listObjectsByPrefix(bucketConfigs = []) {
    const allFiles = [];

    for (const { bucketName, prefix } of bucketConfigs) {
      const objects = await this.listObjects(bucketName, prefix || '');
      objects.forEach(obj => {
        allFiles.push({
          key: obj.Key,
          size: obj.Size,
          bucket: bucketName
        });
      });
    }

    return allFiles;
  }

  // Advanced Upload/Download
  async uploadFromFile(bucket, key, filePath) {
    const body = fs.createReadStream(filePath);
    return this.uploadObject(bucket, key, body);
  }

  async downloadToFile(bucket, key, outputPath) {
    const fileStream = fs.createWriteStream(outputPath);
    const s3Stream = this.s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
    return new Promise((resolve, reject) => {
      s3Stream.pipe(fileStream)
        .on('error', reject)
        .on('close', resolve);
    });
  }

  // Utility
  async getFileChecksum(bucket, key) {
    const data = await this.downloadObject(bucket, key);
    return crypto.createHash('md5').update(data).digest('hex');
  }

  getMimeType(key) {
    const ext = key.split('.').pop().toLowerCase();
    const mimeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      m3u8: 'application/x-mpegURL'
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  async getFileInfo(file) {
    const data = await this.s3.getObject({ Bucket: file.bucket, Key: file.key }).promise();
    const md5 = crypto.createHash('md5').update(data.Body).digest('hex');
    return {
      key: file.key,
      name: file.key.split('/').pop(),
      size: file.size,
      type: this.getMimeType(file.key),
      md5
    };
  }
}

module.exports = S3Adapter;
