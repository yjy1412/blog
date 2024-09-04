# 빌드 스테이지
FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

# 프로덕션 스테이지
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

# 프로덕션 의존성만 설치
RUN yarn install --production

COPY --from=builder /usr/src/app/dist ./dist

CMD ["yarn", "start:prod"]
