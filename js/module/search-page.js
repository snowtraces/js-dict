{
    let view = {
        el: '#searchPage',
        template: `<input type="search" id="word">
            <pre id="result"></pre>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {
        tireKey: null,
        trie: null,
        init() {
            this.tireKey = 'trie_nodes'
            this.trie = new Trie(this.tireKey)
            this.trie.init('dict')
        }
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.model.init()
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.bindEvent(this.view.el + ' #word', 'keyup', this.doSearch.bind(this))
        },
        bindEventHub() {

        },
        doSearch() {
            $.debounce(this.search.bind(this), 500)()
        },
        search() {
            let MAX_LEN = 20
            let value = word.value
            let caseSensitive = arguments[0] === undefined ? true : arguments[0]
            if (value) {
                // 从trie树中查找
                let dataResult = {}

                // 全匹配
                let baseNodeList = this.model.trie.search(value, caseSensitive)
                baseNodeList.filter(n => n._w).forEach(n => {
                    dataResult[n.word] = n._d
                })

                // 头匹配
                if (Object.keys(dataResult).length < MAX_LEN) {
                    baseNodeList.forEach(baseNode => {
                        if (Object.keys(dataResult).length < MAX_LEN) {
                            let findResult = this.model.trie.findWord({ [baseNode.word]: baseNode }, {}, MAX_LEN)
                            dataResult = { ...dataResult, ...findResult }
                        }
                    });

                }

                if (Object.keys(dataResult).length) {
                    result.innerHTML = Object.keys(dataResult).slice(0, MAX_LEN).map(r =>
                        `<div class="hint"><span class="addNew learnOpt">+</span><span class="w"><span class="match">${r.substring(0, value.length)}</span><span class="match-tail">${r.substring(value.length)}</span></span> <span class="t">${dataResult[r]}</span></span>`)
                } else {
                    if (caseSensitive) {
                        this.search(false)
                    } else {
                        result.innerHTML = '无匹配内容'
                    }
                }
            } else {
                result.innerHTML = ''
            }
        }
    }

    controller.init(view, model)
}
