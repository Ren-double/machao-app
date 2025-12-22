# Android 构建指南

本指南将帮助您将 Code Wave 项目打包为 Android APK 文件。

## 方法一：使用 EAS Build（推荐）

这种方法使用 Expo 的云端服务器进行打包，不需要您在本地安装复杂的 Android 开发环境 (Android Studio, JDK 等)。

### 1. 安装 EAS CLI
如果您尚未安装 EAS CLI，请在终端运行：

```bash
npm install -g eas-cli
```

### 2. 登录 Expo 账号
```bash
npx eas-cli login
```

### 3. 网络配置（中国大陆用户必看）
由于 EAS Build 需要连接 Google Cloud 服务，在中国大陆网络环境下可能会遇到 `ECONNRESET` 或 TLS 连接错误。我们提供了一个自动化脚本来解决此问题。

**使用自动化代理构建脚本（Windows PowerShell）：**

确保您的 VPN 已开启，然后在项目根目录下运行：

```powershell
./build_with_proxy.ps1
```

该脚本会自动：
1. 检测您的 VPN 代理端口。
2. 验证与 Expo 服务器的连通性。
3. 设置临时的环境变量。
4. 启动构建流程。

**手动设置代理：**
如果您不使用脚本，也可以手动设置环境变量：

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7890"  # 请替换为您实际的代理端口
$env:HTTPS_PROXY="http://127.0.0.1:7890"
npx eas-cli build --platform android --profile preview
```

### 4. 开始构建
如果您网络环境良好，可以直接运行：

```bash
npx eas-cli build --platform android --profile preview
```

- `--profile preview`: 生成可直接安装的 `.apk` 文件。
- 构建完成后，终端会显示下载链接和二维码。

---

## 方法二：本地构建 (Local Build)

如果您希望在自己的电脑上完全控制构建过程，可以使用此方法。
**前提**：您需要安装 Android Studio、Java JDK 和 Android SDK。

1. **生成 Android 原生项目**
   ```bash
   npx expo prebuild
   ```

2. **执行构建命令**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **获取 APK**
   构建成功后，APK 文件位于：`android/app/build/outputs/apk/release/app-release.apk`

---

## 常用命令

- **查看构建历史**：`npx eas-cli build:list --limit 5`
- **取消构建**：`npx eas-cli build:cancel <BUILD_ID>`
