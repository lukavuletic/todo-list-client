This repository is a part of todo-list project. todo-list-client focuses on the client side of the application.

In order to run todo-list-client, in your terminal write `npm i` then `npm start` in root folder of the project.

The other mandatory repository that needs to be ran for this project can be found on this link - https://github.com/lukavuletic/todo-list-api

To run with docker-compose please create a docker-compose.yml file in a folder that includes both todo-list-api and todo-list-client and execute command `docker-compose up --build -d`

docker-compose.yml
```yml:
version: "3"

services:
    postgres:
        image: postgres
        hostname: postgres
        container_name: postgres
        restart: always
        ports:
            - "5433:5432"
        environment: 
            POSTGRES_USER: superuser
            POSTGRES_PASSWORD: superuser
        volumes: 
            - ./postgres-data:/var/lib/postgreslql/data
        networks: 
            - todo-list-network
    api:
        image: todo-list-api
        hostname: api
        container_name: api
        ports:
            - "4000:4000"
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
            - "3000:3000"
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