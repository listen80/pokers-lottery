const xlsx = require('node-xlsx').default
const fs = require('fs')

function loadUserXML (xmlPath = 'xlsx/users.xlsx') {
  const userData = xlsx.parse(xmlPath)
  let outData = []
  userData.forEach((item) => {
    item.data.shift()
    outData = outData.concat(item.data.filter(item => item.length > 0))
  })
  return outData
}

const whiteList = loadUserXML()

fs.writeFileSync('temp/white.json', JSON.stringify(whiteList, null, 4))

module.exports = whiteList
