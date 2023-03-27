const { delay } = require("./util.js")

const CLIENT_ID = "afc775ea851677813e35"

async function get_token() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");


  const raw = JSON.stringify({
    "client_id": "afc775ea851677813e35",
    "scope": "repo"
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  const result = await fetch("https://github.com/login/device/code", requestOptions)

  const json = await result.text()
  const response_json = JSON.parse(json)
  const token = await extract_vefication_code(response_json)

  return token
}

async function extract_vefication_code(response_json) {
  const user_code = response_json.user_code
  const uri = response_json.verification_uri
  const expires_in = response_json.expires_in
  const interval = response_json.interval
  const device_code = response_json.device_code

  console.log("#############################################################")
  console.log("#############################################################")
  console.log("user_code = ", user_code)
  console.log("uri = ", uri)
  console.log("OPEN THE URI AND ENTER THE OTP(user_code)")
  console.log("#############################################################")
  console.log("#############################################################")

  const start = new Date()
  while (true) {

    // if expires break
    if ((new Date() - start) > (expires_in * 1000)) {
      console.error("failed: session expired")
      return null
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const text = JSON.stringify({
      client_id: CLIENT_ID,
      device_code: device_code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: text,
    };

    const result = await fetch("https://github.com/login/oauth/access_token", requestOptions)
    const t = await result.text()
    const data = JSON.parse(t)
    console.log(data);

    if (data?.access_token) {
      return data.access_token
    }

    await delay(interval * 1000)
  }
}


async function create_issue(title, token, url) {
  const headers = new Headers()
  headers.append('Accept', "application/vnd.github+json")
  headers.append('Authorization', 'Bearer ' + token)
  headers.append('X-GitHub-Api-Version', '2022-11-28')
  headers.append('Content-Type', 'text/plain')

  const raw = JSON.stringify({
    title
  });

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: raw,
  };

  const r = await fetch(url, requestOptions)
  const t = await r.text()
  console.log(t);
}

module.exports = {
  get_token,
  create_issue
}

