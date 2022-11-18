FROM node:latest

WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install --force

EXPOSE 8001 8091 8092 8093 8094 11210

CMD ["npm","run","start"]