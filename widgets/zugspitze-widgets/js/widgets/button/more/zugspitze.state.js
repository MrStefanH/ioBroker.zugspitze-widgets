/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.63"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].buttonmorestate = {
    getDataFromJson(obj) {
        return {
            label: obj.label,
            debug: obj.debug,
            id: obj.id
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Button More State';
        let logPrefix = `[Button More State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].buttonmorestate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <button class="accordion-button collapsed" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#flush-collapse-${data.id}" 
                    aria-expanded="false" 
                    aria-controls="flush-collapse-${data.id}">
                    ${data.label}
                </button> 
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-button-more-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Button More State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].buttonmorestate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].buttonmorestate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});