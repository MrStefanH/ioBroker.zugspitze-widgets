/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.61"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].cardstate = {
    getDataFromJson(obj) {
        return {
            label: obj.label,
            debug: obj.debug,
            id: obj.id,
            oid: obj.oid,
            nettools: obj.nettools,
            shellyRelay: obj.shellyRelay,
            shelly: obj.shelly
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Card State';
        let logPrefix = `[Card State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].cardstate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="card active" data-unit="switch-light-1">
                    <div class="zugspitze-card-body-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-label='${data.label}'
                        zugspitze-id='${data.id}'
                    ></div>
                    <hr class="my-0">
                    <div class="zugspitze-details-shelly-state-html-element"
                        zugspitze-shelly='${data.shelly}'
                        zugspitze-shellyRelay='${data.shellyRelay}'
                        zugspitze-nettools='${data.nettools}'
                        zugspitze-id='${data.id}'
                    ></div>
                </div>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-card-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Card State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].cardstate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].cardstate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});