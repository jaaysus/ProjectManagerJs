FROM node:20
WORKDIR /project_manager
COPY package.json /project_manager/
RUN npm install
COPY . /project_manager/
EXPOSE 3000
CMD ["node","server.js"]