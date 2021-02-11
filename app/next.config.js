const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
const sanityProjectId = process.env.SANITY_PROJECT_ID;
const sanityApiToken = process.env.SANITY_API_TOKEN;
module.exports = {
  distDir: 'dist',
  target: 'serverless',
  publicRuntimeConfig: {
    cloudinaryCloudName: cloudinaryCloudName,
    cloudinaryUploadPreset: cloudinaryUploadPreset,
    sanityProjectId: sanityProjectId,
    sanityApiToken: sanityApiToken
  },
  images: {
    domains: ['res.cloudinary.com']
  }
}