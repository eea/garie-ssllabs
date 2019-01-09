FROM node:8.10.0

RUN mkdir -p /usr/src/garie-ssslabs
RUN mkdir -p /usr/src/garie-ssslabs/reports

WORKDIR /usr/src/garie-ssslabs

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

VOLUME ["/usr/src/garie-ssslabs/reports", "/usr/src/garie-lighthouse/logs"]

ENTRYPOINT ["/usr/src/garie-ssslabs/docker-entrypoint.sh"]

CMD ["npm", "start"]
