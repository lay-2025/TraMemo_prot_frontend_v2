# ルートディレクトリでDocker buildを実行する
# 1. ビルド用ステージ
FROM node:20 AS build
WORKDIR /app

# 依存関係ファイルだけを先にコピー（キャッシュ効率化）
COPY ../../../package.json ../../../package-lock.json ./
RUN npm ci

# 残りのソースをコピー
COPY ../../../ ./
RUN npm run build

# 2. 配信用ステージ
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY infra/gcp_front/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]