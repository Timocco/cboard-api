# Dockerfile
FROM public.ecr.aws/docker/library/node:16-bullseye
WORKDIR /opt/cboard-api/
COPY . /opt/cboard-api/

RUN yarn install -g node-gyp 
RUN yarn install -g swagger
RUN yarn install

EXPOSE 80 10010
CMD [ "npm", "start"]