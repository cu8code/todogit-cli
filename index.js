const local = require("./local.js")
const net = require("./net.js")
const util = require("util")

const exec = util.promisify(require('node:child_process').exec);

const current_dir = process.cwd();


(async function () {
  // let token = (await local.get_config()).token
  // if (!token) {
  //   token = await net.get_token()
  //   local.write_config(JSON.stringify({ token }))
  // }
  
  const files = await get_files_to_search()
  const url = await get_github_url()
  const match = await get_issues()
  console.log('====================================');
  console.log(match);
  console.log('====================================');

})()

// TODO: test man

async function get_issues(files) {
  const regex = /\/\/\s*TODO:\s*(.*)/g
  for (const i of files) {
    const data = await fstat.readFile(current_dir + "/" + i, "utf8")
    const match = data.match(regex)
  }
}

async function get_files_to_search() {
  const { stdout } = await exec(`git ls-tree --full-tree --name-only -r HEAD`)
  const arr = stdout.split("\n")
  arr.pop()
  return arr
}


async function get_github_url() {
  let url = null
  let { stdout } = await exec(`cd ${current_dir} && git remote get-url origin`)
  stdout = stdout.slice("git@github.com:".length)
  stdout = stdout.slice(0, -".git".length)
  // TODO: the repo_name ends with a "." ( it should not )
  stdout = stdout.slice(0, -1)
  const [user_name, repo_name] = stdout.split('/')
  url = "https://api.github.com/repos" + "/" + user_name + "/" + repo_name + "/issues"
  console.log("user_name = ", user_name)
  console.log("repo_name = ", repo_name)
  console.log("url = ", url)
  return url
}










