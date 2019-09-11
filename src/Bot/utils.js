const x2j = require('xml2js')
const config = require('./../../config')
const OSS     = require('ali-oss')

module.exports.parseXml = async (xml) => {
    return new Promise((resolve, reject) => {
        x2j.parseString(xml, {
            explicitArray: false
        }, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}


exports.ossClient = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.accessKeyId,
  accessKeySecret: config.oss.accessKeySecret,
  bucket: config.oss.bucket,
})