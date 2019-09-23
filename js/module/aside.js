{
    let view = {
        el: 'aside',
        template: `<!--<button type="button" id="downloadDict" class="asideBtn">下载词典</button>-->
        <button type="button" id="learnListBtn" class="asideBtn">生词本</button>
        <div id="dragArea">
            <div class="uploadText">上传词典</div>
            <div class="uploader"><span>拖拽</span>文件上传</div>
        </div>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        },
        btnStatusToggle(btn) {
            let isActive = btn.classList.contains('active')
            if (isActive) {
                btn.classList.remove('active')
            } else {
                btn.classList.add('active')
            }
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            dragUpload(this.view.el + ' #dragArea').then((data) => {
                window.eventHub.emit('dictUploaded', data)
            })
            $.bindEvent(this.view.el + ' #downloadDict', 'click', () => {
                window.eventHub.emit('dictDownload')
            })
            $.bindEvent(this.view.el + ' #learnListBtn', 'click', (e) => {
                window.eventHub.emit('learnListToggle')
                this.view.btnStatusToggle(e.target)
            })
        },
        bindEventHub() {

        }
    }

    controller.init(view, model)
}
