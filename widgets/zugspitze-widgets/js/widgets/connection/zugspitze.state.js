/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.7"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].connectionstate = {
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
    getDataFromJson(obj, widgetId) {
        return {
            wid: widgetId,

            // Common
            oid: obj.oid,
            targetType: obj.targetType,
            overrideText: obj.overrideText,
            debug: obj.debug,

            // layout
            textAlign: obj.textAlign,
            valueLabelWidth: obj.valueLabelWidth,
            valuesFontColor: obj.valuesFontColor,
            valuesFontFamily: obj.valuesFontFamily,
            valuesFontSize: obj.valuesFontSize,
            prepandText: obj.prepandText,
            prepandTextColor: obj.prepandTextColor,
            prepandTextFontFamily: obj.prepandTextFontFamily,
            prepandTextFontSize: obj.prepandTextFontSize,
            appendText: obj.appendText,
            appendTextColor: obj.appendTextColor,
            appendTextFontFamily: obj.appendTextFontFamily,
            appendTextFontSize: obj.appendTextFontSize,

            // number formatting
            valueLabelUnit: obj.valueLabelUnit,
            minDecimals: obj.minDecimals,
            maxDecimals: obj.maxDecimals,
            calculate: obj.calculate,
            convertToDuration: obj.convertToDuration,

            // boolean formatting
            textOnTrue: obj.textOnTrue,
            textOnFalse: obj.textOnFalse,
            condition: obj.condition,

            // icon
            image: obj.image,
            imageColor: obj.imageColor,
            iconPosition: obj.iconPosition,
            iconHeight: obj.iconHeight,

            // value change effect
            changeEffectEnabled: obj.changeEffectEnabled,
            effectFontColor: obj.effectFontColor,
            effectFontSize: obj.effectFontSize,
            effectDuration: obj.effectDuration
        }
    }
}

$.initialize(".zugspitze-connection-state-html-element", function () {
    let $this = $(this);
    let parentId = "unknown";

    try {
        let widgetName = `Value HTML Element`;
        parentId = zugspitzeHelper.getHtmlParentId($this);

        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].connectionstate.getDataFromJson({}, parentId),
            parentId,
            widgetName,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            vis.binds["zugspitze-widgets"].connectionstate.initialize($this, widgetData);
        }
    } catch (ex) {
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});