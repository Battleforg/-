# Webpack loader

loader是模块的解析器，webpack默认只能理解JavaScript和JSON文件，loader让webpack能够处理其他类型的文件。

## loader的处理顺序
module.rules中允许对一种文件指定多个loader。当一种文件需要多个loader时，从最后一个loader开始链式调用。最后，链中的最后一个loader返回webpack所期望的JavaScript（字符串）

## 使用方式
1. 配置方式（推荐）
2. 內联方式