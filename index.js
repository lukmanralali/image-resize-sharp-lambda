const Sharp = require('sharp');
const querystring = require('querystring');
const ImageFetcher = require('./src/s3-image-fetcher');
const ImageResizer = require('./src/image-resizer');

function getLambdaKey(origin,request){
	let url = request.uri
	url = url.substring(1);
	return decodeURIComponent(url);
}

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const origin = request.origin.custom;
    const options = querystring.parse(request.querystring);
    
    const width = isNaN(options.width) ? null : Math.abs(options.width);
    const height = isNaN(options.height) ? null : Math.abs(options.height);
    
    const imageFetcher = new ImageFetcher("bth-prd");
	const imageResizer = new ImageResizer(Sharp);

	const fileName = getLambdaKey(origin,request);
	return imageFetcher.fetchImage(fileName)
    .then(data => imageResizer.resize(data.image, { width, height }, 80, fileName))
    .then(data => {
		const contentType = data.contentType;
		// const img = Buffer.from(data.image.buffer, 'base64');
		const img = new Buffer(data.image.buffer, 'base64');
		callback(null, {
			bodyEncoding: 'base64',
            body: img.toString('base64'),
            // headers: { 'Content-Type': contentType },
            status: '200',
            statusDescription: 'OK'
		});
    })
    .catch(error => {
		console.error('Error:', error);
		callback(null, error);
    });
};