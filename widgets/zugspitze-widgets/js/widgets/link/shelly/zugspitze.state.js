/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.47"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].linkshellystate = {
    getDataFromJson(obj) {
        return {
            host: obj.host,
            debug: obj.debug
        }
    },
    createWidget: function (el, data) {
        let widgetName = 'Link Shelly State';
        let logPrefix = `[Link Shelly State - ${data.wid}] initialize:`;
        const host = data.host;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].linkshellystate.createWidget(el, data);
                }, 100);
            }

            $this.html(`
                <li class="shelly-admin-link list-group-item pt-0 pb-4">
                    <div class='materialdesign-button-html-element'
                        mdw-type='link_vertical'
                        mdw-debug='false'
                        mdw-href='http://${host}'
                        mdw-openNewWindow='true'
                        mdw-vibrateOnMobilDevices='50'
                        mdw-buttontext='Shelly Admin'
                    ></div>
                </li>
            `);
        } catch (ex) {
            console.error(`[${widgetName} - ${data.wid}] initialize: error: ${ex.message}, stack: ${ex.stack}`);
        }
	}
}

$.initialize(".zugspitze-link-shelly-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Link Shelly State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].linkshellystate.getDataFromJson({
                debug: false
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].linkshellystate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});