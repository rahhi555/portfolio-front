FROM node:14.17.3-alpine

ENV HOME=/front \
    LANG=C.UTF-8 \
    TZ=Asia/Tokyo \
    HOST=0.0.0.0

WORKDIR ${HOME}

RUN apk update && yarn install

ENTRYPOINT [ "/front/entrypoint.sh" ]