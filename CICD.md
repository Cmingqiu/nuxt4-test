# CI/CD 部署指南

本文档介绍如何为 Nuxt4 应用配置自动化 CI/CD 部署。

## 方案概览

| 方案           | 适用场景             | 复杂度 | 推荐指数   |
| -------------- | -------------------- | ------ | ---------- |
| GitHub Actions | 使用 GitHub 托管代码 | ⭐⭐   | ⭐⭐⭐⭐⭐ |
| Webhook + 脚本 | 任意 Git 平台        | ⭐     | ⭐⭐⭐⭐   |
| 手动部署       | 临时/测试环境        | ⭐     | ⭐⭐       |

---

## 方案一：GitHub Actions（推荐）

### 工作流程

```
代码推送 → GitHub Actions 构建 → SSH 连接服务器 → 拉取代码 → Docker 构建部署
```

### 配置步骤

#### 1. 配置 GitHub Secrets

进入你的 GitHub 仓库 → Settings → Secrets and variables → Actions，添加以下 Secrets：

| Secret 名称      | 说明             | 示例                                 |
| ---------------- | ---------------- | ------------------------------------ |
| `SERVER_HOST`    | 服务器 IP 或域名 | `192.168.1.100` 或 `your-server.com` |
| `SERVER_USER`    | SSH 用户名       | `root` 或 `deploy`                   |
| `SERVER_SSH_KEY` | SSH 私钥         | 服务器的 `~/.ssh/id_rsa` 内容        |
| `SERVER_PORT`    | SSH 端口（可选） | `22`                                 |
| `DEPLOY_PATH`    | 部署目录（可选） | `/opt/nuxt4-test`                    |

#### 2. 生成 SSH 密钥对

在服务器上执行：

```bash
# 生成密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# 将公钥添加到 authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# 复制私钥内容到 GitHub Secrets (SERVER_SSH_KEY)
cat ~/.ssh/github_deploy
```

#### 3. 推送代码触发部署

```bash
git add .
git commit -m "feat: add CI/CD"
git push origin main
```

推送到 `main` 或 `master` 分支会自动触发部署。

### 查看部署状态

- GitHub 仓库 → Actions 标签页查看运行状态
- 点击具体的 workflow run 查看详细日志

---

## 方案二：Webhook + 脚本

适用于任意 Git 平台（GitHub、GitLab、Gitee 等）。

### 工作流程

```
代码推送 → Git 平台发送 Webhook → 服务器接收 → 执行部署脚本
```

### 配置步骤

#### 1. 在服务器上启动 Webhook 服务

```bash
# 设置环境变量
export WEBHOOK_SECRET="your-secret-key"
export WEBHOOK_PORT=9000

# 启动 webhook 服务
cd /opt/nuxt4-test
node scripts/webhook-server.js

# 或使用 pm2 后台运行
pm2 start scripts/webhook-server.js --name webhook
```

#### 2. 配置 Git 平台 Webhook

**GitHub:**

1. 仓库 → Settings → Webhooks → Add webhook
2. Payload URL: `http://your-server:9000/webhook`
3. Content type: `application/json`
4. Secret: 与 `WEBHOOK_SECRET` 相同
5. 选择 "Just the push event"

**GitLab:**

1. 项目 → Settings → Webhooks
2. URL: `http://your-server:9000/webhook`
3. Secret token: 与 `WEBHOOK_SECRET` 相同
4. 勾选 "Push events"

**Gitee:**

1. 仓库 → 管理 → WebHooks → 添加
2. URL: `http://your-server:9000/webhook`
3. 密码: 与 `WEBHOOK_SECRET` 相同
4. 选择 "Push"

#### 3. 使用 systemd 管理 Webhook 服务

创建服务文件 `/etc/systemd/system/webhook.service`:

```ini
[Unit]
Description=Deployment Webhook Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/nuxt4-test
Environment=WEBHOOK_SECRET=your-secret-key
Environment=WEBHOOK_PORT=9000
ExecStart=/usr/bin/node scripts/webhook-server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook
systemctl status webhook
```

---

## 方案三：手动部署

### 首次部署

```bash
# 1. 登录服务器
ssh user@your-server

# 2. 克隆项目
git clone https://github.com/your-username/nuxt4-test.git /opt/nuxt4-test
cd /opt/nuxt4-test

# 3. 构建并启动
docker compose up --build -d --profile with-nginx
```

### 后续更新

```bash
# 使用部署脚本
cd /opt/nuxt4-test
./scripts/deploy.sh

# 或手动执行
git pull origin main
docker compose up --build -d --profile with-nginx
```

---

## 服务器初始化

首次配置服务器时，使用初始化脚本：

```bash
# 下载并执行（需要修改 GIT_REPO 变量）
curl -sSL https://raw.githubusercontent.com/your-username/nuxt4-test/main/scripts/setup-server.sh | \
  GIT_REPO=https://github.com/your-username/nuxt4-test.git \
  DEPLOY_DIR=/opt/nuxt4-test \
  sudo bash

# 或者先克隆再执行
git clone https://github.com/your-username/nuxt4-test.git /opt/nuxt4-test
cd /opt/nuxt4-test
sudo ./scripts/setup-server.sh
```

---

## 常用命令

```bash
# 查看容器状态
docker compose --profile with-nginx ps

# 查看日志
docker compose --profile with-nginx logs -f

# 查看特定服务日志
docker compose logs -f nuxt-app
docker compose logs -f nginx

# 重启服务
docker compose --profile with-nginx restart

# 停止服务
docker compose --profile with-nginx down

# 完全清理重建
docker compose --profile with-nginx down -v
docker system prune -af
docker compose up --build -d --profile with-nginx
```

---

## 回滚部署

```bash
# 查看提交历史
git log --oneline -10

# 回滚到指定版本
git checkout <commit-hash>

# 重新部署
docker compose up --build -d --profile with-nginx

# 如果需要恢复到最新版本
git checkout main
docker compose up --build -d --profile with-nginx
```

---

## 安全建议

1. **使用非 root 用户部署**

   ```bash
   # 创建部署用户
   useradd -m -s /bin/bash deploy
   usermod -aG docker deploy
   ```

2. **配置防火墙**

   ```bash
   # 只开放必要端口
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 22/tcp
   ufw enable
   ```

3. **定期更新**

   ```bash
   # 更新系统
   apt update && apt upgrade -y

   # 更新 Docker 镜像
   docker compose pull
   ```

4. **配置 HTTPS**
   - 参考 `nginx.conf` 中的 HTTPS 配置
   - 推荐使用 Let's Encrypt 免费证书

---

## 故障排查

### 部署失败

```bash
# 查看 Docker 构建日志
docker compose --profile with-nginx logs --tail=100

# 检查容器状态
docker ps -a

# 进入容器调试
docker exec -it nuxt4-test sh
```

### 网络问题

```bash
# 检查端口占用
netstat -tlnp | grep -E '80|443|3000'

# 测试内部连通性
docker exec nuxt4-nginx curl -I http://nuxt-app:3000
```

### 健康检查失败

```bash
# 手动测试
curl -I http://localhost:3000
curl -I http://localhost:80
```
