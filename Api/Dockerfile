FROM node:10

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --build-from-source --unsafe-perm

COPY . .

ENV NODE_ENV docker
ENV PORT 80

EXPOSE 80
CMD ["npm", "start"]