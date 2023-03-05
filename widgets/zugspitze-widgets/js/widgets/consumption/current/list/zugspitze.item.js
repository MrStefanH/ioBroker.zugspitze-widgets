/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.55"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].consumptioncurrentlistitem = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            label: obj.label,
            refValue: obj.refValue
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Consumption Current List Item';
        let logPrefix = `[Consumption Current List Item - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].consumptioncurrentlistitem.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <li class="list-group-item pt-0">
                    <p class="specs">${data.label}</p>
                    <div class="ml-auto zugspitze-consumption-current-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-debug='${data.debug}'
                        zugspitze-refValue='${data.refValue}'
                    ></div>
                </li>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-consumption-current-list-item-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Consumption Current List Item HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].consumptioncurrentlistitem.getDataFromJson({
                debug: false,
                refValue: 1000
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].consumptioncurrentlistitem.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});