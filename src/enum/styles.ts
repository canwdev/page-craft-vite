export const cssSnippetList = [
  {
    name: 'Flex View',
    code: ['display: flex;', 'align-items: center;', 'justify-content: space-between;'].join('\n'),
  },
  {
    name: 'Grid View',
    code: [
      'display: grid;',
      'grid-template-columns: repeat(5, 1fr);',
      'grid-template-rows: auto;',
      'gap: 30px;',
    ].join('\n'),
  },
  {
    name: 'Text Overflow',
    code: [
      'display: -webkit-box;',
      '-webkit-line-clamp: 3;',
      '-webkit-box-orient: vertical;',
      'overflow: hidden;',
      'text-overflow: ellipsis;',
    ].join('\n'),
  },
  {
    name: 'Background Cover',
    code: [
      'background-image: url("");',
      'background-repeat: no-repeat;',
      'background-position: center;',
      'background-size: cover;',
    ].join('\n'),
  },
  {
    name: 'Width Center',
    code: ['max-width: 1200px', 'margin-left: auto;', 'margin-right: auto;'].join('\n'),
  },
  // {
  //   name: '',
  //   code: '',
  // },
]
