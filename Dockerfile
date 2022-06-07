# Dockerfile
FROM public.ecr.aws/docker/library/node:16-bullseye
WORKDIR /opt/cboard-api/
COPY . /opt/cboard-api/

RUN yarn global add node-gyp 
RUN yarn global add swagger
RUN yarn install

EXPOSE 80 10010
CMD [ "npm", "start"]