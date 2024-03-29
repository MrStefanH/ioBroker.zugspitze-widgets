/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.94"

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
            shelly: obj.shelly,
            deviceAlias: obj.deviceAlias
        }
    },
    createHtml: function ($element, data) {
        $element.html(`
            <div class="card active" data-unit="switch-light-1">
                <div class="zugspitze-card-body-state-html-element"
                    zugspitze-oid='${data.oid}'
                    zugspitze-label='${data.label}'
                    zugspitze-id='${data.id}'
                    zugspitze-reachable='${data.reachable}'
                ></div>
                <hr class="my-0">
                <div class="zugspitze-details-shelly-state-html-element"
                    zugspitze-deviceAlias='${data.deviceAlias}'
                ></div>
            </div>
        `);
    },
    checkValue($element, stateValue, data) {
        data.reachable = stateValue;
        vis.binds["zugspitze-widgets"].cardstate.createHtml($element, data);
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

            const reachableDatapoint = data.deviceAlias + '.reachable';
            vis.conn.getStates(reachableDatapoint, (error, states) => {
                let stateValue = states[reachableDatapoint].val;
                vis.binds["zugspitze-widgets"].cardstate.checkValue($this, stateValue, data);
            });

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].cardstate.checkValue($this, newVal, data);
            }
            
            const reachableDatapointValue = reachableDatapoint + '.val';
            vis.states.bind(reachableDatapointValue, onChange);
            //remember bound state that vis can release if didnt needed
			$this.data('bound', [reachableDatapointValue]);
			//remember onchange handler to release bound states
			$this.data('bindHandler', onChange);
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