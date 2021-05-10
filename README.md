This repository is a part of todo-list project. todo-list-client focuses on the client side of the application.

In order to run todo-list-client, in your terminal write `npm i` then `npm start` in root folder of the project.

The other mandatory repository that needs to be ran for this project can be found on this link - https://github.com/lukavuletic/todo-list-api

To run with docker-compose please create a docker-compose.yml file in a folder that includes both todo-list-api and todo-list-client and setup .env file next to docker-compose.yml file then execute command `docker-compose up --build -d`
**Keep in mind that even if you decide to run without docker-compose, you still need .env file setup**

.env
```
PG_PORT_1=HOST_PORT_FOR_POSTGRES
PG_PORT_2=CONTAINER_PORT_FOR_POSTGRES
PG_USER=POSTGRES_USERNAME
PG_PW=POSTGRES_PASSWORD
HOST=HOST_NAME
API_PORT_1=HOST_PORT_FOR_API
API_PORT_2=CONTAINER_PORT_FOR_API
CLIENT_PORT_1=HOST_PORT_FOR_CLIENT
CLIENT_PORT_2=CONTAINER_PORT_FOR_CLIENT
```

docker-compose.yml
```yml:
version: "3"

services:
    postgres:
        image: postgres
        hostname: "${HOST}"
        container_name: postgres
        restart: always
        ports:
            - "${PG_PORT_1}:${PG_PORT_2}"
        environment: 
            POSTGRES_USER: "${PG_USER}"
            POSTGRES_PASSWORD: "${PG_PW}"
        volumes: 
            - ./postgres-data:/var/lib/postgreslql/data
        networks: 
            - todo-list-network
    api:
        image: todo-list-api
        hostname: api
        container_name: api
        ports:
            - "${API_PORT_1}:${API_PORT_2}"
        volumes:
            - /api:/node_modules
        build:
            context: ./todo-list-api
        depends_on:
            - postgres
        networks: 
            - todo-list-network
    client:
        image: todo-list-client
        hostname: client
        container_name: client
        ports:
            - "${CLIENT_PORT_1}:${CLIENT_PORT_2}"
        volumes:
            - /client:/node_modules
        build:
            context: ./todo-list-client
        depends_on:
            - api
        networks: 
            - todo-list-network

networks: 
    todo-list-network:
        driver: bridge

```