let STORAGE_KEY = 'trie_nodes'
let NEW_LIST_KEY = 'new_word_list'

// 2. 回车事件：执行查询
let searchWithDebounce = debounce(function () {

    let value = word.value
    let caseSensitive = arguments[0] === undefined ? true : arguments[0]
    if (value) {
        // 从trie树中查找
        let baseNode = trie.search(value, caseSensitive)
        if (baseNode) {
            let findResult = trie.findWord({ [baseNode.word]: baseNode }, {})
            result.innerHTML =
                (baseNode.isW ? `<span class="hint inputWord"><span class="w">${baseNode.word}</span><span class="addNew">+</span><span class=t>${baseNode.data}</span></span>` : '')
                + Object.keys(findResult).slice(0, 20).map(r => `<span class="hint"><span class="w">${r}</span><span class="addNew">+</span><span class="t">${findResult[r]}</span></span>`).join('')
                
        } else {
            if (caseSensitive) {
                arguments.callee(false)
            } else {
                result.innerHTML = '无匹配内容'
            }
        }
    } else {
        result.innerHTML = ''
    }
}, 300)
word.onkeyup = function () {
    searchWithDebounce()
}

// 3. 抖动
function debounce(func, delay) {
    let timeout = null
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            func.apply(this, arguments)
        }, delay || 200)
    }
}

// 4. 初始化词典树
let trie = new Trie(STORAGE_KEY)
trie.init('dict')

// 5. 上传词典
// dragUpload('#dragArea', trie.loadDataTrie, trie)
dragUpload('#dragArea', trie.loadDataJSON.bind(trie))

// 7. 下载词典
downloadDict.onclick = function () {
    // saveData.setDataConver({ name: '词典.dict', data: JSON.stringify(trie.root) })
    saveData.setDataConver({
        name: '词典.dict',
        data: JSON.stringify(
            trie.findWord({ '': trie.root }, {}, Infinity),
            null,
            2
        )
    })
}

// 8. 生词本
let trieLearn = new Trie(NEW_LIST_KEY)
trieLearn.init()

learnListBtn.onclick = function () {
    let isActive = learnListPage.classList.contains('active')
    if (isActive) {
        learnListBtn.classList.remove('active')
        learnListPage.classList.remove('active')
    } else {
        learnListBtn.classList.add('active')
        learnListPage.classList.add('active')

        // 展示生词
    }
}
// add
bindEventForce('.addNew', 'click', addNew2LearnList)
function addNew2LearnList() {
    // 获取数据
    let word = this.parentNode.querySelector('.w').textContent
    let translate = this.parentNode.querySelector('.t').textContent

    // 添加数据
    trieLearn.push(word, translate)
}
