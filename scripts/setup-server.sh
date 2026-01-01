#!/bin/bash

# ===========================================
# 服务器初始化脚本
# 用法: curl -sSL <raw-url> | bash
# 或者: ./scripts/setup-server.sh
# ===========================================

set -e

# 配置变量
DEPLOY_DIR="${DEPLOY_DIR:-/opt/nuxt4-test}"
GIT_REPO="${GIT_REPO:-https://github.com/your-username/nuxt4-test.git}"
BRANCH="${BRANCH:-main}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否以 root 运行
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "请以 root 用户运行此脚本"
        log_info "使用: sudo $0"
        exit 1
    fi
}

# 安装 Docker
install_docker() {
    if command -v docker &> /dev/null; then
        log_info "Docker 已安装: $(docker --version)"
        return
    fi
    
    log_info "安装 Docker..."
    
    # 检测系统类型
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        apt-get update
        apt-get install -y ca-certificates curl gnupg
        install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        chmod a+r /etc/apt/keyrings/docker.gpg
        
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        apt-get update
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        yum install -y yum-utils
        yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    else
        log_error "不支持的操作系统，请手动安装 Docker"
        exit 1
    fi
    
    # 启动 Docker
    systemctl start docker
    systemctl enable docker
    
    log_info "Docker 安装完成: $(docker --version)"
}

# 安装 Git
install_git() {
    if command -v git &> /dev/null; then
        log_info "Git 已安装: $(git --version)"
        return
    fi
    
    log_info "安装 Git..."
    
    if [ -f /etc/debian_version ]; then
        apt-get install -y git
    elif [ -f /etc/redhat-release ]; then
        yum install -y git
    fi
    
    log_info "Git 安装完成"
}

# 克隆项目
clone_project() {
    if [ -d "$DEPLOY_DIR" ]; then
        log_warn "目录已存在: $DEPLOY_DIR"
        read -p "是否删除并重新克隆? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            rm -rf "$DEPLOY_DIR"
        else
            log_info "跳过克隆"
            return
        fi
    fi
    
    log_info "克隆项目到 $DEPLOY_DIR..."
    git clone -b $BRANCH "$GIT_REPO" "$DEPLOY_DIR"
    log_info "克隆完成"
}

# 设置部署脚本权限
setup_scripts() {
    if [ -d "$DEPLOY_DIR/scripts" ]; then
        chmod +x "$DEPLOY_DIR/scripts/"*.sh
        log_info "脚本权限设置完成"
    fi
}

# 创建 systemd 服务（可选）
create_systemd_service() {
    cat > /etc/systemd/system/nuxt4-test.service << EOF
[Unit]
Description=Nuxt4 Test Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/bin/docker compose --profile with-nginx up -d
ExecStop=/usr/bin/docker compose --profile with-nginx down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable nuxt4-test.service
    
    log_info "Systemd 服务创建完成"
    log_info "使用方法:"
    log_info "  启动: systemctl start nuxt4-test"
    log_info "  停止: systemctl stop nuxt4-test"
    log_info "  状态: systemctl status nuxt4-test"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    if command -v ufw &> /dev/null; then
        ufw allow 80/tcp
        ufw allow 443/tcp
        log_info "UFW 防火墙规则已添加"
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-port=80/tcp
        firewall-cmd --permanent --add-port=443/tcp
        firewall-cmd --reload
        log_info "Firewalld 防火墙规则已添加"
    else
        log_warn "未检测到防火墙，请手动开放 80 和 443 端口"
    fi
}

# 显示后续步骤
show_next_steps() {
    echo ""
    echo "=========================================="
    echo "🎉 服务器初始化完成！"
    echo "=========================================="
    echo ""
    echo "后续步骤："
    echo ""
    echo "1. 进入项目目录:"
    echo "   cd $DEPLOY_DIR"
    echo ""
    echo "2. 首次部署:"
    echo "   docker compose up --build -d --profile with-nginx"
    echo ""
    echo "3. 后续更新部署:"
    echo "   ./scripts/deploy.sh"
    echo ""
    echo "4. 查看日志:"
    echo "   docker compose logs -f"
    echo ""
    echo "5. 如需配置 HTTPS，请编辑:"
    echo "   - nginx.conf (取消 HTTPS server 块注释)"
    echo "   - docker-compose.yml (取消 certs 挂载注释)"
    echo "   - 将证书放入 certs/ 目录"
    echo ""
}

# 主流程
main() {
    echo ""
    echo "🚀 Nuxt4 服务器初始化脚本"
    echo "=========================="
    echo ""
    
    check_root
    install_docker
    install_git
    clone_project
    setup_scripts
    create_systemd_service
    configure_firewall
    show_next_steps
}

main "$@"

