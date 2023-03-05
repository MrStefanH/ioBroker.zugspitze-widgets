/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.45"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].temperaturestate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            refTemperature: obj.refTemperature
        }
    },
    checkValue($element, stateValue, refTemperature) {
        if (stateValue >= refTemperature) {
            return $element.addClass('text-danger');
        }
        
        return $element.removeClass('text-danger');
    },
    createWidget: function (el, data) {
        let widgetName = 'Temperature State';
        let logPrefix = `[Temperature State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].temperaturestate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-valueLabelUnit='°C'
                ></div>
            `);

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].temperaturestate.checkValue($this, newVal, data.refTemperature);
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

$.initialize(".zugspitze-temperature-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Temperature State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].temperaturestate.getDataFromJson({
                debug: false,
                refTemperature: 80
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].temperaturestate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});