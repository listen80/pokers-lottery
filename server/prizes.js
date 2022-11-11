const xlsx = require('node-xlsx').default
const fs = require('fs')

function loadPrizesXML (xmlPath = 'xlsx/prizes.xlsx') {
  const userData = xlsx.parse(xmlPath)
  let outData = userData[0].data
  outData = outData.filter(item => {
    return item && item.length > 0 && !isNaN(item[0])
  })

  fs.writeFileSync('temp/prizes.json', JSON.stringify(outData, null, 4))
  outData.forEach((row, index) => {
    try {
      if (!row[1]) {
        row[1] = outData[index - 1][1]
      }
    } catch (e) {}
  })
  return outData
}

const prizes = loadPrizesXML()
// [
//   "序号", 0
//   "金额区间", 1
//   "名称", 2
//   "价格", 3
//   "图片", 4
//   "链接", 5
//   "数量", 6
//   "单价", 7
//   "总价" 8
// ]

module.exports = prizes
