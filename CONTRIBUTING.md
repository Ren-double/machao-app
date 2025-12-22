# 贡献指南 (Contributing Guide)

感谢你对 **码潮 (MaChao)** 感兴趣！我们非常欢迎社区的贡献。

## 如何参与贡献

### 1. 提交 Issue
如果你发现了 Bug 或有新功能的建议，请先搜索现有的 Issues，确保没有重复。如果确认是新的问题，请创建一个 Issue 并清晰地描述：
- 问题的重现步骤
- 期望的行为
- 实际的行为
- 截图或日志（如果有）

### 2. 提交 Pull Request (PR)
如果你想直接贡献代码：

1. **Fork** 本仓库到你的 GitHub 账号。
2. **Clone** 你的 Fork 到本地：
   ```bash
   git clone https://github.com/YOUR_USERNAME/machao-app.git
   ```
3. 创建一个新的分支：
   ```bash
   git checkout -b feature/your-feature-name
   # 或者
   git checkout -b fix/your-bug-fix
   ```
4. 进行代码修改，并确保代码风格一致。
5. 提交你的修改：
   ```bash
   git add .
   git commit -m "feat: 添加了XXX功能"
   ```
6. 推送到你的远程仓库：
   ```bash
   git push origin feature/your-feature-name
   ```
7. 在 GitHub 上发起 Pull Request。

## 开发环境设置

1. 确保安装了 Node.js (推荐 v18+) 和 git。
2. 安装依赖：
   ```bash
   npm install
   ```
3. 配置环境变量：
   复制 `.env.example` 为 `.env` 并填入必要的 API Key (如 GitHub Client ID)。
4. 启动开发服务器：
   ```bash
   npx expo start
   ```

## 代码规范
- 我们使用 TypeScript，请确保类型定义清晰。
- 遵循 React Hooks 的最佳实践。
- 提交信息请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

感谢你的贡献！让我们一起把码潮变得更好！
