/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.89"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].cardbodystate = {
    getDataFromJson(obj) {
        return {
            label: obj.label,
            debug: obj.debug,
            id: obj.id,
            oid: obj.oid,
            reachable: obj.reachable
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Card Body State';
        let logPrefix = `[Card Body State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].cardbodystate.createWidget(el, data);
                }, 100);
            }

            let errorTemplate = '';
            if (!data.reachable) {
                errorTemplate = '<div class="error-card-state">NICHT<br />VERFÜGBAR</div>'
            }
            $this.html(`
                <div class="card-body d-flex flex-row justify-content-between align-items-center ${!data.reachable ? 'disabled-box' : ''}">
                    <div>
                        <h5>${data.label}</h5>
                        <div class="zugspitze-button-more-state-html-element"
                            zugspitze-label='Details'
                            zugspitze-id='${data.id}'
                        ></div>
                    </div>
                    ${errorTemplate}
                    <div class="zugspitze-switch-light-state-html-element"
                        zugspitze-oid='${data.oid}'
                        zugspitze-active='${data.reachable}'
                    ></div>
                </div> 
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-card-body-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Card Body State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].cardbodystate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].cardbodystate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});