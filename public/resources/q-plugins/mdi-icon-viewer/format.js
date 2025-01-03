const fs = require('fs').promises;
const path = require('path');

async function processMetaFile() {
  try {
    // 读取 meta.json 文件 https://raw.githubusercontent.com/Templarian/MaterialDesign/refs/heads/master/meta.json
    const filePath = path.resolve(__dirname, './meta.json');
    const data = await fs.readFile(filePath, 'utf8');

    // 解析 JSON 数据
    const metaArray = JSON.parse(data);

    // 提取 name 字段
    const namesArray = metaArray.map((item,index) => {
      const out = {
        id: index,
        name: item.name,
      }
      if (item.tags && item.tags.length) {
        out.tags_str = item.tags.join(', ');
      }
      return out
    });

    // 将结果写入
    const outputPath = path.resolve(__dirname, './meta-lite.json');
    await fs.writeFile(outputPath, JSON.stringify(namesArray, null));

    console.log('处理完成。已生成 meta-out.json');
  } catch (error) {
    console.error('处理文件时出错:', error);
  }
}

// 执行脚本
processMetaFile();
