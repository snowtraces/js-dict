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
        init(){
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
        doSearch(){
            $.debounce(this.search.bind(this), 300)()
        },
        search() {
            let value = word.value
            let caseSensitive = arguments[0] === undefined ? true : arguments[0]
            if (value) {
                // 从trie树中查找
                let baseNode = this.model.trie.search(value, caseSensitive)
                if (baseNode) {
                    let findResult = this.model.trie.findWord({ [baseNode.word]: baseNode }, {})
                    result.innerHTML =
                        (baseNode.isW ? `<span class="hint inputWord"><span class="addNew learnOpt">+</span><span class="w">${baseNode.word}</span><span class=t>${baseNode.data}</span></span>` : '')
                        + Object.keys(findResult).slice(0, 20).map(r => `<span class="hint"><span class="addNew learnOpt">+</span><span class="w">${r}</span><span class="t">${findResult[r]}</span></span>`).join('')
                        
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
