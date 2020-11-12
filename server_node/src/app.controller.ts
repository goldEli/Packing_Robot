import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { AppService } from './app.service';
import { IResponseData, IBuildInfo } from "./type";
import { genResData } from "./utils"


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("/start_build")
  startBuild(@Req() request: Request): IResponseData {
    const { project, branch, mention, note } = request.body as IBuildInfo
    try {
      this.appService.startBuild({ project, branch, mention, note })
    } catch (error) {
      return genResData({ type: "error", msg: "打包失败" })

    }
    return genResData({ type: "success", msg: "打包完成" })
  }

  @Post("/branch_list")
  getBranchList(@Req() request: Request): IResponseData {
    const { id } = request.body
    return genResData({
      type: "success",
      data: this.appService.getBranchList(id)
    })
  }

  @Post("/project_list")
  getProjectList(): IResponseData {
    return genResData({
      type: "success",
      data: this.appService.getProjectList()
    })
  }
}
