const fs = require('fs')
const path = require('path')

const url = path.join('temp/signIn.json')
const whiteUser = require('./user')
const step = require('./step')
const location = require('../data.json').location
const { leftTop, rightBottom } = location

function compare (a, b) {
  const emailKey = 0
  return a && b && a[emailKey] === b[emailKey]
}

function inArea (coords) {
  return true
  // const { latitude, longitude } = coords
  // return longitude > leftTop[0] && longitude < rightBottom[0] && latitude < leftTop[1] && latitude > rightBottom[1]
}

const signIn = {
  delete () {
    signInData.userList.splice(0, signInData.userList.length)
    this.write(signInData)
    return signInData.userList
  },
  get () {
    return signInData.userList
  },
  post (data) {
    if (step.get() !== 1) {
      return '不允许签到，当前不是签到环节'
    } else {
      if (data) {
        const { coords, user, isAdmin } = data
        if (!whiteUser.find(white => compare(white, user))) {
          return '非白名单用户'
        } else if (signInData.userList.find(signed => compare(signed, user))) {
          return '你已经签到'
        } else if (isAdmin || inArea(coords)) {
          signInData.userList.push(user)
          this.write(signInData)
          return null
        } else {
          return '没有在规定区域签到'
        }
      } else {
        return '错误数据'
      }
    }
  },
  write (data) {
    fs.writeFileSync(url, JSON.stringify(data, null, 4))
  },
  read () {
    if (fs.existsSync(url)) {
      return JSON.parse(fs.readFileSync(url).toString())
    } else {
      return { userList: [] }
    }
  },
}

const signInData = signIn.read()
module.exports = signIn
