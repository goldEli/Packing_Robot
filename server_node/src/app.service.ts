import { Injectable } from '@nestjs/common';
import { IProject, IBuildInfo } from "./type";
import { exe, gitClone, sendFileToServer, sendMsgToComChat } from "./utils";

const fs = require("fs")
const crypto = require('crypto');
const path = require('path');
const minerPath = path.join(process.cwd(), "miner-code-fe")

gitClone("git@10.0.5.16:miner/miner-dev/miner-code-fe.git", minerPath)

const projectList: IProject[] = [
  {
    "id": "1",
    "url": "git@10.0.5.16:miner/miner-dev/miner-code-fe.git",
    "dir": minerPath,
    "name": "miner"
  }
]

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getProjectList(): IProject[] {
    return projectList
  }
  getBranchList(id: string): string[] {
    const { dir } = projectList.find(item => item.id === id)
    const branchsStr = exe(`git -C ${dir} branch -r`)
    const branchList: string[] = branchsStr.split("\n")
      .filter(item => {
        if (!item) return false
        if (item.includes("origin/master")) return false
        return true
      })
      .map(item => {
        var matchs = item.split("/")
        return matchs[matchs.length - 1]
      })
    return branchList
  }
  async startBuild(options: IBuildInfo): Promise<void> {
    const hash = crypto.randomBytes(8).toString('hex')
    const folderName = path.join("repoFolder", hash);
    const folderDir = path.join(process.cwd(), folderName)

    gitClone(projectList.find(item => item.id === options.project).url, folderDir)

    const projectInfoDir = path.join(
      folderDir, "buildInfo.json"
    )
    const projectInfo = JSON.parse(fs.readFileSync(projectInfoDir, 'utf8'));

    const zipName =  projectInfo["date"] + ".zip" 
    const zipDir = path.join(folderDir, zipName)
    const projectName = projectInfo["projectName"]
    const needZipFolders = projectInfo["zipFolder"]

    try {
      exe(`cd ${folderDir} && git checkout ${options.branch} && yarn && yarn build_online && zip -r -X ${zipDir} ${needZipFolders}`)
      exe(`pwd`)
    } catch (error) {
      console.log(error)
    }

    await sendFileToServer(zipDir)

    sendMsgToComChat({
      zipName,
      projectName,
      ...options,
    })
    exe(`rm -rf ${folderDir}`)
    console.log("finished!")
  }
}
