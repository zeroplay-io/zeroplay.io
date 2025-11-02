# 工具脚本 / Utility Scripts

本目录包含用于维护网站国际化(i18n)的实用工具脚本。

## 脚本列表

### 1. update_games_i18n.py

**用途**: 从CSV文件批量更新游戏元数据的多语言翻译

**使用场景**:
- 从App Store导出的CSV元数据更新游戏翻译
- 批量更新游戏标题、副标题、描述等字段

**用法**:
```bash
# 需要先将CSV文件放在父目录
python3 scripts/update_games_i18n.py
```

**输入**:
- `../backgammon_metadata.csv` - Backgammon游戏的App Store元数据
- `../solitaire_metadata.csv` - Solitaire游戏的App Store元数据

**输出**:
- 更新 `src/data/games.json` 中的translations字段

**注意**: 使用完CSV文件后记得删除，它们只是临时数据源。

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
2. 将CSV文件放在website父目录
3. 更新 `update_games_i18n.py` 中的游戏ID和CSV文件名
4. 运行脚本更新games.json
5. 删除临时CSV文件

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
