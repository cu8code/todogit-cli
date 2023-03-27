async function sleep(ms) {
  await new Promise(ms => setTimeout(ms))
}

module.exports = {
  sleep
}
