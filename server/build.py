'''
@Author: miaoyu
@Date: 2020-06-22 11:28:23
@LastEditTime: 2020-06-22 15:28:17
@LastEditors: miaoyu
@Description: 
'''

import uuid
import os
import utils


def run(project=None, branch="master", mention=None, note="未备注"):
    print(
        project,
        branch,
        mention,
        note,
    )
    root_path = os.getcwd()
    folder_name = str(uuid.uuid1())
    # os.makedirs(folder_name)

    # utils.command("cd "+ folder_name)

    utils.command("git clone {} {}".format(project['url'], folder_name))

    os.chdir(
        os.path.join(
            root_path, folder_name
        )
    )

    utils.command("yarn")

    utils.command("yarn build")

    os.chdir(root_path)


    # utils.command("rm -rf "+ folder_name)
