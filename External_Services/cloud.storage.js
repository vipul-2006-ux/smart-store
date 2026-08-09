exports.uploadImage = async (fileStream) => {
  console.log('Uploading file to AWS S3...');
  return 'https://s3.amazonaws.com/bucket/image.png';
};