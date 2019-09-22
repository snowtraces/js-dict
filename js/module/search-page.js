{
    let view = {
        el: '#searchPage',
        template: `<input type="search" id="word">
            <pre id="result"></pre>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            // this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {

        },
        bindEventHub() {

        }
    }

    controller.init(view, model)
}
