const imgs = [];

// send images as array of urls
const joinImages = (width, height, imgurls) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 128 * width;
  canvas.height = 128 * height;
  
  Promise.all(imgurls.map(downloadAsset)).then(() => {
    for(let i = 0; i < imgs.length; i++){
      ctx.drawImage(imgs[i], (i % width) * 128, Math.floor(i / width) * 128);
    }

    const url = canvas.toDataURL();

    // data url to new image
    return url;
  });
};

// promise to load needed image
function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      imgs.push(asset);
    resolve();
  };
  asset.src = assetName;
  });
}