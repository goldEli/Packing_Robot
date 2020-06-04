# -*- coding: utf-8 -*-
'''
@Author: miaoyu
@Date: 2020-06-03 17:13:07
@LastEditTime: 2020-06-04 14:41:00
@LastEditors: miaoyu
@Description: 
'''
import subprocess

def command(command):
    command_arr = command.split()
    result = subprocess.run(
        command_arr,
        stdout=subprocess.PIPE
    )

    # if result.stderr:
    #     print(command_arr, result.stderr)
    #     return None
    return result.stdout.decode('utf-8')
