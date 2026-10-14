# 参与贡献

谢谢你愿意帮忙！这份文档说明怎么在本地改、怎么测、提 PR 前要检查什么。有问题直接开 Issue 问就好。

## 准备

- Windows 10 / 11，已安装并**启动过一次** DeepSeek Harness
- Node.js 18+（只用来跑测试，插件本身不需要构建）
- 一个 Factory 账号（只改界面的话可以不要，用 `tools/preview` 就行）

## 改代码

项目没有构建步骤，`plugin/` 里的文件就是 DSH 实际加载的文件。

| 文件 | 跑在哪 | 改完怎么生效 |
|---|---|---|
| `plugin/client.js` | DSH 界面（React，通过 `window.__ModuleLoader__` 加载） | 运行 `install.bat` 后，在 DSH 里按 `Ctrl+R` |
| `plugin/index.js` | DSH 宿主进程（Node） | 运行 `install.bat` 后，完全退出并重启 DSH |
| `templates/llm-pi-ai.yml` | 安装时写进 DSH 配置 | 运行 `install.bat` |

`install.bat` 会把**当前目录**的代码装进 `%USERPROFILE%\.dsh\profiles\desktop\plugins\vwFactory`，账号数据（`~/.vwFactory`）不受影响。

> `plugin/index.js` 最初是从 TypeScript 打包出来的（文件里还能看到 `// src/...` 注释），但 TS 源码不在仓库里，现在直接改 `index.js` 即可。

### 只改界面：不装 DSH 也能预览

用浏览器打开 `tools/preview/gallery.html`，它用假数据（alice / bob / carol@example.com）渲染 `plugin/client.js`：

| 参数 | 内容 |
|---|---|
| `?shot=settings` | 设置页 |
| `?shot=settings-dark` | 设置页（深色） |
| `?shot=balance` | 均衡模式 |
| `?shot=pill` | 输入框下方的额度胶囊 + 弹出面板 |

在参数后面加 `-en` 可以看英文文案（例如 `?shot=settings-en`）。改了界面后，运行 `powershell -ExecutionPolicy Bypass -File tools/preview/render.ps1` 重新生成 README 里的截图（需要 Edge 和网络，React 从 unpkg 加载）。

## 测试

```powershell
node tests/proxy.test.mjs   # 代理：模拟 Factory 上游，测中文分包、断流、超时、重试、切号、Gemini / Grok 路由等
node tests/i18n.test.mjs    # 文案：zh / en 的 key 必须一一对应，且没有用不到的 key
```

- 改了 `index.js` 里转发、重试、切号相关的逻辑，请在 `tests/proxy.test.mjs` 里补一个用例：最好先确认它在改之前会失败
- 加了界面文案，`zh` 和 `en` 两份字典都要加，否则 `i18n.test.mjs` 不通过
- 涉及真实模型行为的改动（比如新模型、新路由），请在 PR 里写明你用真实账号测过哪些模型、结果如何

## 文件编码（重要）

Windows PowerShell 5.1 读不带 BOM 的 UTF-8 脚本会把中文读乱，所以几类文件的编码要求不一样。编辑器保存时请保持原样：

| 文件 | 编码 | 换行 |
|---|---|---|
| `*.ps1`、`README.txt`、`CHANGELOG.txt` | UTF-8 **带 BOM** | CRLF |
| `plugin/client.js` | UTF-8 无 BOM | CRLF |
| `plugin/index.js`、`tests/*`、`*.md` | UTF-8 无 BOM | LF |

`.gitattributes` 设了 `* -text`，Git 不会自动转换换行，所以 diff 里突然出现整个文件都变了，多半是换行或 BOM 被编辑器改了。

## 提 PR 前

- [ ] `node tests/proxy.test.mjs` 和 `node tests/i18n.test.mjs` 都通过
- [ ] 在 DSH 里实际试过（界面改动附截图更好）
- [ ] 文件编码和换行没有被改（见上表）
- [ ] 用户能感知到的改动，在 `CHANGELOG.txt` 最上面的「未发布」下写一行（用用户能看懂的话）
- [ ] 截图、日志里没有真实的邮箱和 API Key

## 发布（维护者）

1. 改 `plugin/package.json` 的版本号，把 `CHANGELOG.txt` 的「未发布」改成版本号
2. `powershell -ExecutionPolicy Bypass -File pack.ps1`：先跑测试，不过会中止；输出 `dist/vwfactory-dsh-v<版本>.zip`
3. 提交、打 tag `v<版本>` 并推送
4. 新建 GitHub Release，上传 zip。插件的在线更新读取 `releases/latest`，按文件名 `vwfactory-dsh-v*.zip` 找更新包，并校验 GitHub 给出的 SHA-256

## 行为准则

友善、就事论事。本项目与 Factory.ai 官方无关，请不要在 Issue 里贴别人的账号或 Key。
