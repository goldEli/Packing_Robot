/*
 * @Author: miaoyu
 * @Date: 2020-06-01 17:13:15
 * @LastEditTime: 2020-06-02 19:10:54
 * @LastEditors: miaoyu
 * @Description:
 */

package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	// "server/utils"
)

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "A Go Web Server")
}

// type Project struct {
// 	id   string
// 	name string
// }

// type User struct {
// 	Status  int     `json:"status"`
// 	Message string  `json:"message"`
// 	data    Project `json:"data"`
// }

// func getProject(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")
// 	user := User{
// 		Status:  1,
// 		Message: "success",
// 		data:    Project{id: "1", name: "1"},
// 	}

// 	a := Project{id: "1", name: "1"}
// 	fmt.Println(a)

// 	json.NewEncoder(w).Encode(user)
// }

type ResponseData struct {
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type Data struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func (c *ResponseData) setSuccess() {
	c.Status = 1
	c.Message = "success"
}
func (c *ResponseData) setError() {
	c.Status = 0
	c.Message = "error"
}

func (c *ResponseData) getProject(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	data := []Data{
		Data{"git@10.0.5.16:miner/miner-dev/ueqa-fe.git", "智能操作助手前端工程"},
		Data{"git@10.0.5.16:miner/miner-dev/ueqa-chat_robot_emebedding.git", "智能操作助手嵌入脚本前端工程"},
		Data{"git@10.0.5.16:miner/miner-dev/ue-miner-fe.git", "智能可视化引擎前端工程"},
	}

	c.Data = data
	c.setSuccess()

	json.NewEncoder(w).Encode(c)
}

func main() {

	responseData := ResponseData{0, "error", ""}

	http.HandleFunc("/", home)
	http.HandleFunc("/getProject", responseData.getProject)
	http.ListenAndServe(":8088", nil)
}
