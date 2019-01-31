let uploadingItems = [];

function isImage(file) {
  return file.kind === 'file' && file.type.split('/')[0] === 'image';
}

function getDataURL(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(event);

        reader.abort();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

function getUploadingItemIndex() {
  if (uploadingItems.length === 0) {
    uploadingItems.push(0);

    return 0;
  }

  const newIndex = uploadingItems[uploadingItems.length - 1] + 1;

  uploadingItems.push(newIndex);

  return newIndex;
}

function removeUploadingItem(index) {
  uploadingItems = uploadingItems.filter((item) => item !== index);
}

module.exports.getDataURL = getDataURL;
module.exports.isImage = isImage;
module.exports.getUploadingItemIndex = getUploadingItemIndex;
module.exports.removeUploadingItem = removeUploadingItem;
