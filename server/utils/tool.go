/*
 * @Author: miaoyu
 * @Date: 2020-06-02 10:14:58
 * @LastEditTime: 2020-06-02 10:14:59
 * @LastEditors: miaoyu
 * @Description:
 */

package utils

import (
	"log"
	"os"
)

func CreateFolder() {
	fileName := "gitFolder"

	_, err := os.Stat(fileName)

	if os.IsNotExist(err) {
		errDir := os.MkdirAll(fileName, 0755)
		if errDir != nil {
			log.Fatal(err)
		}

	}
}
