/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.18"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].alertstate = {
    initialize: async function (el, data) {
        let widgetName = 'Alert State';
        let logPrefix = `[Alert State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);
            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-textOnTrue='OK'
                    mdw-textOnFalse='FEHLER'
                ></div>
            `);

            vis.states.bind(data.oid + '.val', function (e, newVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].alertstate.checkValue($this, newVal);
            });
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug
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
                    vis.binds["zugspitze-widgets"].alertstate.createWidget(widgetID, view, data, style);
                }, 100);
            }

            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='${data.debug}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-textOnTrue='OK'
                    mdw-textOnFalse='FEHLER'
                ></div>
            `);

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].alertstate.checkValue($this, newVal);
            }
            
            vis.states.bind(data.oid + '.val', onChange);
            //remember bound state that vis can release if didnt needed
			$div.data('bound', [data.oid + '.val']);
			//remember onchange handler to release bound states
			$div.data('bindHandler', onChange);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-alert-state-html-element", function () {
    let $this = $(this);
    let debug = zugspitzeHelper.getBooleanFromData($this.attr('zugspitze-debug'), false);
    let parentId = "unknown";
    let logPrefix = `[Alert State HTML Element - ${parentId.replace('w', 'p')}]`;

    try {
        parentId = zugspitzeHelper.getHtmlParentId($this);
        logPrefix = `[Alert State HTML Element - ${parentId.replace('w', 'p')}]`;

        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].alertstate.getDataFromJson({}),
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