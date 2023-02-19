/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.15"

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
                checkValue($this, newVal);
            });

            $('body').bind('rendered', function() {
                if (data.debug) console.log(`${logPrefix} [initialize] check value after body was rendered`);
                checkValue($this, vis.states[data.oid + '.val']);    
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
    }
}

$.initialize(".zugspitze-alert-state-html-element", function () {
    let $this = $(this);
    let debug = zugspitzeHelper.getBooleanFromData($this.attr('zugspitze-debug'), false);
    let parentId = "unknown";
    let logPrefix = `[Alert State HTML Element - ${parentId.replace('w', 'p')}]`;

    try {
        let widgetName = `Alert State HTML Element`;
        parentId = zugspitzeHelper.getHtmlParentId($this);
        logPrefix = `[Alert State HTML Element - ${parentId.replace('w', 'p')}]`;

        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].alertstate.getDataFromJson({}, parentId),
            parentId,
            widgetName,
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].alertstate.initialize($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});