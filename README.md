# vwFactory for DeepSeek Harness

在 DeepSeek Harness（DSH）里直接使用 Factory 账号的模型。

- 40+ 模型：Claude / GPT / DeepSeek / Kimi / GLM / MiniMax 等，支持发图片
- 多账号：额度用完或出错自动切号，可选按对话均衡分配
- 额度显示在输入框下方，快用完时弹窗提醒
- Key 只存在本机，用 Windows 账户加密（DPAPI）

## 使用教程

**一、安装插件**

1. 下载 DeepSeek Harness 并**启动一次**（一定要启动一次，否则 DSH 配置文件夹还没创建）
2. 到 [Releases](../../releases/latest) 下载 `vwfactory-dsh-vX.Y.Z.zip` 并解压
3. 双击 `install.bat`（DSH 正在运行时会询问是否自动重启，直接回车）

**二、添加 Factory 的 API Key**

1. Factory 官网 → Settings → API Keys → Create Key，名字随便起，日期不用选
2. 复制 Key，打开 DSH → 设置 → Factory 账号 → 添加账号，按 `邮箱----Key` 填入（邮箱只用来区分账号；每行一个，可以一次加多个）
   - 也可以像旧版一样，在 DSH 运行时用浏览器打开 http://127.0.0.1:4199/ 导入

**三、开始用**

在输入框右侧的模型选择里，选 Factory (Claude) / Factory (GPT) / Factory 下的模型。

更新：DSH 设置 → Factory 账号 → 插件版本 → 点「更新」，然后重启 DSH（也可以下载新压缩包重新运行 `install.bat`，账号保留）。卸载：双击 `uninstall.bat`（加 `-RemoveData` 连账号数据一起删）。

更多说明见 [README.txt](README.txt)，更新记录见 [CHANGELOG.txt](CHANGELOG.txt)。

## 目录

| 路径 | 内容 |
|---|---|
| `plugin/` | DSH 插件：`index.js`（宿主端：本机代理 127.0.0.1:4199、账号/额度/切号）、`client.js`（界面：设置页、额度胶囊、提醒） |
| `templates/llm-pi-ai.yml` | 安装时写入 `cordis.patch.yml` 的模型提供方配置 |
| `install.ps1` / `uninstall.ps1` | 安装 / 卸载脚本（`.bat` 为双击入口） |
| `pack.ps1` | 打包到 `dist/vwfactory-dsh-v<版本>.zip`，版本号取自 `plugin/package.json`；打包前自动跑 `tests/` |
| `tests/` | 回归测试（不进压缩包）：`proxy.test.mjs` 用模拟上游测代理（中文分包、断流、超时、5xx 重试/借号、429 切号、停止、DPAPI），`i18n.test.mjs` 检查中英文案 |

测试：`node tests/proxy.test.mjs`、`node tests/i18n.test.mjs`（需 Node 18+；DPAPI 部分仅 Windows）。

发布流程：改 `plugin/package.json` 版本号 → 更新 `CHANGELOG.txt` → `powershell -ExecutionPolicy Bypass -File pack.ps1`（测试不过会中止）→ 把 zip 上传到 Releases。

## 说明

本项目与 Factory.ai 官方无关，使用自己的账号需遵守 Factory 的服务条款。MIT License。
