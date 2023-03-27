const fs = require("fs")
const fsp = require("node:fs/promises")
const os = require("os")
const NAME = "todomanconf"
const PATH = os.homedir() + "/" + NAME

function check_if_config_present() {
  if (fs.existsSync(PATH)) {
    return true
  }
  return false
}


async function get_config() {
  if (!check_if_config_present()) {
    return {}
  }

  const data = await fsp.readFile(PATH, { encoding: "utf8" })
  const json = JSON.parse(data)
  return json
}

async function write_config(str) {
  console.log({
    PATH,
    str
  });
  fsp.writeFile(PATH, str)
}

module.exports = {
  get_config,
  write_config
}
