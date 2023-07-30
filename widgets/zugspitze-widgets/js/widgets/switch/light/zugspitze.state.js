/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.89"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].switchlightstate = {
    getDataFromJson(obj) {
        return {
            oid: obj.oid,
            debug: obj.debug,
            active: obj.active
        }
    },
    checkValue($element, stateValue) {
        const $stateChild = $element.children('.switch');
            
        if (stateValue) {
            return $stateChild.addClass('checked');
        }
        
        return $stateChild.removeClass('checked');
    },
    createWidget: function (el, data) {
        let widgetName = 'Switch Light State';
        let logPrefix = `[Switch Light State - ${data.wid}] initialize:`;

        try {
            let $this = $(el);

            if (!$this.length) {
                return setTimeout(function () {
                    vis.binds["zugspitze-widgets"].switchlightstate.createWidget(el, data);
                }, 100);
            }

            let template = '';
            if (data.active) {
                template = `
                    <div class='materialdesign-checkbox-html-element'
                        style='width: 100%; height: 50px; position: relative; overflow: visible !important; display: flex; align-items: center; display:none;'
                        mdw-oid='${data.oid}'
                        mdw-toggleType='boolean'
                        mdw-valueOff='true'
                        mdw-valueOn='false'
                        mdw-stateIfNotTrueValue='on'
                        mdw-vibrateOnMobilDevices='50'
                        mdw-labelPosition='right'
                        mdw-labelClickActive='true'
                    ></div>
                `;
            }
            $this.html(`
                <label class="switch">
                    ${template}
                </label>
            `);

            vis.conn.getStates(data.oid, (error, states) => {
                let stateValue = states[data.oid].val;
                vis.binds["zugspitze-widgets"].switchlightstate.checkValue($this, stateValue && data.active);
            });

            function onChange(e, newVal, oldVal) {
                if (data.debug) console.log(`${logPrefix} [initialize] new value from binding: ${newVal}`);
                vis.binds["zugspitze-widgets"].switchlightstate.checkValue($this, newVal && data.active);
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

$.initialize(".zugspitze-switch-light-state-html-element", function () {
    let $this = $(this);
    let logPrefix = `[Switch Light State HTML Element]`;

    try {
        zugspitzeHelper.extractHtmlWidgetData(
            $this,
            vis.binds["zugspitze-widgets"].switchlightstate.getDataFromJson({
                debug: false,
                active: true
            }),
            logPrefix,
            initializeHtml
        );

        function initializeHtml(widgetData) {
            if (widgetData.debug) console.log(`${logPrefix} initialize widget`);
            vis.binds["zugspitze-widgets"].switchlightstate.createWidget($this, widgetData);
        }
    } catch (ex) {
        console.error(`${logPrefix} $.initialize: error: ${ex.message}, stack: ${ex.stack} `);
        $this.append(
            `<div style = "background: FireBrick; color: white;">Error ${ex.message}</div >`
        );
    }
});