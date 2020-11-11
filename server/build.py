'''
@Author: miaoyu
@Date: 2020-06-22 11:28:23
@LastEditTime: 2020-06-22 18:05:20
@LastEditors: miaoyu
@Description: 
'''

import uuid
import os
import utils
from paramiko import SSHClient
from scp import SCPClient
import json

# path= "/root/package-server/package",
server_info = {
    "host": "10.0.10.64",
    "username": "root",
    "password": "cdsf@119",
    "path": "/root/package-server/package",
    "download_port": "3000"
}


def run(project=None, branch="master", mention=None, note="未备注"):
    print(
        "___run___:",
        project,
        branch,
        mention,
        note,
    )
    root_path = os.getcwd()
    folder_name = str(uuid.uuid1())
    # os.makedirs(folder_name)

    # utils.command("cd "+ folder_name)


    command1 = "git clone {} {} && cd {} && git checkout {}".format(project['url'], folder_name, folder_name, branch)
    print(command1)
    os.system(command1)

    os.system("cd {} && cnpm install && cnpm run build_online".format(folder_name))

    build_info_url = os.path.join(
        root_path, folder_name, "buildInfo.json"
    )

    build_info = get_build_info(build_info_url)

    zip_name = build_info["date"] + ".zip"
    project_name = build_info["projectName"] if "projectName" in build_info else project["name"]
    zip_folder = build_info["zipFolder"]
    
    print(build_info)

    zip(zip_name, zip_folder, folder_name)

    ssh_scp_files(
        ssh_host=server_info["host"],
        ssh_user=server_info["username"],
        ssh_password=server_info["password"],
        source_volume=os.path.join(folder_name, zip_name),
        destination_volume=server_info["path"],
    )

    send_msg_to_wechat(
        project_name=project_name,
        branch=branch,
        mention=mention,
        note=note,
        zip_name=zip_name,
    )

    os.chdir(root_path)

    os.system("rm -rf {}".format(folder_name))


def zip(zip_name="none.zip", zip_folder="public", folder_name=""):
    os.system('cd {} && zip -r -X {} {}'.format(folder_name, zip_name, zip_folder))

# SSH/SCP Directory Recursively


def ssh_scp_files(ssh_host, ssh_user, ssh_password, source_volume, destination_volume):
    print("scp info:", source_volume, destination_volume)
    ssh = SSHClient()
    ssh.load_system_host_keys()
    ssh.connect(ssh_host, username=ssh_user,
                password=ssh_password, look_for_keys=False)

    with SCPClient(ssh.get_transport()) as scp:
        scp.put(source_volume, recursive=True, remote_path=destination_volume)


def send_msg_to_wechat(project_name, branch, mention, note, zip_name):
    download_url = 'http://{}:{}/{}'.format(
        server_info["host"], server_info["download_port"], zip_name)

    content = '''【最新前端包】
    项目名称：{}
    git打包分支：{}
    备注：{}
    下载：{}
    '''.format(project_name, branch, note, download_url)

    key = "fc686d11-d2ef-4417-abb6-2d497945fa2a"

    command = '''
    curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=%s' \
    -H 'Content-Type: application/json' \
    -d '
    {
          "msgtype": "text",
          "text": {
            "mentioned_list":["%s"],
            "content": "%s"
          }
    }'
    ''' % (key, mention, content)

    print(command)

    os.system(command)


def get_build_info(url):

    #if not os.path.exists("buildInfo.json"):
        #return {
            #"date": "2020_12_10-20:10:10",
            #"zipFolder": "dist public",
            #"projectName": "xxx项目"
        #}

    f = open(url, "r", encoding='utf-8', errors='ignore')
    info = json.load(f)
    return info


