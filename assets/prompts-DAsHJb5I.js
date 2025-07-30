const i=(e,o,t)=>[{role:"system",content:`你是一个后台翻译服务，负责翻译多语言文案，帮我翻译并只返回json内容，不需要markdown格式。json格式为：\`${JSON.stringify(e)}\``},{role:"user",content:`翻译内容(${o}):
\`${t}\``}],a=e=>{const o=(t,r=200)=>{let n="";return typeof t!="string"?n=t.map(s=>s.text).join(`
`):n=t,n.length>r?n.slice(0,r)+"...":n};return[{content:"你是一名擅长会话的助理，你需要将用户的会话总结为 10 个字以内的标题，不需要包含标点符号，输出标题的语言为聊天内容所用的语言，对话内容如下",role:"system"},{content:`${e.map(t=>`${t.role}:${o(t.content)}`).join(`
`)}`,role:"user"}]};export{a,i as p};
