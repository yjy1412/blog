FROM node:18-alpine

# docker 내부에 생성될 작업 디렉터리 경로
WORKDIR /usr/src/app

# 복사대상: 대상 / 작업 디렉터리 순으로 지정
COPY package*.json .
# npm 모듈 우선 설치
RUN yarn install

# 소스코드 복사: 대상 / 작업 디렉터리 순으로 지정
COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]
