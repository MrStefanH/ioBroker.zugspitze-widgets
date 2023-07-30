/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.88"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].detailsshellystate = {
    getDataFromJson(obj) {
        return {
            deviceAlias: obj.deviceAlias,
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

            let id = data.deviceAlias + '.id';
            let overTemperature = data.deviceAlias + '.overtemperature';
            vis.conn.getStates(id, (error, states) => {
                let stateValue = states[id].val;
                let overTemperatureValue = states[overTemperature];
                $this.html(`
                    <ul class="list-group borderless collapse" id="flush-collapse-${stateValue}">
                        <div class="zugspitze-temperature-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.temperature'
                            zugspitze-label='Temperatur'
                        ></div>
                        ${overTemperature in states ? 
                            `<div class="zugspitze-alert-list-item-html-element"
                                zugspitze-oid='${data.deviceAlias}.overtemperature'
                                zugspitze-label='Übertemperatur'
                                zugspitze-switchState='true'
                                zugspitze-textOnTrue='ZU WARM'
                                zugspitze-textOnFalse='OK'
                            ></div>` 
                        : 'Test'}
                        <div class="zugspitze-alert-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.reachable'
                            zugspitze-label='Verbindung'
                        ></div>
                        <div class="zugspitze-type-shelly-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.type'
                            zugspitze-label='Typ'
                        ></div>
                        <div class="zugspitze-consumption-current-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.currentPower'
                            zugspitze-label='Aktueller Verbrauch'
                        ></div>
                        <div class="zugspitze-consumption-overall-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.overallEnergy'
                            zugspitze-label='Gesamtverbrauch'
                        ></div>
                        <div class="zugspitze-uptime-list-item-html-element"
                            zugspitze-oid='${data.deviceAlias}.uptime'
                            zugspitze-label='Betriebszeit'
                        ></div>
                        <div class="zugspitze-link-shelly-state-html-element"
                            zugspitze-host='${data.deviceAlias}.hostname'
                        ></div>
                    </ul>
                `);
            });
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