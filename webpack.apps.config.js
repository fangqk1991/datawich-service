const { BackpackBuilder } = require('@fangcha/webpack')
const glob = require('glob')

const entry = glob.sync('./datawich/apps/*.ts').reduce((acc, file) => {
  acc[file.match('^\\.\\/datawich\\/apps\\/(.+)\\.ts$')[1]] = file
  return acc
}, {})

const builder = new BackpackBuilder()
builder.entry = entry

module.exports = builder.build()
