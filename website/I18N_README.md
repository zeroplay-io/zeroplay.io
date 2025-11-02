# 多语言国际化（i18n）实施文档

## 概述

网站现已支持 **32 种语言**，覆盖全球主要市场。

## 支持的语言

### 已完全翻译（3种）
- **en** - English (英语) - 默认语言
- **zh-Hans** - 简体中文
- **zh-Hant** - 繁体中文

### 基础支持（29种）
以下语言已配置框架，UI元素使用英文fallback，游戏内容会显示英文原文：

**欧洲（10种）**
- **es** - Español (西班牙语)
- **fr** - Français (法语)
- **de** - Deutsch (德语)
- **it** - Italiano (意大利语)
- **pt** - Português (葡萄牙语)
- **pt-BR** - Português (Brasil) (巴西葡萄牙语)
- **ru** - Русский (俄语)
- **nl** - Nederlands (荷兰语)
- **pl** - Polski (波兰语)
- **sv** - Svenska (瑞典语)

**北欧（3种）**
- **no** - Norsk (挪威语)
- **da** - Dansk (丹麦语)
- **fi** - Suomi (芬兰语)

**亚洲（7种）**
- **ja** - 日本語 (日语)
- **ko** - 한국어 (韩语)
- **th** - ไทย (泰语)
- **vi** - Tiếng Việt (越南语)
- **id** - Bahasa Indonesia (印尼语)
- **ms** - Bahasa Melayu (马来语)
- **fil** - Filipino (菲律宾语)
- **hi** - हिन्दी (印地语)

**中东（4种）**
- **ar** - العربية (阿拉伯语) - RTL布局
- **tr** - Türkçe (土耳其语)
- **he** - עברית (希伯来语) - RTL布局
- **fa** - فارسی (波斯语) - RTL布局

**其他（5种）**
- **uk** - Українська (乌克兰语)
- **ro** - Română (罗马尼亚语)
- **cs** - Čeština (捷克语)
- **hu** - Magyar (匈牙利语)

## 功能特性

### 1. 自动语言检测
- 首次访问时根据浏览器语言自动跳转到对应语言版本
- 支持浏览器语言列表匹配和语言映射
- 使用 localStorage 记住用户选择的语言

### 2. 语言切换器
- Docusaurus 自动在导航栏添加语言下拉菜单
- 移动端友好的语言选择界面
- 所有语言间可自由切换

### 3. RTL 布局支持
- 阿拉伯语(ar)、希伯来语(he)、波斯语(fa)自动使用从右到左布局
- 界面元素自动镜像翻转

### 4. SEO 优化
- 每种语言有独立的 URL 路径（如 `/zh-Hans/`, `/ja/`）
- 自动生成 hreflang 标签用于搜索引擎
- 每种语言的sitemap独立生成

## 文件结构

```
website/
├── i18n/                          # 翻译文件目录
│   ├── zh-Hans/                   # 简体中文
│   │   ├── code.json             # 代码中的翻译字符串
│   │   ├── docusaurus-theme-classic/
│   │   │   ├── navbar.json       # 导航栏翻译
│   │   │   └── footer.json       # 页脚翻译
│   │   └── docusaurus-plugin-content-docs/
│   │       └── current/          # 文档翻译
│   ├── ja/                        # 日语
│   ├── es/                        # 西班牙语
│   └── ...                        # 其他语言
│
├── src/
│   ├── data/
│   │   └── games.json            # 游戏数据（包含translations字段）
│   ├── utils/
│   │   └── i18nGames.ts          # 游戏数据本地化工具
│   └── theme/
│       └── Root.tsx              # 自动语言检测组件
│
├── docusaurus.config.ts          # i18n配置
└── static/                        # 静态资源（所有语言共享）
    └── img/                       # 图片资源
```

## 如何添加新语言的翻译

### 1. 翻译UI文字

编辑 `i18n/{locale}/code.json`:
```json
{
  "homepage.hero.title": {
    "message": "翻译后的标题",
    "description": "Home page hero title"
  },
  "homepage.games.title": {
    "message": "我们的游戏"
  },
  "game.button.get": {
    "message": "获取"
  }
}
```

### 2. 翻译导航栏和页脚

编辑 `i18n/{locale}/docusaurus-theme-classic/navbar.json` 和 `footer.json`

### 3. 翻译游戏内容

在 `src/data/games.json` 中为每个游戏添加翻译:
```json
{
  "id": "backgammon",
  "title": "Backgammon - Fair Board Games",
  "subtitle": "Classic strategy board game",
  "description": "...",
  "translations": {
    "zh-Hans": {
      "title": "西洋双陆棋 - 公平棋盘游戏",
      "subtitle": "经典策略棋盘游戏",
      "description": "..."
    },
    "ja": {
      "title": "バックギャモン",
      "subtitle": "クラシック戦略ボードゲーム",
      "description": "..."
    }
  }
}
```

### 4. 重新构建

```bash
npm run build
```

## 开发命令

```bash
# 启动开发服务器（默认语言）
npm start

# 启动指定语言的开发服务器
npm start -- --locale zh-Hans

# 生成翻译模板
npm run write-translations -- --locale ja

# 构建所有语言
npm run build

# 本地预览构建结果
npm run serve
```

## 当前状态

### ✅ 已完成
1. 32种语言的基础框架配置
2. 自动浏览器语言检测和跳转
3. 简体中文和繁体中文的完整翻译
4. 两个游戏（Backgammon, Solitaire）的中文翻译
5. 所有32种语言的成功构建

### ⚠️ 待完成
1. 其他30种语言的UI翻译（目前使用英文fallback）
2. 两个游戏在其他30种语言的内容翻译
3. 文档内容的多语言版本

### 📝 注意事项
- 所有未翻译的内容会自动fallback到英文
- 图片和静态资源在所有语言间共享
- 每种语言的构建都是独立的，互不影响
- RTL语言（ar, he, fa）会自动应用从右到左布局

## 浏览器语言映射

以下浏览器语言码会自动映射到对应的网站语言：

- `zh`, `zh-CN`, `zh-SG` → `zh-Hans` (简体中文)
- `zh-TW`, `zh-HK`, `zh-MO` → `zh-Hant` (繁体中文)
- `pt` → `pt-BR` (默认使用巴西葡萄牙语)
- `tl` → `fil` (塔加洛语→菲律宾语)
- `iw` → `he` (旧希伯来语码→新码)
- `nb`, `nn` → `no` (挪威语变体→挪威语)

## 部署

构建后的 `build/` 目录结构：
```
build/
├── index.html              # 英文版（根路径）
├── zh-Hans/               # 简体中文版
├── ja/                    # 日语版
├── es/                    # 西班牙语版
└── ...                    # 其他语言版本
```

直接将整个 `build/` 目录部署到 Web 服务器即可。

## 技术栈

- **Docusaurus 3.5.2** - 静态站点生成器
- **React 18** - UI框架
- **TypeScript** - 类型安全

## 联系

如有问题或需要添加新语言支持，请联系开发团队。
