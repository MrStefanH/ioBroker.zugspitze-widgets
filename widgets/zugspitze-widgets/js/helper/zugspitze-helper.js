/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.17"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].helper = {
    getHtmlParentId(el) {
        let parentId = "unknown";
        let $parent = el.closest(".vis-widget[id^=w]");
        parentId = $parent.attr("id");
        if (!parentId) {
            // Fallback if no parent id is found (e.g. MDW Dialog)
            parentId = Object.keys(vis.widgets)[0];
        }

        return parentId;
    },
    getBooleanFromData: function (dataValue, nullValue) {
        try {
            if (dataValue === undefined || dataValue === null || dataValue === '') {
                return nullValue;
            } else if (dataValue === true || dataValue === 'true' || dataValue === 1 || dataValue === '1') {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(`[Helper] getBooleanFromData: val: ${dataValue} error: ${err.message}, stack: ${err.stack}`);
            return `[Helper] getBooleanFromData: val: ${dataValue} error: ${err.message}, stack: ${err.stack}`;
        }
    },
    extractHtmlWidgetData(el, widgetData, logPrefix, callback) {
        for (const key of Object.keys(widgetData)) {
            if (key !== "wid") {
                if (el.attr(`zugspitze-${key}`)) {
                    widgetData[key] = el.attr(`zugspitze-${key}`);
                    widgetData[key] = formatTypeOfValue(widgetData[key]);
                } else if (el.attr(`zugspitze-${key.toLowerCase()}`)) {
                    widgetData[key] = el.attr(`zugspitze-${key.toLowerCase()}`);
                    widgetData[key] = formatTypeOfValue(widgetData[key]);
                } else {
                    delete widgetData[key];
                }
            }
        }

        widgetData.debug = widgetData.debug === true || widgetData.debug === 'true' ? true : false;
        if (widgetData.debug) console.log(`${logPrefix} [extractHtmlWidgetData] widgetData: ${JSON.stringify(widgetData)} `);

        if (callback) callback(widgetData);

        function formatTypeOfValue(value) {
            if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                return value.toLowerCase() === "true";
            }

            return value;
        }
    }
};

let zugspitzeHelper = vis.binds["zugspitze-widgets"].helper;