const fs = require('fs')
const path = require('path')

const url = path.join('temp/lottery.json')
const prizes = require('./prizes')
const user = require('./user')

const lottery = {
  get () {
    return lotteryData
  },
  post (index) {
    if (lotteryData[index]) {
      return lotteryData[index]
    }
    const result = []
    if (index === prizes.length - 1) {
      // 阳光普照
      const map = {}
      lotteryData.forEach(row => {
        row && row.forEach(one => {
          map[one[0]] = true
        })
      })
      user.slice().forEach((one) => {
        const email = one[0]
        if (!map[email]) {
          result.push(one)
        }
      })
    } else {
      const prize = prizes[index]
      const num = prize[6]
      const unLotteryList = unlotteryList.get()
      while (unLotteryList.length && result.length < num) {
        // 随机函数在这
        const removeIndex = unLotteryList.length * Math.random() | 0
        result.push(unLotteryList[removeIndex])
        // todo 上线记得取消下面行的注释
        unLotteryList.splice(removeIndex, 1)
      }
      if (result.length) {
        unlotteryList.write()
      }
    }
    if (result.length) {
      lotteryData[index] = result
      this.write(lotteryData)
    }

    return result
  },
  delete () {
    lotteryData.splice(0, lotteryData.length)
    lotteryData.length = prizes.length
    // 防止fe splice问题
    this.write(lotteryData)
    return lotteryData
  },
  write (data) {
    fs.writeFileSync(url, JSON.stringify(data, null, 4))
  },
  read () {
    Object.assign(lotteryData, JSON.parse(fs.readFileSync(url).toString()))
  },
  check () {
    if (fs.existsSync(url)) {
      this.read()
    }
  },
  setUnLotteryList (data) {
    unlotteryList.set(data)
  },
}

class Common {
  constructor (key, data) {
    this.key = key
    this.url = `temp/${key}.json`
    this.data = data
    this.read()
  }
  get () {
    return this.data
  }
  set (data) {
    this.data = data
    this.write()
  }
  read () {
    if (fs.existsSync(this.url)) {
      this.data = JSON.parse(fs.readFileSync(url).toString())
    }
  }
  write () {
    fs.writeFileSync(this.url, JSON.stringify(this.data, null, 4))
  }
}

const lotteryData = Array(prizes.length)
lottery.check()

const unlotteryList = new Common('unlotteryList', [])

module.exports = lottery
