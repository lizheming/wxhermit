FROM node:lts-buster-slim
WORKDIR /app
ENV TZ Asia/Shanghai
ENV NODE_ENV production

COPY package.json production.js /app/
COPY view /app/view
COPY src /app/src

RUN npm install --production

EXPOSE 8360
CMD [ "node", "production.js" ]