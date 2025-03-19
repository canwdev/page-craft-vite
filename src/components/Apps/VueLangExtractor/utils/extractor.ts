import * as acorn from 'acorn'
import {ReplacementItem, replaceTemplate} from '@/components/Apps/VueLangExtractor/utils/replacer'
import {
  checkKeyNeedExtract,
  valueNeedExtract as valueNeedExtract,
} from '@/components/Apps/VueLangExtractor/utils/checker'
import {parse} from '@vue/compiler-dom'
import {NodeTypes} from '@vue/compiler-core'
import {parse as babelParse} from '@babel/parser'

const formatValue = (str) => {
  if (typeof str !== 'string') {
    return str
  }
  // 首尾字符必须相同
  if (str.charAt(0) === str.charAt(str.length - 1)) {
    // 移除首尾引号 ` | ' | "
    str = str.replace(/^['"`]+|['"`]+$/g, '')
  }
  return str
}

// 移除首尾括号
const removeBrackets = (str: string) => {
  return str.replace(/^\(|\)$/g, '')
}

export class VueLangExtractor {
  private extractedKeyValues: {[key: string]: boolean}

  // text -> key map
  private extractedTextValues: {[text: string]: string}
  public keyPrefix: string

  constructor(keyPrefix = '') {
    this.keyPrefix = keyPrefix || ''
    this.extractedTextValues = {}
    this.extractedKeyValues = {}
  }

  generateUniqueKey(value: string) {
    if (this.extractedTextValues[value]) {
      return this.extractedTextValues[value]
    }
    let key = window.$mcUtils.formatI18nKey(value)
    if (this.extractedKeyValues[key]) {
      key = key + '_1'
    }
    key = this.keyPrefix ? this.keyPrefix + '.' + key : key
    this.extractedKeyValues[key] = true
    this.extractedTextValues[value] = key
    return key
  }

  extractJs(jsCode: string, replaceValueFn) {
    // TODO: 支持ts
    // const tsAst = babelParse(jsCode, {
    //   sourceType: 'module',
    //   plugins: ['typescript'],
    // })
    // const program = tsAst.program
    // console.log('ts ast', program)

    const program = acorn.parse(jsCode, {ecmaVersion: 2020, sourceType: 'module'})
    console.log('js ast', program)

    const replacements: ReplacementItem[] = []
    const textMap: {[key: string]: string} = {}
    const warnings: any[] = []

    const _valueNeedExtractWith = (value: string) => {
      return valueNeedExtract(value, (warn) => {
        warnings.push(warn)
      })
    }

    // 定义获取子节点的函数
    const getChildNodes = (node) => {
      switch (node.type) {
        case 'Program':
        case 'BlockStatement':
          return node.body || [] // 遍历 body 数组
        case 'FunctionExpression':
        case 'FunctionDeclaration': // 可选：也支持 FunctionDeclaration
          return [...(node.params || []), node.body] // 遍历参数和函数体
        case 'ExpressionStatement':
          return [node.expression] // 遍历表达式
        case 'ReturnStatement':
          return node.argument ? [node.argument] : [] // 遍历返回参数（如果存在）
        case 'TemplateLiteral':
          return node.quasis || [] // 遍历模板字符串
        case 'CallExpression':
          return [node.callee, ...(node.arguments || [])] // 遍历函数调用的参数
        case 'ConditionalExpression':
          return [node.test, node.consequent, node.alternate] // 遍历条件表达式的各个部分
        case 'MemberExpression':
          return [node.object, node.property] // 遍历对象和属性
        case 'ObjectExpression':
          return node.properties || [] // 遍历属性
        case 'ArrayExpression':
          return node.elements || [] // 遍历元素
        case 'Property':
          return [node.key, node.value] // 遍历键和值
        // 可根据需要添加其他节点类型，例如：
        case 'VariableDeclaration':
          return node.declarations
        case 'VariableDeclarator':
          return [node.id, node.init].filter(Boolean)
        default:
          return [] // 默认无子节点
      }
    }
    // 修改后的 walk 函数
    const walk = (node) => {
      // console.log('walk node', node)
      // 检查是否为目标节点：Property 且 value 为 Literal
      // if (node.type === 'Property' && node.value.type === 'Literal') {
      //   const propKey = node.key.name
      //   const value = node.value.value
      //   console.log('Property/Literal node', propKey, value, node)
      //
      //   if (!checkKeyNeedExtract(propKey)) {
      //     return
      //   }
      //
      //   if (!valueNeedExtract(value)) {
      //     return
      //   }
      //   replacements.push([node.start, node.end, replaceValue])
      // }

      // 处理 Literal 节点（例如数组中的字符串）
      const isLiteral = node.type === 'StringLiteral' || node.type === 'Literal'

      if (isLiteral || node.type === 'TemplateElement') {
        const value = isLiteral ? node.value : node.value.raw
        // console.log('Literal/TemplateElement node', {value}, node)

        const text = formatValue(value)
        if (!_valueNeedExtractWith(text)) {
          return
        }
        const key = this.generateUniqueKey(text)
        textMap[key] = text

        const replaceValue = replaceValueFn(key)
        if (isLiteral) {
          replacements.push([node.start, node.end, replaceValue])
        } else {
          // 移除模板字符串的引号
          replacements.push([node.start - 1, node.end + 1, replaceValue])
        }
      } else if (node.type === 'TemplateLiteral') {
        // console.log('TemplateLiteral node', node)
        if (node.expressions.length > 0) {
          // 提取文字
          const value = node.quasis
            .map((quasi, index) => {
              if (!quasi.value.raw) return ''
              return quasi.value.raw + `{${index}}`
            })
            .join('')
          const text = formatValue(value)
          if (!_valueNeedExtractWith(text)) {
            return
          }
          const exps = node.expressions
            .map((exp) => {
              if (exp.type === 'MemberExpression') {
                return exp.property.name
              }
              return null
            })
            .filter(Boolean)

          const key = this.generateUniqueKey(text)
          textMap[key] = text
          const message = '请手动处理模板字符串（包含插值）'
          console.warn(message, {node, exps}, {[key]: value})
          warnings.push({
            message,
            value,
            key,
            exps,
          })
          return
        }
      }

      // 递归遍历子节点
      getChildNodes(node).forEach((child) => {
        if (child) walk(child) // 确保子节点存在
      })
    }

    for (let i = 0; i < program.body.length; i++) {
      const node = program.body[i]
      // console.log('sub node', node)
      if (node.type === 'ExpressionStatement') {
        walk(node.expression)
      } else if (node.type === 'ExportDefaultDeclaration') {
        node.declaration.properties.forEach((prop) => {
          walk(prop)
        })
      }
    }

    // console.log('jsAst replacements', replacements)
    const newTemplate = replaceTemplate(jsCode, replacements)

    // console.log('newTemplate', newTemplate)

    return {
      textMap,
      newTemplate,
      warnings,
    }
  }

  // 提取 template 中的文本内容
  extractTemplate(template: string) {
    const ast = parse(template)
    // console.log('template ast', ast)
    const replacements: ReplacementItem[] = []
    let textMap: {[key: string]: string} = {}
    let warnings: any[] = []

    const _valueNeedExtractWith = (value: string) => {
      return valueNeedExtract(value, (warn) => {
        warnings.push(warn)
      })
    }

    // 遍历 AST
    const traverse = (node) => {
      // console.log('traverse node', node)
      // 节点类型 NodeTypes
      if (node.type === NodeTypes.ELEMENT) {
        // Node.ELEMENT 类型 (元素节点)
        // console.log('ELEMENT node', node)

        if (node.props) {
          node.props.forEach((prop) => {
            // console.log('prop', prop)

            if (prop.type === NodeTypes.ATTRIBUTE) {
              // console.log('ATTRIBUTE prop', prop)

              const propKey = prop.name
              if (!checkKeyNeedExtract(propKey)) {
                return
              }
              if (!prop.value) {
                return
              }
              const value = prop.value.content
              const text = formatValue(value)
              if (!_valueNeedExtractWith(text)) {
                return
              }
              const key = this.generateUniqueKey(text)
              textMap[key] = text
              replacements.push([
                prop.value.loc.start.offset,
                prop.value.loc.end.offset,
                `"$t('${key}')"`,
              ])
              // label -> :label
              replacements.push([
                prop.nameLoc.start.offset,
                prop.nameLoc.end.offset,
                `:${prop.nameLoc.source}`,
              ])
            } else if (
              prop.type === NodeTypes.DIRECTIVE &&
              prop.name === 'for' &&
              prop.forParseResult
            ) {
              console.log('DIRECTIVE v-for prop', prop)
              const {source} = prop.forParseResult

              let {
                textMap: _textMap,
                newTemplate: _newTemplate,
                warnings: _warnings,
              } = this.extractJs(
                // 给 value 加括号，避免 acorn 解析错误
                `(${source.content})`,
                (key) => {
                  return `$t('${key}')`
                },
              )

              // 移除首尾括号
              _newTemplate = removeBrackets(_newTemplate)

              textMap = {
                ...textMap,
                ..._textMap,
              }
              warnings = [...warnings, ..._warnings]

              replacements.push([source.loc.start.offset, source.loc.end.offset, _newTemplate])
            } else if (
              prop.type === NodeTypes.DIRECTIVE &&
              (prop.name === 'bind' || prop.name === 'html')
            ) {
              // console.log('DIRECTIVE prop', prop)
              // Node.DIRECTIVE 类型且 name 为 "bind"
              if (prop.arg && prop.arg.type === NodeTypes.SIMPLE_EXPRESSION) {
                // Node.SIMPLE_EXPRESSION 类型 (静态参数)
                const propKey = prop.arg.content
                if (prop.exp && prop.exp.type === NodeTypes.SIMPLE_EXPRESSION) {
                  // Node.SIMPLE_EXPRESSION 类型 (静态值)
                  const value = prop.exp.content

                  if (!checkKeyNeedExtract(propKey)) {
                    return
                  }

                  // 检测是否以 { 或 [ 开头
                  if (/^\{|\[/gi.test(value)) {
                    // console.warn('检测到对象或数组，需要进一步处理', value)

                    let {
                      textMap: _textMap,
                      newTemplate: _newTemplate,
                      warnings: _warnings,
                    } = this.extractJs(
                      // 给 value 加括号，避免 acorn 解析错误
                      `(${value})`,
                      (key) => {
                        return `$t('${key}')`
                      },
                    )

                    // 移除首尾括号
                    _newTemplate = removeBrackets(_newTemplate)

                    textMap = {
                      ...textMap,
                      ..._textMap,
                    }
                    warnings = [...warnings, ..._warnings]

                    replacements.push([
                      prop.exp.loc.start.offset,
                      prop.exp.loc.end.offset,
                      _newTemplate,
                    ])

                    return
                  }
                  // console.log('prop KV', {propKey, value}, prop)

                  const text = formatValue(value)

                  if (!_valueNeedExtractWith(text)) {
                    return
                  }

                  const key = this.generateUniqueKey(text)
                  textMap[key] = text

                  replacements.push([
                    prop.exp.loc.start.offset,
                    prop.exp.loc.end.offset,
                    `$t('${key}')`,
                  ])
                }
              } else if (
                prop.name === 'html' &&
                prop.exp &&
                prop.exp.type === NodeTypes.SIMPLE_EXPRESSION
              ) {
                // 处理 v-html 内容
                const value = prop.exp.content
                const text = formatValue(value)
                if (!_valueNeedExtractWith(text)) {
                  return
                }

                const key = this.generateUniqueKey(text)
                textMap[key] = text
                replacements.push([
                  prop.exp.loc.start.offset,
                  prop.exp.loc.end.offset,
                  `$t('${key}')`,
                ])
              }
            }
          })
        }
      } else if (node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION) {
        let value = ''
        if (node.type === NodeTypes.TEXT) {
          // console.log('TEXT node', node)
          // Node.TEXT 类型 (文本节点)
          value = node.content || ''
        } else if (node.type === NodeTypes.INTERPOLATION) {
          // console.log('INTERPOLATION node', node)
          // Node.INTERPOLATION 类型 (插值节点)
          value = node.content.loc.source
        }

        const text = formatValue(value)
        if (!_valueNeedExtractWith(text)) {
          return
        }
        const key = this.generateUniqueKey(text)
        textMap[key] = text.trim()
        replacements.push([node.loc.start.offset, node.loc.end.offset, `{{ $t('${key}') }}`])
      }
      if (node.children) {
        for (const child of node.children) {
          traverse(child)
        }
      }
    }

    traverse(ast)

    // 构建新 template
    replacements.sort((a, b) => a[0] - b[0]) // 确保按位置顺序
    const newTemplate = replaceTemplate(template, replacements)

    return {textMap, newTemplate, warnings}
    return {textMap, newTemplate, warnings}
  }

  // 提取 script 中的文本内容
  extractScript(template: string) {
    // console.log(template)
    return this.extractJs(template, (key) => {
      return `this.$t('${key}')`
    })
  }
}
