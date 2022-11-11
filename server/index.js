const websocket = require('nodejs-websocket')

const signIn = require('./signIn')
const lottery = require('./lottery')
const step = require('./step')

const user = require('./user')
const prizes = require('./prizes')
const sockUserList = []

const { getUserInfo, getDetailInfoByEmail } = require('./seatalk')

websocket.createServer(function (conn) {
  function send (json) {
    conn.send(JSON.stringify(json))
  }

  function sendAll (json) {
    sockUserList.forEach(conn => conn.send(JSON.stringify(json)))
  }

  function remove () {
    clearInterval(timer)
    sockUserList.splice(sockUserList.indexOf(conn), 1)
  }

  const timer = setInterval(() => {
    send({type: 'heart'})
  }, 3 * 1e3)

  sockUserList.push(conn)

  conn.on('text', function (str) {
    let json = null
    try {
      json = JSON.parse(str)
    } catch (e) {}
    if (!json) {
      return
    }
    const { type, data } = json

    switch (type) {
      case 'getWhites':
        send({ type, data: user })
        break

      case 'getPrizes':
        send({ type, data: prizes })
        break

      case 'getLottery':
        send({ type, data: lottery.get() })
        break

      case 'postLottery':
        const result = lottery.post(data)
        if (result.length) {
          sendAll({ type, data: {index: data, lottery: lottery.post(data)} })
        } else {
          send({ type: 'msg', msg: '咩有人在抽奖池子中', error: true })
        }

        break

      case 'deleteLottery':
        sendAll({ type: 'getLottery', data: lottery.delete() })
        break

      case 'getSignIn':

        send({ type, data: signIn.get() })
        break

      case 'postSignIn':
        if (data.isAdmin) {
          getDetailInfoByEmail(data.user[0]).then((profile) => {
            if (profile) {
              const { email, name, avatar } = profile
              const user = [ email, name, avatar ]
              data.user = user
              const msg = signIn.post(data)
              if (msg) {
                send({ type: 'msg', msg: msg, error: true })
              } else {
                sendAll({ type, data })
                send({ type: 'msg', msg: '签到成功', error: false })
              }
            } else {
              send({ type: 'msg', msg: '没有这个人', error: true })
            }
          })
        } else {
          const msg = signIn.post(data)
          if (msg) {
            send({ type: 'msg', msg: msg, error: true })
          } else {
            sendAll({ type, data })
          }
        }
        break

      case 'deleteSignIn':
        sendAll({ type: 'getSignIn', data: signIn.delete() })
        break

      case 'getStep':
        send({ type, data: step.get() })
        break

      case 'putStep':
        sendAll({ type: 'getStep', data: step.put(data) })
        break

      case 'getUserInfo':
        getUserInfo(data).then((profile) => {
          send({type, data: profile})
        })
    }
  })

  conn.on('close', function close () {
    remove()
  })

  conn.on('error', function close () {
    // remove()
  })
}).listen(8082)
