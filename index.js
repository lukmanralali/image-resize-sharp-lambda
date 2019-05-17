const Sharp = require('sharp');
const ImageFetcher = require('./src/s3-image-fetcher');
const ImageResizer = require('./src/image-resizer');
module.exports.handler = (event, context, callback) => {
	const imageFetcher = new ImageFetcher("ralalidev");
	const imageResizer = new ImageResizer(Sharp);
	const fileName = event.queryStringParameters && event.queryStringParameters.path_url;
	const quality = event.queryStringParameters && +event.queryStringParameters.q || 80;
	const size = {
		w: event && +event.queryStringParameters.w || null,
		h: event && +event.queryStringParameters.h || null,
	};
  	return imageFetcher.fetchImage(fileName)
    .then(data => 
		imageResizer.resize(data.image, size, quality, fileName))
    .then(data => {
		const contentType = data.contentType;
		// const img = Buffer.from(data.image.buffer, 'base64');
		const img = new Buffer(data.image.buffer, 'base64');
		callback(null, {
			statusCode: 200,
			headers: { 'Content-Type': contentType },
			body: img.toString('base64'),
			isBase64Encoded: true,
		});
    })
    .catch(error => {
		console.error('Error:', error);
		callback(null, error);
    });
};