const imgs = [];

// send images as array of urls
const joinImages = (width, height, imgurls) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 128 * width;
  canvas.height = 128 * height;

  return new Promise((resolve, reject) => {
    Promise.all(imgurls.map(downloadAsset))
      .then(() => {
        for (let i = 0; i < imgs.length; i++) {
          ctx.drawImage(imgs[i], (i % width) * 128, Math.floor(i / width) * 128);
        }

        const url = canvas.toDataURL();
        resolve(url); // Resolve with the data URL of the merged image
      })
      .catch(error => {
        console.error('Error merging images:', error);
        reject(error); // Reject with the error message
      });
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