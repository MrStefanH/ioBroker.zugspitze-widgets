/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.77"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].alertstate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            switchState: obj.switchState,
            textOnTrue: obj.textOnTrue,
            textOnFalse: obj.textOnFalse
        }
    },
    checkValue($element, stateValue, switchState = false) {
        stateValue = switchState ? !stateValue : stateValue;
        if (stateValue) {
            $element.removeClass('text-danger');
            return $element.addClass('text-success');
        }
        
        $element.addClass('text-danger');
        return $element.removeClass('text-success');
    },
    createWidget: function (el, data) {
        let widgetName = 'Alert State';
        let logPrefix = `[Alert State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].alertstate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-textOnTrue='${data.textOnTrue}'
                    mdw-textOnFalse='${data.textOnFalse}'
                ></div>
            `);

            vis.conn.getStates(data.oid, (error, states) => {
                let stateValue = states[data.oid].val;
                vis.binds["zugspitze-widgets"].alertstate.checkValue($this, stateValue, data.switchState);
            });

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].alertstate.checkValue($this, newVal, data.switchState);
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

$.initialize(".zugspitze-alert-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Alert State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].alertstate.getDataFromJson({
                debug: false,
                switchState: false,
                textOnTrue: 'OK',
                textOnFalse: 'FEHLER'
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].alertstate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});