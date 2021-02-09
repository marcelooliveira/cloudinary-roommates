const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

module.exports = {
  distDir: 'dist',
  target: 'serverless',
  publicRuntimeConfig: {
    lokiDatabase: '/tmp/loki-v1.db',
    cloudinaryCloudName: cloudinaryCloudName,
    cloudinaryUploadPreset: cloudinaryUploadPreset
  }
}