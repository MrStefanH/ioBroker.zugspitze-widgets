/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.77"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].consumptionoverallstate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            refValue: obj.refValue
        }
    },
    checkValue($element, stateValue, data) {
        if (stateValue > data.refValue) {
            return $element.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-value='20'
                    mdw-textAlign='start'
                    mdw-valueLabelUnit='kWh'
                    mdw-calculate='#value/1000'
                ></div>
            `);
        }
        
        return $element.html(`
            <div class="ml-auto mb-0 materialdesign-value-html-element"
                mdw-debug='${data.debug}'
                mdw-oid='${data.oid}'
                mdw-targetType='auto'
                mdw-value='20'
                mdw-textAlign='start'
                mdw-valueLabelUnit='Wh'
            ></div>
        `);
    },
    createWidget: function (el, data) {
        let widgetName = 'Consumption Overall State';
        let logPrefix = `[Consumption Overall State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].consumptionoverallstate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-value='20'
                    mdw-textAlign='start'
                    mdw-valueLabelUnit='Wh'
                ></div>
            `);

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].consumptionoverallstate.checkValue($this, newVal, data);
            }
            
            vis.states.bind(data.oid + '.val', onChange);
            //remember bound state that vis can release if didnt needed
			$this.data('bound', [data.oid + '.val']);
			//remember onchange handler to release bound states
			$this.data('bindHandler', onChange);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-consumption-overall-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Consumption Overall State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].consumptionoverallstate.getDataFromJson({
                debug: false,
                refValue: 1000
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].consumptionoverallstate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});