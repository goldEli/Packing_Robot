# -*- coding: utf-8 -*-
'''
@Author: miaoyu
@Date: 2020-06-03 12:17:10
@LastEditTime: 2020-06-03 13:13:33
@LastEditors: miaoyu
@Description: 
'''

from flask import Flask, escape, request, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return 'This a flask server' 

@app.route('/getProject')
def getProject():
    data = {
        "status": 1,
        "message": "success",
        "data": [
            {"id": "git@10.0.5.16:miner/miner-dev/ueqa-fe.git", "name": "智能操作助手前端工程"},
            {"id": "git@10.0.5.16:miner/miner-dev/ueqa-chat_robot_emebedding.git", "name": "智能操作助手嵌入脚本前端工程"},
            {"id": "git@10.0.5.16:miner/miner-dev/ue-miner-fe.git", "name": "智能可视化引擎前端工程"},
        ]
    }
    return data


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8088)