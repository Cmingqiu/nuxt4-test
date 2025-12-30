# 阶段1: 构建阶段
FROM node:22-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile
# RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 阶段2: 生产运行阶段
FROM node:22-alpine AS runner

WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# 只复制构建产物（.output 目录是独立的，不需要 node_modules）
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./.output

# 切换到非 root 用户
USER nuxtjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]

