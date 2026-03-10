# 案例目录

此目录存储隐私删除案例数据。

## 文件说明

- `cases.json` - 所有案例的数据库
- `screenshots/` - 举报截图存档 (自动创建)

## 案例状态

| 状态 | 含义 |
|------|------|
| pending | 待处理 |
| reported | 已举报，等待平台响应 |
| following | 跟进中 |
| resolved | 已解决 |
| failed | 处理失败 |

## 使用方法

```bash
# 添加案例
python3 ../tools/eraser.py add <url> --desc "描述"

# 查看所有案例
python3 ../tools/eraser.py list

# 更新状态
python3 ../tools/eraser.py update <id> reported --note "已在APP内举报"

# 查看详情
python3 ../tools/eraser.py info <id>
```
