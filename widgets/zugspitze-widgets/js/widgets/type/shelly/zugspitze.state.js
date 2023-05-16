/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.81"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].typeshellystate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug
        }
    },
    updateType($element, stateValue) {
        let type = 'Shelly Gen1';
        if (stateValue.includes('SHSW-PM')) {
            type = 'Shelly PM Gen1';
        } else if (stateValue.includes('SHSW-25')) {
            type = 'Shelly 2.5 Gen1';
        }
       
        return $element.prepend(`<label>${type}</label>`);
    },
    createWidget: function (el, data) {
        let widgetName = 'Type Shelly State';
        let logPrefix = `[Type Shelly State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].typeshellystate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                ></div>
            `);

            
            vis.conn.getStates(data.oid, (error, states) => {
                let stateValue = states[data.oid].val;
                vis.binds["zugspitze-widgets"].typeshellystate.updateType($this, stateValue);
            });
            
            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].typeshellystate.updateType($this, newVal);
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

$.initialize(".zugspitze-type-shelly-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Type Shelly State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].typeshellystate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].typeshellystate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});