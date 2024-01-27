FROM node:10-alpine

RUN npm cache clean --force && \
	npm config set strict-ssl false && \
	apk add wget unzip &&  \
    mkdir gremlin-visualizer-master

COPY . /gremlin-visualizer-master
#	wget --no-check-certificate https://github.com/prabushitha/gremlin-visualizer/archive/master.zip && \
#	unzip master.zip && \

RUN cd gremlin-visualizer-master && \
	npm install

EXPOSE 3000 3001

WORKDIR /gremlin-visualizer-master

CMD npm start
