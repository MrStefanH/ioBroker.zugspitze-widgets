/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.9"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].alertstate = {
    initialize: async function (el, data) {
        try {
            let $this = $(el);
            $this.html(`
                <div class="ml-auto mb-0 materialdesign-value-html-element"
                    mdw-debug='false'
                    data-oid='${data.oid}'
                    mdw-oid='${data.oid}'
                    mdw-targetType='auto'
                    mdw-textAlign='start'
                    mdw-textOnTrue='OK'
                    mdw-textOnFalse='FEHLER'
                ></div>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
    },
    getDataFromJson(obj) {
        return {
            oid: obj.oid
        }
    }
}

$.initialize(".zugspitze-alert-state-html-element", function () {
    let $this = $(this);
    let parentId = "unknown";

    try {
        let widgetName = `Value HTML Element`;
        parentId = zugspitzeHelper.getHtmlParentId($this);

        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].alertstate.getDataFromJson({}),
            parentId,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            vis.binds["zugspitze-widgets"].alertstate.initialize($this, widgetData);
        }
    } catch (ex) {
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});