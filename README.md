# Packing Robot

## Development
#### browser

```shell
yarn start
```
#### node server 

```shell
cd server_node
yarn start:dev
```

#### python server (deprecation)

```shell
cd server_python
python main.py
```

## Product

#### browser
```shell
cd browser
yarn build
```

#### node server
```shell
cd sever_node
yarn build
```

## Deploy
```shell
cd sever_node/dist
pm2 start main.js
```
