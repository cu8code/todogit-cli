const fs = require("fs")
const os = require("os")
const NAME = "todomanconf"
const PATH = os.homedir() + "/"+ NAME

async function check_if_config_present() {
  if (fs.existsSync(PATH)) {
    return true
  }
  return false
}


async function get_config() {
  if (!(await check_if_config_present()))
    return {}
  const data = fs.readFile(PATH, { encoding: "utf8" })
  const json = await JSON.stringfy(data)
  return json
}

async function write_config(str) {
  fs.writeFile(PATH, str)
}

module.exports = {
  get_config,
  write_config
}
