import * as fs from "fs"
import * as path from "path"
import { spawnSync } from "child_process";
import * as client from "scp2"
import { IResponseData } from "./type";

export const sendFileToServer = function (file: string) {
  const serverInfo = {
    "host": "10.0.10.64",
    "username": "root",
    "password": "cdsf@119",
    "path": "/root/package-server/package",
    "download_port": "3000"
  }
  return new Promise((resolve, reject) => {
    client.scp(file, `${serverInfo.username}:${serverInfo.password}@${serverInfo.host}:${serverInfo.path}`, function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export const sendMsgToComChat = function (options:
  {
    zipName: string,
    projectName: string,
    branch: string,
    note: string,
    mention: string[]
  }
) {

  const downloadUrl = `http://10.0.10.64:3000/${options.zipName}`

  const content = `【最新前端包】
  项目名称：${options.projectName}
  git打包分支：${options.branch}
  备注：${options.note}
  下载：${downloadUrl}
  `

  const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "__config__.json"), 'utf8'));

  const command: string = `curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${config.token}' \
  -H 'Content-Type: application/json' \
  -d '
  {
    "msgtype": "text",
      "text": {
      "mentioned_list": ${JSON.stringify(options.mention)},
        "content": "${content}"
    }
  } '
  `
  exe(command)
}

export const delFolder = function (dir: string) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file, index) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        delFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
};

export const gitClone = (url: string, dir: string) => {
  if (!fs.existsSync(dir)) {
    exe(`git clone ${url} ${dir}`)
  }
}

export const exe = (cmd: string): string => {
  console.log(`cmd: ${cmd}`)
  const ls = spawnSync(cmd, {
    shell: true
  });
  const stderr = ls.stderr?.toString() || ""
  const stdout = ls.stdout?.toString() || ""
  console.log(`stderr: ${stderr}`);
  console.log(`stdout: ${stdout}`);
  return stdout

}

export const genResData = (options: {
  type: "error" | "success";
  msg?: string;
  data?: any;
}): IResponseData => {
  switch (options.type) {
    case "error":
      return {
        status: 1,
        msg: options.msg || "error",
        data: options.data || null
      }

    case "success":
      return {
        status: 1,
        msg: options.msg || "success",
        data: options.data || null
      }
  }
}