let STORAGE_KEY = 'trie_nodes'

// 1. 定义树
let Trie = function () {
    this.root = {}
}

Trie.prototype.push = function (word, data) {
    let node = this.root
    for (const c of word) {
        if (!node[c]) {
            node[c] = {}
        }
        node = node[c]
    }

    node.isW = true
    node.data = data
}

Trie.prototype.search = function (word, caseSensitive) {
    let node = this.root
    if (!caseSensitive) {
        // 大小写不敏感
        // [全大写, 全小写, 首字母大写] 匹配
        let upperWord = word.toUpperCase()
        let upperResult = this.search(upperWord, true)
        if (upperResult) return upperResult

        let lowerWord = word.toLowerCase()
        let lowerResult = this.search(lowerWord, true)
        if (lowerResult) return lowerResult
        
        let firstUpperWord = firstUpperCase(word)
        return this.search(firstUpperWord, true)
    }
    for (let c of word) {
        if (node[c]) {
            node = node[c]
        } else {
            return false
        }
    }
    node.word = word
    return node
}

Trie.prototype.save2Local = function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.root))
}

Trie.prototype.init = function (data) {
    let trieNodes = localStorage.getItem(STORAGE_KEY)
    if (trieNodes) {
        this.loadDataTrie(trieNodes)
        log('--- 从storage中加载数据 ---')
    } else {
        this.loadDataJSON(data)
        log('--- 从js文件中加载数据 ---')
    }
}

Trie.prototype.loadDataTrie = function (data) {
    this.root = JSON.parse(data)
    successMsg('词典加载成功')
}

Trie.prototype.loadDataJSON = function (data) {
    if (typeof data === 'string') {
        data = JSON.parse(data)
    }
    for (let k in data) {
        this.push(k, data[k])
    }
    this.save2Local()
    successMsg('词典加载成功')
}

Trie.prototype.findWord = function (base, result, limit) {
    if (Object.keys(base).length === 0 || Object.keys(result).length >= limit) {
        return result
    }
    let _base = {}
    for (const baseWord in base) {
        let startNode = base[baseWord]
        for (let c in startNode) {
            if (c === 'isW' || c === 'data' || c === 'word') {
                continue
            }
            let _node = startNode[c]
            if (_node.isW) {
                result[baseWord + c] = _node.data
            }

            _base[baseWord + c] = _node
        }
    }

    return this.findWord(_base, result)
}

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
                (baseNode.isW ? `<span class="hint inputWord"><span class="w">${baseNode.word}</span>${baseNode.data}</span>` : '')
                + Object.keys(findResult).slice(0, 20).map(r => `<span class="hint"><span class="w">${r}</span>${findResult[r]}</span>`).join('')
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

// 4. 初始化树
let trie = new Trie()
trie.init(dict)
dict = null

// 5. 上传词典
// dragUpload('#dragArea', trie.loadDataTrie, trie)
dragUpload('#dragArea', trie.loadDataJSON, trie)

// 6. 添加词典
addDict.onclick = function () {
    wordEditor.classList.contains('hide') ? wordEditor.classList = 'show' : wordEditor.classList = 'hide'
}
wordCh.onkeyup = wordEn.onkeyup = function (e) {
    let key = e.key
    if ("enter" !== key.toLowerCase()) {
        return
    }
    let en = wordEn.value
    let ch = wordCh.value
    if (!en || !ch) {
        errorMsg('请先填写中英文内容', msg)
    } else {
        let oldValue = trie.search(en)
        if (oldValue) {
            errorMsg('该单次已存在', msg)
            return
        }
        trie.push(en, ch)
        trie.save2Local()
        successMsg('添加成功', msg)
    }
}

// 7. 下载词典
downloadDict.onclick = function () {
    // saveData.setDataConver({ name: '词典.dict', data: JSON.stringify(trie.root) })
    saveData.setDataConver({ 
        name: '词典.dict', 
        data: JSON.stringify(
            trie.findWord({'': trie.root}, {}, Infinity),
            null,
            2
        )
    })
}