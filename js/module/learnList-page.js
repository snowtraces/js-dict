{
    let view = {
        el: '#learnListPage',
        template: `<div id="learnList">
        <pre>\${
            Object.keys(data).slice(0, 20).map(r => \`<span class="hint"><span class="removeNew learnOpt">-</span><span class="w">\${r}</span><span class="t">\${data[r]}</span></span>\`).join('')
        }
        </pre></div>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        },
        pageToggle(page) {
            return new Promise((resove, reject) => {
                let isActive = page.classList.contains('active')
                if (isActive) {
                    page.classList.remove('active')
                } else {
                    page.classList.add('active')
                    // 展示生词
                    resove()
                }
            })
        }
    }

    let model = {
        tireKey: null,
        trie: null,
        init() {
            this.tireKey = 'new_word_list',
                this.trie = new Trie(this.tireKey);
            this.trie.init('dict')
        }
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            // this.view.render(this.model.data)
            this.model.init()
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.bindEventForce('.addNew', 'click', this.addNewWord.bind(this))
            $.bindEventForce('.removeNew', 'click', this.removeNewWord.bind(this))
        },
        bindEventHub() {
            window.eventHub.on('learnListToggle', () => {
                this.view.pageToggle($.el(this.view.el))
                    .then(() => {
                        this.loadData()
                    })
            })
        },
        loadData() {
            let data = this.model.trie.findWord({ '': this.model.trie.root }, {}, Infinity)
            log(data)
            this.view.render(data)
        },
        addNewWord(e) {
            // 获取数据
            let word = e.target.parentNode.querySelector('.w').textContent
            let translate = e.target.parentNode.querySelector('.t').textContent

            // 添加数据
            this.model.trie.push(word, translate)
            this.model.trie.save2Local()
        },
        removeNewWord(e) {
            // 获取数据
            let word = e.target.parentNode.querySelector('.w').textContent

            // 添加数据
            this.model.trie.pull(word)
            this.model.trie.save2Local()
            this.loadData()
        }
    }

    controller.init(view, model)
}
