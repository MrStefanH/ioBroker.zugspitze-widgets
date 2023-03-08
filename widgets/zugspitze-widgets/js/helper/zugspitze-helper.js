/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.67"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].helper = {
    extractHtmlWidgetData(el, widgetData, logPrefix, callback) {
        for (const key of Object.keys(widgetData)) {
            if (key !== "wid") {
                if (el.attr(`zugspitze-${key}`)) {
                    widgetData[key] = el.attr(`zugspitze-${key}`);
                    widgetData[key] = formatTypeOfValue(widgetData[key]);
                } else if (el.attr(`zugspitze-${key.toLowerCase()}`)) {
                    widgetData[key] = el.attr(`zugspitze-${key.toLowerCase()}`);
                    widgetData[key] = formatTypeOfValue(widgetData[key]);
                } else if (widgetData[key] === undefined || widgetData[key] === null) {
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