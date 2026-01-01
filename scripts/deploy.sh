#!/bin/bash

# ===========================================
# 服务器端部署脚本
# 用法: ./scripts/deploy.sh
# ===========================================

set -e  # 遇到错误立即退出

# 配置变量
DEPLOY_DIR="${DEPLOY_DIR:-/opt/nuxt4-test}"
BRANCH="${BRANCH:-main}"
COMPOSE_PROFILE="${COMPOSE_PROFILE:-with-nginx}"
HEALTH_CHECK_PORT="${HEALTH_CHECK_PORT:-3000}"  # nginx 对外暴露的端口

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    log_info "Docker 运行正常"
}

# 进入部署目录
cd_deploy_dir() {
    if [ ! -d "$DEPLOY_DIR" ]; then
        log_error "部署目录不存在: $DEPLOY_DIR"
        exit 1
    fi
    cd "$DEPLOY_DIR"
    log_info "进入目录: $DEPLOY_DIR"
}

# 拉取最新代码
pull_latest() {
    log_info "拉取最新代码..."
    git fetch origin
    git reset --hard origin/$BRANCH
    log_info "代码更新完成"
}

# 构建并重启服务
deploy_services() {
    log_info "开始构建并部署..."
    
    # 停止旧容器（可选，compose up 会自动处理）
    # docker compose --profile $COMPOSE_PROFILE down
    
    # 构建并启动
    docker compose up --build -d --profile $COMPOSE_PROFILE
    
    log_info "服务启动完成"
}

# 清理旧资源
cleanup() {
    log_info "清理旧的 Docker 资源..."
    docker image prune -f
    docker container prune -f
    log_info "清理完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$HEALTH_CHECK_PORT | grep -q "200\|301\|302"; then
            log_info "✅ 健康检查通过！服务已正常运行"
            return 0
        fi
        
        log_warn "等待服务启动... ($attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "❌ 健康检查失败，服务可能未正常启动"
    docker compose --profile $COMPOSE_PROFILE logs --tail=50
    exit 1
}

# 显示状态
show_status() {
    echo ""
    log_info "========== 部署状态 =========="
    docker compose --profile $COMPOSE_PROFILE ps
    echo ""
    log_info "========== 资源使用 =========="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

# 主流程
main() {
    echo ""
    echo "🚀 开始部署 Nuxt4 应用..."
    echo "================================"
    echo ""
    
    check_docker
    cd_deploy_dir
    pull_latest
    deploy_services
    cleanup
    health_check
    show_status
    
    echo ""
    echo "================================"
    log_info "🎉 部署成功完成！时间: $(date)"
    echo ""
}

main "$@"

