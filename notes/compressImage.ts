import Compress, { convertBase64ToFile } from 'compress.js';
import { isBrowser } from 'utils';

const avatarCompressOptions = {
  size: 0.5,
  quality: 0.75,
  maxWidth: 600,
  maxHeight: 600,
  resize: true,
};

const headerCompressOptions = {
  size: 2,
  quality: 0.75,
  maxWidth: 1920,
  maxHeight: 600,
  resize: true,
};

const compressImage = async (imageFile: File, imageType: 'avatar' | 'header') => {
  if (!isBrowser()) return;

  const compress = new Compress();
  const imageData = await compress.compress(
    imageFile,
    imageType === 'avatar' ? avatarCompressOptions : headerCompressOptions
  );

  const { data, ext } = imageData;
  const newFile = convertBase64ToFile(data, ext);
  return newFile;
};

if (Object.keys(dirtyFields).includes(key) && key !== 'confirmPassword') {
  let _data = data[key];
  if (key === 'avatar' || key === 'header') {
    _data = await compressImage(_data, key);
  }

  formData.append(key, _data);
}
