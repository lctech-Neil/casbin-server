const { newEnforcer } = require('casbin')
const express = require('express')
const app = express()


const createEnforcer = async() => {
  const e = await newEnforcer('./model.conf', './policy.csv')
  return e
}

const checkRule = async(sub, obj, act) => {
  const e = await createEnforcer()
  if ((await e.enforce(sub, obj, act)) === true) {
    // permit alice to read data1
    return 'pass'
  } else {
    // deny the request, show an error
    return 'denied'
  }
}

app.get('/', async (req, res) => {
  const { name, data, action } = req.query
  const text = await checkRule(name, data, action)
  res.send(text)
})

app.listen(3100, () => {
  console.log(`Express is listening on localhost:${3100}`)
})

