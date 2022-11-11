const fs = require('fs')
const path = require('path')
const lottery = require('./lottery')

const url = path.join('temp/step.json')

const step = {
  data: 0,
  get () {
    return this.data
  },
  put (data) {
    // if (data === this.data + 1) {
    this.data = data
    this.write(this.data)
    if (data === 2) {
      const signIn = require('./signIn')
      lottery.setUnLotteryList(signIn.get().slice())
    }
    // }

    return this.data
  },
  write (data) {
    fs.writeFileSync(url, JSON.stringify(data, null, 4))
  },
  read () {
    if (fs.existsSync(url)) {
      this.data = JSON.parse(fs.readFileSync(url).toString())
    } else {
      this.data = 0
    }
    return this.data
  },
}

step.read()

module.exports = step
