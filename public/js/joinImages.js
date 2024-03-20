const imgs = [];

// send images as array of urls
const joinImages = (width, height, imgUrls, rotations) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 128 * width;
  canvas.height = 128 * height;

  return new Promise((resolve, reject) => {
    Promise.all(imgUrls.map(downloadAsset))
      .then(() => {
        for (let i = 0; i < imgs.length; i++) {
          const rotation = rotations[i];
          const rotatedImage = rotateImage(imgs[i], rotation);
          ctx.drawImage(rotatedImage, (i % width) * 128, Math.floor(i / width) * 128);
        }
        const url = canvas.toDataURL();
        resolve(url);
      })
      .catch(error => {
        console.error('Error merging images:', error);
        reject(error);
      });
  });
};

// Rotate image by angle (in radians)
function rotateImage(image, rotation) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to hold rotated image
  canvas.width = image.height;
  canvas.height = image.width;
  
  // Translate origin to center of canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation * Math.PI / 2);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  
  // Return rotated image
  return canvas;
}

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
