FROM node:14.17.3-alpine

ENV HOME=/front \
    LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    HOST=0.0.0.0

WORKDIR ${HOME}

COPY . .

RUN apk update && yarn install

EXPOSE 80
