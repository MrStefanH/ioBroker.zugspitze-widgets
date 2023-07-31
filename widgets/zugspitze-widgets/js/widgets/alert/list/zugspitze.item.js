/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.94"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].alertlistitem = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            label: obj.label,
            switchState: obj.switchState,
            textOnTrue: obj.textOnTrue,
            textOnFalse: obj.textOnFalse
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Alert List Item';
        let logPrefix = `[Alert List Item - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].alertlistitem.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <li class="list-group-item pt-0">
                    <p class="specs">${data.label}</p>
                    <div class="ml-auto zugspitze-alert-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-debug='${data.debug}'
                        zugspitze-switchState='${data.switchState}'
                        zugspitze-textOnTrue='${data.textOnTrue}'
                        zugspitze-textOnFalse='${data.textOnFalse}'
                    ></div>
                </li>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-alert-list-item-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Alert List Item HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].alertlistitem.getDataFromJson({
                debug: false,
                label: '',
                switchState: false,
                textOnTrue: 'OK',
                textOnFalse: 'FEHLER'
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].alertlistitem.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});