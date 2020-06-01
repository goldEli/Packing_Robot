/*
 * @Author: miaoyu
 * @Date: 2020-06-01 17:13:15
 * @LastEditTime: 2020-06-01 17:23:03
 * @LastEditors: miaoyu
 * @Description:
 */

package main

import (
	"fmt"
	"net/http"
)

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprint(w, "hello\n")
}

func main() {
	http.HandleFunc("/hello", hello)
	http.ListenAndServe(":8088", nil)
}
