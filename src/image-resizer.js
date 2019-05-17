class ImageResizr {
  constructor(Sharp) {
    this.sharp = Sharp;
  }

  isValidExtension(ext){
    const exts = ["JPG","JPEG", "PNG", "TIFF", "GIF", "SVG"]
    const found = exts.filter(cek => cek == ext.toUpperCase())
    return (found.length>=1)
  }

  getExtension(filename) {
    const i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i+1);
  }

  getContentType(extention){
    const extentionList = {
      JPG : "image/jpeg",
      JPEG : "image/jpeg",
      PNG : "image/png",
      TIFF : "image/tiff",
      GIF : "image/gif",
      SVG : "image/svg+xml"
    }
    return extentionList[extention.toUpperCase()]
  }

  resize(image, size, quality, filename) {
    if (!image) throw new Error('An Image must be specified');
    if (!size) throw new Error('Image size must be specified');
    const ext = this.getExtension(filename)
    console.log('ext: '+ext)
    if(!this.isValidExtension(ext)) throw new Error('Image not supported');
    console.log('pass')
    return new Promise((res, rej) => {
      this.sharp(Buffer.from(image.buffer))
        .resize(size.w, size.h)
        .toBuffer()
        .then(data => {
          return res({
            image: data,
            contentType: this.getContentType(ext),
          });
        }).catch(err => rej(err))
    });
  }
}

module.exports = ImageResizr;