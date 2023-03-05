/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.47"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].uptimestate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            durationFormat: obj.durationFormat
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Uptime State';
        let logPrefix = `[Uptime State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].uptimestate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-convertToDuration='${data.durationFormat}'
                ></div>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-uptime-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Uptime State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].uptimestate.getDataFromJson({
                debug: false,
                durationFormat: 'd [Tage], h [Stunden], m [Minuten]'
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].uptimestate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});