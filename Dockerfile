# Dockerfile
FROM public.ecr.aws/docker/library/node:16-bullseye
WORKDIR /opt/cboard-api/
COPY . /opt/cboard-api/

RUN yarn add -g node-gyp 
RUN yarn add -g swagger
RUN yarn install

EXPOSE 80 10010
CMD [ "npm", "start"]