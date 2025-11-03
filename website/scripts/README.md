# 工具脚本 / Utility Scripts

本目录包含用于维护网站国际化(i18n)的实用工具脚本。

## 脚本列表

### 1. update_game_i18n.py

**用途**: 从CSV文件更新指定游戏的多语言翻译元数据

**使用场景**:
- 从App Store导出的CSV元数据更新游戏翻译
- 更新游戏标题、副标题、描述等字段

**用法**:
```bash
python3 scripts/update_game_i18n.py <game_id> <csv_path>
```

**参数**:
- `game_id`: 游戏ID（必须与 games.json 中的 id 字段匹配）
- `csv_path`: Apple Store 元数据 CSV 文件路径

**示例**:
```bash
# 更新 Solitaire 游戏
python3 scripts/update_game_i18n.py solitaire ../../solitaire/docs/metadata.csv

# 更新 Backgammon 游戏
python3 scripts/update_game_i18n.py backgammon ../../backgammon/docs/metadata.csv
```

**CSV格式要求**:
- `Locale`: Apple 语言代码（如 en-US, zh-Hans, ja）
- `App Name`: 应用名称
- `Subtitle`: 副标题
- `Description`: 应用描述

**输出**:
- 更新 `src/data/games.json` 中对应游戏的 title、subtitle、description 和 translations 字段

**语言映射**: 脚本自动将 Apple 语言代码映射到项目 i18n 代码（如 en-US → en）

---

### 2. verify_translations.py

**用途**: 验证所有语言的翻译文件完整性

**使用场景**:
- 添加新语言后验证文件结构
- 部署前检查翻译完整性
- 调试缺失的翻译文件

**用法**:
```bash
python3 scripts/verify_translations.py
```

**检查内容**:
- ✓ code.json (UI翻译)
- ✓ navbar.json (导航栏)
- ✓ footer.json (页脚)
- ✓ 所有文档文件 (服务条款、隐私政策等)

**输出示例**:
```
Languages with code.json:   31/31
Languages with navbar.json: 31/31
Languages with footer.json: 31/31
Languages with all docs:    31/31

✅ All translation files are in place!
```

---

## 维护说明

### 添加新游戏翻译

1. 从App Store Connect导出游戏元数据CSV
2. 运行脚本: `python3 scripts/update_game_i18n.py <game_id> <csv_path>`
3. 验证 `src/data/games.json` 中的更新
4. 提交更改到版本控制

### 添加新语言

1. 在 `docusaurus.config.ts` 中添加新语言代码
2. 创建对应的i18n目录结构
3. 运行 `verify_translations.py` 检查完整性

---

## 技术依赖

- Python 3.6+
- 标准库: csv, json, pathlib

无需额外安装第三方包。

---

## 相关文档

- [I18N_README.md](../I18N_README.md) - 完整的国际化实施文档
- [TRANSLATION_COMPLETE.md](../TRANSLATION_COMPLETE.md) - 翻译完成报告
