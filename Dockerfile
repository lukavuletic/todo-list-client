FROM node:12.0.0

WORKDIR /src

COPY ./package.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]