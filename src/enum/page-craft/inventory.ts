import htmlTags from '@/enum/page-craft/html-tags.json'
import {createHtmlBlockItem} from '@/enum/page-craft/block'

export const htmlBlockItemList = htmlTags.map((tag) => createHtmlBlockItem(tag))
