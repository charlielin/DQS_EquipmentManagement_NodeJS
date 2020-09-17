const { ImageClient } = require('image-node-sdk');
const {
  AppId,
  SecretId,
  SecretKey
} = require('./config/index.js');
const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey,
});

exports.main = async (event) => {
  const idCardImageUrl = event.url;
  const result = await imgClient.ocrGeneral({
    data: {
      url : idCardImageUrl,
    },
  });
  return result;
};