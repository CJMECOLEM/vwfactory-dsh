# vwFactory for DeepSeek Harness

在 DeepSeek Harness（DSH）里直接使用 Factory 账号的模型。

- 40+ 模型：Claude / GPT / DeepSeek / Kimi / GLM / MiniMax 等，支持发图片
- 多账号：额度用完或出错自动切号，可选按对话均衡分配
- 额度显示在输入框下方，快用完时弹窗提醒
- Key 只存在本机，用 Windows 账户加密（DPAPI）

## 安装

1. 到 [Releases](../../releases/latest) 下载最新的 `vwfactory-dsh-vX.Y.Z.zip` 并解压
2. 双击 `install.bat`（DSH 正在运行时会询问是否自动重启，回车即可）
3. DSH → 设置 → Factory 账号 → 粘贴 key（每行一个：`邮箱----fk-xxxx`）

升级：直接安装新版本，账号保留。卸载：双击 `uninstall.bat`（加 `-RemoveData` 连账号数据一起删）。

更多说明见 [README.txt](README.txt)，更新记录见 [CHANGELOG.txt](CHANGELOG.txt)。

## 目录

| 路径 | 内容 |
|---|---|
| `plugin/` | DSH 插件：`index.js`（宿主端：本机代理 127.0.0.1:4199、账号/额度/切号）、`client.js`（界面：设置页、额度胶囊、提醒） |
| `templates/llm-pi-ai.yml` | 安装时写入 `cordis.patch.yml` 的模型提供方配置 |
| `install.ps1` / `uninstall.ps1` | 安装 / 卸载脚本（`.bat` 为双击入口） |
| `pack.ps1` | 打包到 `dist/vwfactory-dsh-v<版本>.zip`，版本号取自 `plugin/package.json` |

发布流程：改 `plugin/package.json` 版本号 → 更新 `CHANGELOG.txt` → `powershell -ExecutionPolicy Bypass -File pack.ps1` → 把 zip 上传到 Releases。

## 说明

本项目与 Factory.ai 官方无关，使用自己的账号需遵守 Factory 的服务条款。MIT License。
