# 码潮 (MaChao) - 开源项目发现平台

码潮是一个基于 React Native (Expo) 开发的开源项目发现平台，旨在帮助开发者发现、浏览和追踪 GitHub 上热门和有趣的开源项目。

## 📱 功能特性

*   **首页推荐**:
    *   每日热门项目推荐
    *   GitHub 趋势榜（支持按日、周、月筛选）
    *   支持按编程语言和项目类型进行筛选
    *   项目搜索功能
*   **发现页**:
    *   热门话题浏览
    *   精选项目展示
    *   多维度分类导航
*   **项目详情**:
    *   展示项目详细信息（Star 数、Fork 数、贡献者等）
    *   **实时 Star 趋势图**：直观展示项目近期的 Star 增长情况
    *   项目介绍与 README 预览
    *   一键跳转 GitHub 仓库
*   **个人中心**:
    *   用户登录/注册（支持模拟手机号和 GitHub 登录）
    *   **浏览历史**：自动记录浏览过的项目
    *   **我的收藏**：本地收藏喜欢的项目
    *   **加入天数**：动态计算注册时长
*   **设置与个性化**:
    *   **多语言支持**：支持简体中文、English 等多语言切换（带持久化存储）
    *   **隐私设置**：可管理数据收集与个性化广告开关
    *   账户安全与设备管理

## 🛠 技术栈

*   **框架**: [React Native](https://reactnative.dev/) (0.81.5)
*   **开发工具**: [Expo](https://expo.dev/) (54.0.29) & Expo Router
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **网络请求**: Fetch API (集成 GitHub REST API)
*   **本地存储**: @react-native-async-storage/async-storage
*   **图表库**: react-native-svg (手写 SVG 路径实现轻量级趋势图)
*   **UI 组件**: 
    *   react-native-safe-area-context
    *   expo-linear-gradient
    *   @expo/vector-icons

## 🚀 快速开始

### 前置要求

*   Node.js (推荐 LTS 版本)
*   npm 或 yarn
*   Expo Go App (用于真机调试)

### 安装步骤

1.  **克隆仓库**

    ```bash
    git clone https://github.com/Ren-double/machao-app.git
    cd machao-app
    ```

2.  **配置环境变量**

    在项目根目录下创建一个 `.env` 文件，并添加以下配置：

    ```env
    # GitHub API 配置
    EXPO_PUBLIC_GITHUB_API_URL=https://api.github.com
    
    # GitHub OAuth 配置 (需要在 GitHub Developer Settings 中申请)
    EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
    EXPO_PUBLIC_GITHUB_CLIENT_SECRET=your_github_client_secret
    ```

3.  **安装依赖**

    ```bash
    npm install
    # 或者
    yarn install
    ```

4.  **运行项目**

    ```bash
    npx expo start
    ```

    > **提示**：如果您开启了 VPN 或网络环境复杂，建议使用隧道模式启动，以避免连接问题：
    > ```bash
    > npx expo start --tunnel
    > ```

5.  **预览**
    *   使用 Expo Go App 扫描终端显示的二维码即可在手机上预览。
    *   按 `a` 在 Android 模拟器运行，按 `i` 在 iOS 模拟器运行。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

*   **如何贡献**: 请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解代码规范和贡献流程。
*   **构建指南**: 关于如何打包 Android APK，请参考 [构建指南](./docs/BUILD_CN.md)。

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

## 📂 项目结构


```
app_715333040386/
├── app/                 # Expo Router 路由目录
├── components/          # 公共组件 (如 DonationModal)
├── screens/             # 页面组件
│   ├── p-home/          # 首页
│   ├── p-project_detail/# 项目详情页
│   ├── p-personal_center/# 个人中心
│   └── ...              # 其他页面
├── services/            # 服务层 (GitHub API 封装)
└── assets/              # 静态资源 (图片、字体)
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## ☕感谢支持

如果觉得项目对您有用的话，可以请作者喝一杯咖啡

![](./README.assets/payment-qr.png)
