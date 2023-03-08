/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.62"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].detailsshellystate = {
    getDataFromJson(obj) {
        return {
            id: obj.id,
            shelly: obj.shelly,
            shellyRelay: obj.shellyRelay,
            nettools: obj.nettools,
            debug: obj.debug
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Details Shelly State';
        let logPrefix = `[Details Shelly State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].detailsshellystate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <ul class="list-group borderless px-1 collapse" id="flush-collapse-${data.id}">
                    <div class="zugspitze-temperature-list-item-html-element"
                        zugspitze-oid='${data.shelly}.temperatureC'
                        zugspitze-label='Temperatur'
                    ></div>
                    <div class="zugspitze-alert-list-item-html-element"
                        zugspitze-oid='${data.shelly}.overtemperature'
                        zugspitze-label='Übertemperatur'
                        zugspitze-switchState='true'
                        zugspitze-textOnTrue='ZU WARM'
                        zugspitze-textOnFalse='OK'
                    ></div>
                    <div class="zugspitze-alert-list-item-html-element"
                        zugspitze-oid='${data.nettools}.alive'
                        zugspitze-label='Verbindung'
                    ></div>
                    <div class="zugspitze-type-shelly-list-item-html-element"
                        zugspitze-oid='${data.shelly}.id'
                        zugspitze-label='Typ'
                    ></div>
                    <div class="zugspitze-consumption-current-list-item-html-element"
                        zugspitze-oid='${data.shelly}.${data.shellyRelay}.Power'
                        zugspitze-label='Aktueller Verbrauch'
                    ></div>
                    <div class="zugspitze-consumption-overall-list-item-html-element"
                        zugspitze-oid='${data.shelly}.${data.shellyRelay}.Energy'
                        zugspitze-label='Gesamtverbrauch'
                    ></div>
                    <div class="zugspitze-uptime-list-item-html-element"
                        zugspitze-oid='${data.shelly}.uptime'
                        zugspitze-label='Betriebszeit'
                    ></div>
                    <div class="zugspitze-link-shelly-state-html-element"
                        zugspitze-host='${data.shelly}.hostname'
                    ></div>
                </ul>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-details-shelly-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Details Shelly State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].detailsshellystate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].detailsshellystate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});