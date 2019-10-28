FROM node:13-alpine

COPY / /notica/

WORKDIR /notica/

RUN addgroup -S notica && \
    adduser -S notica -G notica && \
    apk add -U tzdata tini && \
    yarn install && \
    chown -R notica:notica /notica/ && \
    chmod +x /notica/entrypoint

USER notica

EXPOSE 3000

ENTRYPOINT ["tini", "--", "/notica/entrypoint"]

CMD ["yarn","start","--host","0.0.0.0","--port","3000"]
