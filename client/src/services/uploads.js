import { api } from '../config'

export default {
  getSignedUrl({file, type}) {
    const url = `/services/upload-signed-url?fileType=${file.type}&type=${type}`
    return api.get(url)
  },

  uploadToS3({url, file, attachment, onProgress}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        // handle notifications about upload progress: e.loaded / e.total
        const percent = e.loaded / e.total
        console.log('progress', percent)
        if (onProgress) onProgress(percent)
      }, false);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Successfully uploaded the file.
            resolve(attachment)
          } else {
            // The file could not be uploaded.
            console.log(xhr);
            reject({message: 'An error occured during file upload'})
          }
        }
      };
      xhr.open('PUT', url);
      xhr.setRequestHeader('X-Amz-ACL', 'public-read');
      // for text file: text/plain, for binary file: application/octet-stream
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  },
}
