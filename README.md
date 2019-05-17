# image-resize-sharp-lambda

ini di compile local.
env local saat compile :
npm version 6.7.0
node version v11.11.0

karena ada perbedaan env di local dan di lambda, ini di compile dengan env yg paling mirip dengan env lambda saat ini.
cmd : npm install --arch=x64 --platform=linux --target=10.0.0 sharp
saran menggunakan lambda docker saja.