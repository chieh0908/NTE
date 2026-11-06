const eventjson = () => {
    const out = {}

    /**
     * 是否已執行替換文字
     **/
    out.loaded = false

    /**
     * 開始替換文字
     */
    out.run = (ViewObj = {}, search_dom) => {
        const dom_list = search_dom ? search_dom.querySelectorAll('*:not(script,noscript,style)') : document.querySelectorAll('body :not(script,noscript,style)')

        //查出有{.+}的dom及標記出現位置
        const replace_array = []
        for (const dom of dom_list) {
            //查詢innerHTML中有沒有完全符合的變數名稱
            const innserHTML_key = (dom.innerHTML.trim().match(/^\{[0-9a-zA-Z_\-\.]+\}$/) || [])[0]
            //console.log(innserHTML_key)
            if (innserHTML_key) {
                replace_array.push({
                    dom: dom,
                    attr: '',
                    key: innserHTML_key.replace(/[\{\}]/g, '').split('.')
                })
            }
            //查詢attr中有沒有完全符合的變數名稱
            dom.getAttributeNames().forEach(v => {
                const attr_key = (dom.getAttributeNode(v).value.match(/^\{[0-9a-zA-Z_\.\-]+\}$/) || [])[0]
                if (attr_key) {
                    replace_array.push({
                        dom: dom,
                        attr: v,
                        key: attr_key.replace(/[\{\}]/g, '').split('.')
                    })
                }
            })
        }
        // console.log(replace_array)

        //依key群組化
        const group_array = []
        replace_array.forEach(v => {
            const find = group_array.find(v2 => v2[0].key[0] == v.key[0])
            if (find) {
                find.push(v)
                return
            }
            group_array.push([v])
        })

        //挑出第一層key=array並且有第二層key的資料 (Array > Object|String)
        group_array.filter(v => Array.isArray(ViewObj[v[0].key[0]]) && v[0].key.length > 1).forEach(v => {
            //指定真正要跑Array的DOM
            for (const v2 of v) {
                v2.parent_dom = v2.dom
            }
            while (1) {
                for (const v2 of v) {
                    for (const v3 of v) {
                        const dom = Array.from(v2.parent_dom.querySelectorAll('*')).find(r => r == v3.parent_dom)
                        if (dom) {
                            v3.parent_dom = v2.parent_dom
                        }
                    }
                }
                if (v.filter(v2 => v2.parent_dom == v[0].parent_dom).length == v.length) {
                    break
                }
                v[0].parent_dom = v[0].dom.parentNode
            }
            // console.log(v)
        })

        //替換指定的文字
        group_array.forEach((replace_array) => {
            replace_array.forEach((v, k) => {
                const { dom, attr, key, parent_dom } = v
                const data = ViewObj[key[0]]
                if (!data && data !== '') return
            
                //如果是index=0，並且key的長度超過1，表示為Array > Object的結構，需要clone的dom為parent_dom，並且再次呼叫run()進行下一層的解析
                if (v.key.length > 1) {
                    if (k != 0) return
                    data.reverse().forEach(v2 => {
                        const clone_dom = parent_dom.cloneNode(true)
                        const dom_list = clone_dom.querySelectorAll('*')
                        for (const dom of dom_list) {
                            //查詢innerHTML中有沒有完全符合的變數名稱
                            const replacer = (match, p1, p2, p3, offset, string) => {
                                return `{${p1.split('.')[1]}}`
                            }
                            const innserHTML_key = (dom.innerHTML.trim().match(/^\{[0-9a-zA-Z_\-\.]+\}$/) || [])[0]
                            if (innserHTML_key) {
                                dom.innerHTML = dom.innerHTML.replace(/^\{([0-9a-zA-Z_\-\.]+)\}$/, replacer)
                            }
                            //查詢attr中有沒有完全符合的變數名稱
                            dom.getAttributeNames().forEach(v => {
                                const attr_key = (dom.getAttributeNode(v).value.match(/^\{[0-9a-zA-Z_\.\-]+\}$/) || [])[0]
                                if (attr_key) {
                                    const value = dom.getAttributeNode(v).value.replace(/^\{([0-9a-zA-Z_\.\-]+)\}$/, replacer)
                                    dom.setAttribute(v, value)
                                }
                            })
                        }
                        // console.log(clone_dom.innerHTML)
                        out.run(v2, clone_dom)
                        parent_dom.after(clone_dom)
                    })
                    parent_dom.remove()
                    return
                }
                if (typeof data == 'string') {
                    if (attr) {
                        dom.setAttribute(attr, data)
                        return
                    }
                    dom.innerHTML = data
                    return
                }
                if (Array.isArray(data)) {
                    data.reverse().forEach(v2 => {
                        const clone_dom = dom.cloneNode()
                        clone_dom.innerHTML = v2
                        dom.after(clone_dom)
                    })
                    dom.remove()
                    return
                }
            })
        })

        out.loaded = true
    }
    
    return out
}

// window.addEventListener('DOMContentLoaded', (event) => {
//     eventjson().run(ViewObj)
// })
document.addEventListener('readystatechange', (event) => {
    if (document.readyState == 'interactive') {
        eventjson().run(ViewObj)
    }
})
