/**
 * 简易 Webhook 服务器
 * 用于接收 Git 推送事件并自动触发部署
 *
 * 用法: node scripts/webhook-server.js
 * 环境变量:
 *   - WEBHOOK_SECRET: Webhook 密钥（必须设置）
 *   - WEBHOOK_PORT: 监听端口（默认 9000）
 *   - DEPLOY_SCRIPT: 部署脚本路径（默认 ./scripts/deploy.sh）
 */

import { createServer } from 'http';
import { createHmac } from 'crypto';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 9000,
  secret: process.env.WEBHOOK_SECRET,
  deployScript: process.env.DEPLOY_SCRIPT || join(__dirname, 'deploy.sh'),
  allowedBranches: ['main', 'master']
};

// 验证 Webhook 签名
function verifySignature(payload, signature) {
  if (!CONFIG.secret) {
    console.warn('⚠️  WEBHOOK_SECRET 未设置，跳过签名验证');
    return true;
  }

  if (!signature) {
    return false;
  }

  const hmac = createHmac('sha256', CONFIG.secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return signature === digest;
}

// 执行部署脚本
function runDeploy() {
  console.log('🚀 开始执行部署...');

  const deploy = spawn('bash', [CONFIG.deployScript], {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  });

  deploy.on('close', code => {
    if (code === 0) {
      console.log('✅ 部署完成');
    } else {
      console.error(`❌ 部署失败，退出码: ${code}`);
    }
  });

  deploy.on('error', err => {
    console.error('❌ 部署脚本执行失败:', err.message);
  });
}

// 处理 Webhook 请求
function handleWebhook(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // 验证签名
    const signature =
      req.headers['x-hub-signature-256'] || req.headers['x-gitlab-token'];

    if (!verifySignature(body, signature)) {
      console.error('❌ 签名验证失败');
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.end('Unauthorized');
      return;
    }

    try {
      const payload = JSON.parse(body);

      // GitHub 格式
      let branch = payload.ref?.replace('refs/heads/', '');

      // GitLab 格式
      if (!branch && payload.object_attributes?.ref) {
        branch = payload.object_attributes.ref;
      }

      console.log(`📦 收到推送事件，分支: ${branch}`);

      // 检查是否是允许的分支
      if (CONFIG.allowedBranches.includes(branch)) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Deployment triggered');

        // 异步执行部署
        setImmediate(runDeploy);
      } else {
        console.log(`⏭️  跳过分支: ${branch}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Skipped: not a deployment branch');
      }
    } catch (err) {
      console.error('❌ 解析 payload 失败:', err.message);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
    }
  });
}

// 健康检查
function handleHealth(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
  );
}

// 创建服务器
const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${CONFIG.port}`);

  switch (url.pathname) {
    case '/webhook':
    case '/deploy':
      handleWebhook(req, res);
      break;
    case '/health':
      handleHealth(req, res);
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
  }
});

server.listen(CONFIG.port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║       🎣 Webhook Server 已启动                  ║
╠════════════════════════════════════════════════╣
║  端口: ${CONFIG.port.toString().padEnd(38)}║
║  Webhook URL: http://your-server:${CONFIG.port}/webhook    ║
║  健康检查: http://your-server:${CONFIG.port}/health       ║
╚════════════════════════════════════════════════╝
  `);

  if (!CONFIG.secret) {
    console.warn('⚠️  警告: WEBHOOK_SECRET 未设置，建议设置以确保安全');
  }
});
