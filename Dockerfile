FROM node:8.10.0

RUN mkdir -p /usr/src/garie-ssllabs
RUN mkdir -p /usr/src/garie-ssllabs/reports

WORKDIR /usr/src/garie-ssllabs

COPY package.json .

RUN cd /usr/src/garie-ssllabs && npm install

COPY . .

EXPOSE 3000

VOLUME ["/usr/src/garie-ssllabs/reports"]

ENTRYPOINT ["/usr/src/garie-ssllabs/docker-entrypoint.sh"]

CMD ["npm", "start"]