/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.69"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].temperaturelistitem = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            label: obj.label,
            refTemperature: obj.refTemperature
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Temperature List Item';
        let logPrefix = `[Temperature List Item - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].temperaturelistitem.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <li class="list-group-item pt-0">
                    <p class="specs">${data.label}</p>
                    <div class="ml-auto zugspitze-temperature-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-debug='${data.debug}'
                        zugspitze-refTemperature='${data.refTemperature}'
                    ></div>
                </li>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-temperature-list-item-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Temperature List Item HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].temperaturelistitem.getDataFromJson({
                debug: false,
                label: '',
                refTemperature: 80
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].temperaturelistitem.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});