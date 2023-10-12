# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install basic tools
RUN apt-get install -y sudo
RUN apt-get install -y curl
RUN apt-get install -y unzip

# Install cron
RUN apt-get install -y cron

# Install Caddy (web server)
RUN apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
RUN sudo apt-get update
RUN sudo apt-get install -y caddy

# Install all node_modules, including dev dependencies
FROM base as deps

COPY etc/crontab /myapp/etc/crontab
COPY repeat_every_1min.sh /myapp/repeat_every_1min.sh
COPY every_1min.sh /myapp/every_1min.sh

COPY run_cobralo.sh /myapp/run_cobralo.sh
RUN chmod +x /myapp/run_cobralo.sh

WORKDIR /myapp

ADD package.json package-lock.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

COPY --from=deps /myapp/etc/crontab /myapp/etc/crontab
COPY --from=deps /myapp/repeat_every_1min.sh /myapp/repeat_every_1min.sh

COPY --from=deps /myapp/every_1min.sh /myapp/every_1min.sh

ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

COPY --from=deps /myapp/etc/crontab /myapp/etc/crontab
COPY --from=deps /myapp/repeat_every_1min.sh /myapp/repeat_every_1min.sh
RUN chmod +x /myapp/repeat_every_1min.sh

COPY --from=deps /myapp/every_1min.sh /myapp/every_1min.sh

COPY --from=deps /myapp/run_cobralo.sh /myapp/run_cobralo.sh
RUN chmod +x /myapp/run_cobralo.sh

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/dist /myapp/dist
COPY --from=build /myapp/public /myapp/public

COPY --from=build /myapp/etc/crontab /myapp/etc/crontab

COPY --from=build /myapp/repeat_every_1min.sh /myapp/repeat_every_1min.sh
RUN chmod +x /myapp/repeat_every_1min.sh

COPY --from=build /myapp/every_1min.sh /myapp/every_1min.sh
RUN chmod +x /myapp/every_1min.sh

COPY --from=build /myapp/run_cobralo.sh /myapp/run_cobralo.sh
RUN chmod +x /myapp/run_cobralo.sh

RUN ls -lah .
RUN ls -lah ./etc

ADD . .

RUN chmod +x /myapp/every_1min.sh
RUN chmod +x /myapp/run_cobralo.sh

RUN ls -lah .
RUN ls -lah /myapp/etc

EXPOSE 8080

###############################################################################
# Publish
###############################################################################

# FROM prerequisites AS publish

# EXPOSE 8080



###############################################################################
# Run
###############################################################################

# FROM publish AS run

CMD /myapp/run_cobralo.sh
# CMD ["npm", "start"]
