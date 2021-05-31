FROM node:16.2.0 AS build

# PREPARE ENVIRONMENT
RUN apt-get update && \
    apt-get install -y openssl

# COPY
COPY . ./

# YARN
RUN yarn install && \
    yarn build && \
    rm -rf node_modules && \
    yarn install --production=true

FROM node:16.2.0

# PREPARE ENVIRONMENT
RUN apt-get update && \
    apt-get install -y openssl && \
    ln -fs /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    npm install -g npm

# EXPOSE
EXPOSE 4000

# LABELS
LABEL maintainer="postmaster@wisekaa.dev"

# SET WORK DIRECTORY
WORKDIR /wisekaa.dev

# COPY NEEDED FILES
COPY --from=build --chown=root ./node_modules ./node_modules
COPY --from=build --chown=root ./dist ./dist
COPY --from=build --chown=root ./docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=build --chown=root ./package.json ./package.json
COPY --from=build --chown=root ./.local/.env ./.local/.env

USER www-data:www-data

# YARN START
ENTRYPOINT [ "/wisekaa.dev/docker-entrypoint.sh", "start" ]
