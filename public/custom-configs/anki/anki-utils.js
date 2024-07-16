/**
 * 请使用 Node.js 执行此 js 文件！
 * 先安装并启用 AnkiConnect 插件再使用此脚本
 * 在 AnkiConnect 插件设置 修改允许跨域 "webCorsOriginList": ["*"]
 */
const fs = require('fs')
const Path = require('path')
const {result} = require('lodash')
const infos = require('./cardsInfo.json')
const array = require('./cardsInfo_ODH_merged.json')

// 检查当前Node.js版本是否支持fetch，如果不支持，需要手动引入其他方式
if (parseInt(process.versions.node.split('.')[0]) < 18) {
  throw new Error('请使用 Node.js 18以上版本 执行此 js 文件！')
}

const ankiConnectRequest = async (params = {}) => {
  try {
    console.log('[ankiConnectRequest] params', params)
    const response = await fetch('http://localhost:8765', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    // console.log('[ankiConnectRequest] result', result)
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

const saveObjectToFile = (relativePath, obj) =>
  fs.writeFileSync(Path.join(__dirname, relativePath), JSON.stringify(obj, null, 2), {
    encoding: 'utf-8',
  })

const config = {
  deckName: 'MyEnglish',
  modelName: 'ODH',
}

const ankiUtils = {
  // 获取牌组和ids
  deckNamesAndIds: async () => {
    const {result} = await ankiConnectRequest({
      action: 'deckNamesAndIds',
      version: 6,
    })
    saveObjectToFile('deckNamesAndIds.json', result)
    return result
  },
  // 获取该牌组下的所有卡片ids
  findCards: async (key) => {
    const {result} = await ankiConnectRequest({
      action: 'findCards',
      version: 6,
      params: {
        query: `"deck:${key}"`, // 查询字符串，用于获取特定 deck 下的 card
      },
    })
    saveObjectToFile('findCards.json', result)
    return result
  },
  /**
   * 获取卡片详细信息
   * @param cardIds 卡片 id 数组
   * @param mapFn 过滤器函数，用于过滤无用信息
   */
  cardsInfo: async (cardIds, mapFn) => {
    const {result} = await ankiConnectRequest({
      action: 'cardsInfo',
      version: 6,
      params: {
        cards: cardIds,
      },
    })
    saveObjectToFile('cardsInfo.json', result.map(mapFn))
    return result
  },
  addNote: async (fields = {}) => {
    return await ankiConnectRequest({
      action: 'addNote',
      version: 6,
      params: {
        note: {
          deckName: config.deckName,
          modelName: config.modelName,
          options: {
            allowDuplicate: true,
          },
          fields: fields,
          tags: [config.modelName],
        },
      },
    })
  },
}

/**
 * 获取所有卡片信息
 */
const getAllCardsInfo = async () => {
  // await ankiUtils.deckNamesAndIds()
  await ankiUtils.findCards('PTE 个人收藏')

  // get cards details
  const cards = require('./findCards.json')
  await ankiUtils.cardsInfo(
    cards,
    // 删除无用信息
    (item) => {
      return {
        cardId: item.cardId,
        fields: item.fields,
        modelName: item.modelName,
      }
    },
  )
}
// getAllCardsInfo()

/**
 * 转换模板
 * Dict2Anki-v6.1.6 (Fixed for Anki23 by Shige) -> ODH
 */
const convertCard_Dict2Anki_to_ODH = () => {
  const convert = (card) => {
    const {fields} = card
    return {
      // 单词词组
      expression: fields.term.value,
      // 释义
      glossary: '', // fields.definition.value,
      // 额外信息
      extrainfo: '', // fields.phraseFront.value,
      // 例句
      sentence: '', // fields.sentenceFront.value,
      // 音标
      reading: fields.AmEPhonetic.value,
      // 音频文件
      audio: fields.AmEPron.value,
      // 来源网址
      url: '',
      image: fields.image.value,
    }
  }
  const infos = require('./cardsInfo.json')
  const converted = infos.map(convert)
  saveObjectToFile('cardsInfo_ODH.json', converted)

  // 后续操作：手动使用AI增加释义，使用 json-array-splitter.js 工具进行拆分合并
  // AI 提示词如下
  /**
   给以下js数组中的每个单词增加解释性字段，其中 `expression` 是英语单词词组，如果字段有值则不修改，返回 markdown json 格式：
   - 字段名：`glossary`，用英语解释`expression`的详细释义
   - 字段名：`sentence`，创建一个该`expression`的例句
   - 字段名：`extrainfo`，`expression`的中文翻译
   - 字段名：`reading`，`expression`的发音音标
   数组如下：
   [ { "expression": "bulletin", "extrainfo": "公告" } ]
   */
}
// convertCard_Dict2Anki_to_ODH()

/**
 * 批量添加卡片
 */
const batchAddCard = async () => {
  // const array = [
  //   {
  //     expression: 'Bulletin',
  //     extrainfo: '公告',
  //     glossary:
  //       'a brief report especially an official statement issued for immediate publication or broadcast',
  //     sentence: 'The bulletin announced the upcoming changes in the company.',
  //     reading: '/ˈbʊlɪtn/',
  //   },
  // ]

  const array = require('./cardsInfo_ODH_merged.json')
  for (let index = 0; index < array.length; index++) {
    const item = array[index]
    console.log(`${index}/${array.length} adding`, item)
    await ankiUtils.addNote(item)
  }
}
// batchAddCard()
