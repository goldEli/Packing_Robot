# -*- coding: utf-8 -*-
'''
@Author: miaoyu
@Date: 2020-06-03 12:17:10
@LastEditTime: 2020-06-04 18:52:25
@LastEditors: miaoyu
@Description:
'''

from flask import Flask, escape, request, jsonify
import pathlib
import os
import subprocess
import asyncio
import json

import utils

app = Flask(__name__)

ROOT_PATH = pathlib.Path().absolute()

GIT_FOLDER = "git_folder"

GIT_FOLDER_PATH = os.path.join(ROOT_PATH, GIT_FOLDER)

@app.route('/')
def hello():
    return 'This a flask server'


@app.route('/project_list', methods=["GET","POST"])
def project_list():
    return success_data(get_projects())

@app.route('/branch_list', methods=["GET","POST"])
def branch_list():
    id = request.get_json()['id']
    dir = create_project_path(id)
    data = get_branch_list(dir)
    return success_data(json.dumps(data))

def success_data(data, msg="success"):
    return {
        "status": 1,
        "message": msg,
        "data": data
    }

def error_data(msg = "error"):
    return {
        "status": 0,
        "message": msg,
        "data": None
    }

def get_projects():
    '''
    获取所有工程信息
    '''
    f = open('config.json', 'r')    
    config = json.load(f)
    return config['project']


def handle_clone():
    '''
    克隆所有项目到本地
    '''
    project_list = get_projects()
    for project in project_list:
        url = project['url']
        folder = create_project_path(project['id'])
        utils.command(
            "git clone " + url + " " + folder
        )

def create_git_folder():
    '''
    创建git文件夹
    '''
    if not os.path.exists(GIT_FOLDER_PATH):
        print("path doesn't exist. trying to make")
        os.makedirs(GIT_FOLDER_PATH)

def create_project_path(id):
    '''
    创建项目文件路径
    '''
    return GIT_FOLDER_PATH+"/"+id

def get_branch_list(dir):
    '''
    获取分支列表
    '''
    name = "refs/remotes/origin/"
    l = utils.command(
        "git --git-dir " + dir + "/.git for-each-ref --format='%(refname)'"
    )
    branch = l.split()
    branch = filter(
        lambda x: name in x and "HEAD" not in x,
        branch
    )
    branch = map(lambda x: x[1: -1], branch)
    branch = map(lambda x: x.replace(name, ""), branch)
    return list(branch)


if __name__ == "__main__":

    create_git_folder()
    handle_clone()
    app.run(debug=True, host='0.0.0.0', port=8088)
