const fs = require('fs')
const Minio = require('minio')

const url = './dist/bucket-lottery/'

const minioClient = new Minio.Client({
  endPoint: 'upload.origin-deo.shopeemobile.com',
  port: 80,
  bucket: 'bucket-lottery',
  useSSL: false,
  accessKey: 'any',
  secretKey: 'any',
  partSize: 1024 ** 3 * 5, // set partSize to 5 GiB to disable multipart upload
})

async function upload (fileName) {
  minioClient.fPutObject(
    'bucket-lottery',
    fileName,
    url + fileName,
    {},
    function (err, objInfo) {
      if (err) {
        return console.log(err)
      }
      // console.log('Success', objInfo, fileName)
    }
  )
}

// 读取dist路径
const readFileList = (path, filesList) => {
  //   console.log('readFileList', path, filesList)
  const files = fs.readdirSync(path)
  files.forEach(item => {
    if (item) {
      const stat = fs.statSync(path + item)
      if (stat.isDirectory()) {
        readFileList(path + item + '/', filesList)
      } else {
        filesList.push(path + item)
      }
    }
  })
  return filesList
}

const dist = readFileList(url, [])
const len = dist.length

// 递归上传
const uploadAsset = (i = 0) => {
  if (i < len) {
    const name = dist[i].split(url)[1]
    upload(name)
    uploadAsset(i + 1)
  }
}

uploadAsset()
