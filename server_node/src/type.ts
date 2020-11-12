export interface IResponseData {
  status: 0 | 1;
  msg: string | "success" | "error";
  data: any
}

export interface IProject {
  id: string;
  url: string;
  dir: string;
  name: string;
}

export interface IBuildInfo {
  branch: string;
  mention: string[];
  note: string;
  project: string;
}