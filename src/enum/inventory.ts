import htmlTags from '@/enum/html-tags.json'
import {createHtmlBlockItem} from '@/enum/block'

export const htmlBlockItemList = htmlTags.map((tag) => createHtmlBlockItem(tag))
