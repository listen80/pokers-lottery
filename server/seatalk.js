/* eslint-disable camelcase */
const request = require('request') // 获取http模块
const fs = require('fs')

const App = require('../data.json').App

let app_access_token = null

function getUserInfo (token) {
  const url = 'https://openapi.seatalk.io/sso/v2/verify'
  const start = Date.now()
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${app_access_token}`,
      },
      body: JSON.stringify({ token }),
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          body = JSON.parse(body)
          if (body.code === 0) {
            getDetailInfo(body.profile.employee_code).then((detail) => {
              console.log('getUserInfo', Date.now() - start)
              resolve(detail[0])
            })
          }
        } catch (e) { reject(e) }
      }
    })
  })
}

class Email {
  constructor (key) {
    this.key = key
    this.url = `temp/${key}.json`
  }
  get (email) {
    return emailData[email]
  }
  set (email, value) {
    emailData[email] = value
    this.write()
  }
  read () {
    if (fs.existsSync(this.url)) {
      return JSON.parse(fs.readFileSync(this.url).toString())
    } else {
      return Object.create(null)
    }
  }
  write () {
    fs.writeFileSync(this.url, JSON.stringify(emailData, null, 4))
  }
}

const emailExam = new Email('emails')
const emailData = emailExam.read()

function getDetailInfoByEmail (email) {
  const cache = emailExam.get(email)
  if (cache) return Promise.resolve(cache)

  const url =
    'https://openapi.seatalk.io/contacts/v2/get_employee_code_with_email'
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${app_access_token}`,
        },
        body: JSON.stringify({ emails: [email] }),
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          try {
            body = JSON.parse(body)
            if (body.code === 0) {
              getDetailInfo(body.employees[0].employee_code).then(detail => {
                const value = detail[0]
                emailExam.set(email, value)
                resolve(value)
              })
            }
          } catch (e) {
            reject(e)
          }
        }
      }
    )
  })
}

function getDetailInfo (employee_code) {
  const url = 'https://openapi.seatalk.io/contacts/v2/profile'

  return new Promise((resolve, reject) => {
    request(
      {
        url: url + `?${employee_code}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${app_access_token}`,
        },
        qs: { employee_code },
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          try {
            body = JSON.parse(body)
            if (body.code === 0) {
              resolve(body.employees)
            }
          } catch (e) {
            reject(e)
          }
        }
      }
    )
  })
}

function getAccessToken () {
  const url = 'https://openapi.seatalk.io/auth/app_access_token'

  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(App),
      },
      function (error, response, body) {
        if (!error && response.statusCode === 200) {
          body = JSON.parse(body)
          if (body.code === 0) {
            // {"app_access_token":"9acc2a184850488d805966b0078c268a","code":0,"expire":1641809369}
            app_access_token = body.app_access_token
            resolve(app_access_token)
          } else {
            reject(error)
          }
        }
      }
    )
  })
}

getAccessToken()

setInterval(getAccessToken, 3600 * 1000)

module.exports = {
  getUserInfo,
  getAccessToken,
  getDetailInfoByEmail,
}
