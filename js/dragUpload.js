window.Snow = (function (window, Snow) {
    const dragUpload = function (wrapperSelector, callback) {
        let isAdvancedUpload = function () {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window
        }()
        if (!isAdvancedUpload) {
            alert('浏览器不支持拖拽上传')
            return
        }
        registEvent(
            'html',
            'drag dragstart dragend dragover dragenter dragleave drop',
            function (event) {
                event.preventDefault()
                event.stopPropagation()
            }
        )
        registEvent(wrapperSelector, 'dragover dragenter', function () { el(wrapperSelector).classList = 'is-dragover' })
        registEvent(wrapperSelector, 'dragleave dragend drop', function () { el(wrapperSelector).classList = '' })
        registEvent(wrapperSelector, 'drop', function (event) {
            let droppedFiles = event.dataTransfer.files
            let reader = new FileReader()
            reader.readAsText(droppedFiles[0])
            reader.onload = function () {
                callback(reader.result)
            }
        })
    }

    const func = {
        dragUpload: dragUpload
    }
    for (const _func in func) {
        Snow[_func] = func[_func]
        window[_func] = func[_func]
    }
    return Snow
})(window, window.Snow || {})