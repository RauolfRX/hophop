# create a standard base image that has all the defaults
FROM node:16.13-alpine3.14 as base
ENV NODE_ENV=production
ENV PATH /home/node/app/node_modules/.bin:$PATH
EXPOSE 3000
WORKDIR /home/node/app
RUN apk add --no-cache make g++ python3 libsodium-dev openssl libtool autoconf automake \
	&& rm -rf /var/cache/apk/* \
	&& chown -R node:node /home/node/app
USER node
COPY --chown=node:node package*.json yarn.lock* ./
RUN yarn install --frozen-lockfile --prefer-offline && yarn cache clean --force

# create a build image
FROM base as build
ENV NODE_ENV=development
ENV DATABASE_URL=file:./db.sqlite
COPY --chown=node:node . .
RUN yarn install --prefer-offline && yarn cache clean --force \
	&& blitz prisma migrate deploy --preview-feature \
	&& blitz prisma generate && blitz build
USER node

# create a production image
FROM base as prod
ENV NODE_ENV=production
COPY --chown=node:node --from=build /home/node/app/public /home/node/app/public
COPY --chown=node:node --from=build /home/node/app/db /home/node/app/db
COPY --chown=node:node --from=build /home/node/app/.next /home/node/app/.next
EXPOSE 3000
CMD blitz prisma generate && blitz start
USER node

