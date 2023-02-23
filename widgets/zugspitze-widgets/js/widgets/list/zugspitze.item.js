/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.25"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].listitem = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            label: obj.label
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'List Item';
        let logPrefix = `[List Item - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].listitem.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <li class="list-group-item pt-0">
                    <p class="specs">${data.label}</p>
                    <div class="ml-auto zugspitze-alert-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-debug='${data.debug}'
                    ></div>
                </li>
            `);

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].alertstate.checkValue($this, newVal, data.switchState);
            }
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-list-item-html-element", function () {
    let $this = $(this);
    let logPrefix = `[List Item HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].listitem.getDataFromJson({
                debug: false,
                label: ''
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].listitem.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});