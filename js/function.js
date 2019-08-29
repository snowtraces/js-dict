window.Utils = (function(window, Utils){
    const e = function (selector) {
        return document.querySelector(selector)
    }
    const eAll = function (selector) {
        return document.querySelectorAll(selector)
    }
    const registEvent = function(selector, event, func) {
        const _list = eAll(selector)
        let eventList = event.split(' ').map(e => e.trim())
        _list.forEach(
            item => {
                eventList.forEach(e => {
                    item.addEventListener(e, func, false)
                })
            }
        )
    }

    const registEventForce = function(selector, event, func) {
        let eventList = event.split(' ').map(e => e.trim())
        eventList.forEach(e => {
            document.addEventListener(e, (_e) => {
                const _list = eAll(selector)
                _list.forEach(
                    item => {
                        if (_e.target === item) {
                            func.call(item)
                        }
                    }
                )
            }, false)
        })
    }

    /**
     * 首字母大写
     */
    const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')
    
    /**
     * 复制功能
     * @param {*} _targetEL 
     * @param {*} _msgEL 
     */
    const copy = function (_targetEL, _msgEL) {
        if (!_targetEL.value) {
            errorMsg('无可复制内容！',  _msgEL)
            return
        }
    
        _targetEL.focus();
        _targetEL.setSelectionRange(0, target.value.length);
        document.execCommand("copy");
        // targetEL.blur();
        successMsg('复制成功', _msgEL);
    }
    
    /**
     * 日志功能
     * @param {*} msg 
     * @param {*} _msgEL 
     */
    const log = console.log.bind(console)
    const errorMsg = function (msg, _msgEL) {
        _msgEL = _msgEL || e('#msg')
        _msgEL.querySelector('.msg-content').innerHTML = msg || '失败'
        _msgEL.classList.add('error-msg')
        _msgEL.classList.add('active')
        setTimeout(function () {
            _msgEL.classList.remove('error-msg')
            _msgEL.classList.remove('active')
        }, 800)
    }
    const successMsg = function (msg, _msgEL) {
        _msgEL = _msgEL || e('#msg')
        _msgEL.querySelector('.msg-content').innerHTML = msg || '成功'
        _msgEL.classList.add('success-msg')
        _msgEL.classList.add('active')
        setTimeout(function () {
            _msgEL.classList.remove('success-msg')
            _msgEL.classList.remove('active')
        }, 800)
    }

    /**
     * localStorage 持久化
     * @param {*} key 
     * @param {*} name 
     */
    const storage = {}
    storage.fetch = function (key, name) {
        if (!key || !localStorage.getItem(key)) return ''
    
        let data = JSON.parse(localStorage.getItem(key))
        let names = data['name']
        names.sort(function (a, b) { return b - a })
    
        name = name || names[0]
        let value = data['value'][name]
        return { 'name': name, 'value': value }
    }
    storage.list = function (key) {
        if (!key || !localStorage.getItem(key)) return ''
    
        let data = JSON.parse(localStorage.getItem(key))
        let values = data['value'] || []
        return values
    }
    storage.push = function (key, name, value) {
        const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {}
        const names = data['name'] || []
        const values = data['value'] || {}
    
        names.indexOf(name) === -1 && names.push(name)
        values[name] && delete values[name]
        values[name] = value
    
        // 只保存最新1000条
        if (names.length > 1000) {
            let _name = names.shift()
            delete values[_name]
        }
    
        localStorage.setItem(key, JSON.stringify({ 'name': names, 'value': values }))
    }

    const func = {
        e: e,
        eAll: eAll,
        registEvent: registEvent,
        registEventForce: registEventForce,
        firstUpperCase: firstUpperCase,
        copy: copy,
        log: log,
        errorMsg: errorMsg,
        successMsg: successMsg,
        storage: storage
    }
    for(const _func in func) {
        Utils[_func] = func[_func]
        window[_func] = func[_func]
    }
    return Utils
})(window, window.Utils || {})
