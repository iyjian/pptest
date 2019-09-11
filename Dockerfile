FROM node:10.16.3-stretch

ARG mirror

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

ENV TZ=Asia/Shanghai

RUN rm /etc/localtime && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apt-get install -y locales && \
    locale-gen && \
    sed -i 's/# zh_CN.UTF-8 UTF-8/zh_CN.UTF-8 UTF-8/g' /etc/locale.gen && \
    locale-gen && update-locale

ENV LANG="zh_CN.UTF-8"

RUN locale -a

RUN npm config set registry=http://registry.npm.taobao.org -g

WORKDIR /home/work

COPY package*.json ./

RUN npm install

COPY . ./

# remove after wechaty add puppet-padplus support
RUN cd wechaty && npm install  
RUN cd wechaty && npm run dist

ENTRYPOINT ["node", "src"]