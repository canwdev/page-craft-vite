import htmlTags from '@/enum/html-tags.json'
import {getHtmlBlockItem} from '@/enum/block'

export const htmlBlockItemList = htmlTags.map((tag) => getHtmlBlockItem(tag))
