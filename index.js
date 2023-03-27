const local = require("./local.js")
const net = require("./net.js")
const util = require("util")
const fsp = require("node:fs/promises")

const exec = util.promisify(require('node:child_process').exec);

const current_dir = process.cwd();


(async function () {
  let token = (await local.get_config()).token
  if (!token) {
    token = await net.get_token()
    local.write_config(JSON.stringify({ token }))
  }
  const url = await get_github_url()

  const m = await get_files_to_search()
  const match = await get_issues(m)
  console.log(token,url);
  for (const i of match) {
    net.create_issue(i.title, token, url)
  }
})()

// TODO: test man

async function get_issues(files) {
  const regex = /\/\/\s*TODO:\s*(.*)/g

  const arr = []
  for (const i of files) {
    const data = await fsp.readFile(current_dir + "/" + i, "utf8")
    const match = data.match(regex)
    if (null !== match) {
      if (Array.isArray(match)) {
        match.forEach((e) => {
          arr.push(e)
        })
      } else {
        arr.push(e)
      }
    }
  }

  const farr = []
  for (const i of arr) {
    const obj = {
      title: i.replace(/\/\/\s*TODO:/, "").trim()
    }
    farr.push(obj)
  }

  return farr
}

async function get_files_to_search() {
  const { stdout } = await exec(`git ls-tree --full-tree --name-only -r HEAD`)
  const arr = stdout.split("\n")
  arr.pop()
  return arr
}


async function get_github_url() {
  let url = process.argv[2]

  if (!url) {
    console.error("please provide github_url")
    throw new Error("Error: please provide github_url")
  }

  url = url.slice("https://github.com/".length)
  const [user_name, repo_name] = url.split('/')
  url = "https://api.github.com/repos" + "/" + user_name + "/" + repo_name + "/issues"
  return url
}
