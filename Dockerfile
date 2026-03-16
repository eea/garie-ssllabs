FROM node:20-bookworm

ARG TESTSSL_VERSION=v3.2.3

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    openssl \
    bsdextrautils \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --branch ${TESTSSL_VERSION} --depth 1 https://github.com/testssl/testssl.sh.git /opt/testssl.sh && \
    ln -s /opt/testssl.sh/testssl.sh /usr/local/bin/testssl.sh

RUN mkdir -p /usr/src/garie-plugin
RUN mkdir -p /usr/src/garie-plugin/reports

WORKDIR /usr/src/garie-plugin

COPY package.json .

RUN cd /usr/src/garie-plugin && npm install

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb && \
    dpkg -i dumb-init_*.deb

COPY . .

EXPOSE 3000

VOLUME ["/usr/src/garie-plugin/reports"]

ENTRYPOINT ["/usr/src/garie-plugin/docker-entrypoint.sh"]

CMD ["/usr/bin/dumb-init", "npm", "start"]
