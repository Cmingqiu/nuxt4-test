# Nuxt SSR 项目部署指南

本文档详细介绍如何将 Nuxt SSR 项目部署到自建服务器。

## 目录

- [构建项目](#构建项目)
- [部署方式一：直接运行](#部署方式一直接运行)
- [部署方式二：PM2 进程管理](#部署方式二pm2-进程管理)
- [部署方式三：Systemd 服务](#部署方式三systemd-服务)
- [部署方式四：Docker 容器](#部署方式四docker-容器)
- [Nginx 反向代理配置](#nginx-反向代理配置)
- [环境变量配置](#环境变量配置)
- [部署检查清单](#部署检查清单)

---

## 构建项目

在本地或 CI/CD 环境中执行构建命令：

```bash
# 使用 pnpm 构建
pnpm build

# 或使用 npm
npm run build

# 或通过环境变量指定 node-server 预设
NITRO_PRESET=node-server pnpm build
```

构建完成后，会在项目根目录生成 `.output` 文件夹：

```
.output/
├── server/
│   └── index.mjs    # 服务端入口文件
├── public/          # 静态资源
└── nitro.json       # Nitro 配置
```

> ⚠️ `.output` 目录是**独立的**，不依赖 `node_modules`，可以直接部署到服务器。

---

## 部署方式一：直接运行

### 上传文件到服务器

```bash
# 使用 scp
scp -r .output user@your-server:/path/to/app/

# 或使用 rsync（推荐，支持增量同步）
rsync -avz --delete .output user@your-server:/path/to/app/
```

### 启动应用

```bash
# 默认端口 3000
node .output/server/index.mjs

# 指定端口和主机
PORT=8080 HOST=0.0.0.0 node .output/server/index.mjs
```

---

## 部署方式二：PM2 进程管理

PM2 是 Node.js 生产环境推荐的进程管理器，支持集群模式、自动重启、日志管理等功能。

### 安装 PM2

```bash
npm install -g pm2
```

### 创建配置文件

在项目根目录创建 `ecosystem.config.cjs`：

```javascript
module.exports = {
  apps: [
    {
      name: 'nuxt4-test',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max', // 使用所有 CPU 核心
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000
      }
    }
  ]
};
```

### PM2 常用命令

```bash
# 启动应用
pm2 start ecosystem.config.cjs

# 查看状态
pm2 status

# 查看日志
pm2 logs nuxt4-test

# 重启应用
pm2 restart nuxt4-test

# 停止应用
pm2 stop nuxt4-test

# 删除应用
pm2 delete nuxt4-test

# 设置开机自启
pm2 startup
pm2 save
```

---

## 部署方式三：Systemd 服务

适用于 Linux 服务器，使用系统服务管理应用。

### 创建服务文件

创建 `/etc/systemd/system/nuxt-app.service`：

```ini
[Unit]
Description=Nuxt SSR Application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/node /path/to/app/.output/server/index.mjs
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nuxt-app

# 环境变量
Environment=NODE_ENV=production
Environment=HOST=0.0.0.0
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Systemd 常用命令

```bash
# 重新加载配置
sudo systemctl daemon-reload

# 启用开机自启
sudo systemctl enable nuxt-app

# 启动服务
sudo systemctl start nuxt-app

# 查看状态
sudo systemctl status nuxt-app

# 停止服务
sudo systemctl stop nuxt-app

# 重启服务
sudo systemctl restart nuxt-app

# 查看日志
sudo journalctl -u nuxt-app -f
```

---

## 部署方式四：Docker 容器

项目已包含 Docker 配置文件，支持容器化部署。

### 文件说明

| 文件                 | 说明               |
| -------------------- | ------------------ |
| `Dockerfile`         | 多阶段构建配置     |
| `docker-compose.yml` | 容器编排配置       |
| `nginx.conf`         | Nginx 反向代理配置 |
| `.dockerignore`      | 构建忽略文件       |

### 基础部署

```bash
# 构建镜像
docker-compose build

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 带 Nginx 反向代理部署

```bash
# 启动完整服务（含 Nginx）
docker-compose --profile with-nginx up -d
# 或者构建并启动
docker-compose --profile with-nginx up -d --build
```

### Docker 常用命令

```bash
# 重新构建并启动
docker-compose up -d --build

# 查看容器状态
docker-compose ps

# 进入容器调试
docker exec -it nuxt4-test sh

# 查看资源使用
docker stats nuxt4-test

# 清理未使用的镜像
docker image prune -f
```

### 生产环境配置

编辑 `docker-compose.yml` 中的环境变量：

```yaml
environment:
  - NODE_ENV=production
  - NUXT_PUBLIC_API_URL=https://api.example.com
  - NUXT_API_SECRET=your-secret-key
```

---

## Nginx 反向代理配置

生产环境建议使用 Nginx 作为反向代理，处理 SSL、负载均衡和静态资源缓存。

### 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 配置文件

创建 `/etc/nginx/sites-available/nuxt-app`：

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript
               application/rss+xml application/atom+xml image/svg+xml;

    # 静态资源长缓存
    location /_nuxt/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 代理到 Nuxt 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/nuxt-app /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 申请 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

如果需要 HTTPS

1. 准备 SSL 证书（fullchain.pem 和 privkey.pem）
2. 创建 certs 目录并放入证书：

```sh
 mkdir certs
 cp /path/to/fullchain.pem certs/
 cp /path/to/privkey.pem certs/
```

3. 取消 docker-compose.yml 中 certs 挂载的注释
4. 取消 nginx.conf 中 HTTPS 服务器部分的注释
5. 重新启动：docker-compose --profile with-nginx up -d

---

## 环境变量配置

根据 `nuxt.config.ts` 中的配置，可通过环境变量覆盖运行时配置：

| 环境变量                  | 说明               | 默认值      |
| ------------------------- | ------------------ | ----------- |
| `HOST`                    | 监听主机           | `localhost` |
| `PORT`                    | 监听端口           | `3000`      |
| `NUXT_PUBLIC_API_URL`     | API 地址           | `/api`      |
| `NUXT_PUBLIC_API_TIMEOUT` | 请求超时时间       | `30000`     |
| `NUXT_API_SECRET`         | API 密钥（服务端） | -           |

### 使用方式

```bash
# 命令行
NUXT_PUBLIC_API_URL=https://api.example.com node .output/server/index.mjs

# PM2 ecosystem.config.cjs
env: {
  NUXT_PUBLIC_API_URL: 'https://api.example.com'
}

# Docker docker-compose.yml
environment:
  - NUXT_PUBLIC_API_URL=https://api.example.com

# Systemd service 文件
Environment=NUXT_PUBLIC_API_URL=https://api.example.com
```

---

## 部署检查清单

### 部署前

- [ ] 确保所有测试通过
- [ ] 确认环境变量配置正确
- [ ] 检查 `nuxt.config.ts` 生产配置

### 部署中

- [ ] 执行 `pnpm build` 构建项目
- [ ] 上传 `.output` 目录到服务器
- [ ] 配置进程管理器（PM2/Systemd/Docker）
- [ ] 配置反向代理（Nginx）
- [ ] 配置 SSL 证书

### 部署后

- [ ] 验证应用正常运行
- [ ] 检查日志是否有错误
- [ ] 测试所有主要功能
- [ ] 配置监控和告警
- [ ] 设置定期备份

---

## 常见问题

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000

# 或使用 netstat
netstat -tlnp | grep 3000
```

### 2. 权限问题

```bash
# 修改文件权限
chown -R www-data:www-data /path/to/app
chmod -R 755 /path/to/app
```

### 3. 内存不足

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" node .output/server/index.mjs
```

### 4. 502 Bad Gateway

- 检查 Nuxt 应用是否正在运行
- 检查 Nginx 代理配置的端口是否正确
- 查看 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

---

## 参考链接

- [Nuxt 官方部署文档](https://nuxt.com/docs/getting-started/deployment)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx 文档](https://nginx.org/en/docs/)
- [Docker 文档](https://docs.docker.com/)
