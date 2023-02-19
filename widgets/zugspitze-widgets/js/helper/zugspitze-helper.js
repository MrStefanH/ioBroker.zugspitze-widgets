/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.6"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

vis.binds["zugspitze-widgets"].helper = {
    getViewOfWidget(wid) {
        for (var view in vis.views) {
            if (vis.views[view].widgets && vis.views[view].widgets[wid]) {
                return view;
            }
        }
    },
    subscribeStatesAtRuntime(wid, callback) {
        let view = vis.binds["zugspitze-widgets"].helper.getViewOfWidget(wid);

        if (!view || vis.editMode) {
            if (callback) callback();
            return;
        }

        if (!vis.subscribing.activeViews.includes(view)) {
            vis.subscribing.activeViews.push(view);
        }

        vis.subscribing.byViews[view] = vis.subscribing.byViews[view] || [];

        // subscribe
        var oids = [];
        for (var i = 0; i < vis.subscribing.byViews[view].length; i++) {
            let oid = vis.subscribing.byViews[view][i];

            if (!vis.subscribing.active.includes(oid)) {
                vis.subscribing.active.push(oid);

                oids.push(oid);
            }

            if (!vis.subscribing.IDs.includes(oid)) {
                vis.subscribing.IDs.push(oid);
            }
        }

        if (oids.length > 0) {
            var that = vis;
            vis.conn._socket.emit('getStates', oids, function (error, data) {
                if (error) that.showError(error);

                that.updateStates(data);

                if (callback) callback();
            });
        } else {
            if (callback) callback();
        }
    },
    oidNeedSubscribe(
        oid,
        wid,
        oidNeedSubscribe,
    ) {
        let view = vis.binds["zugspitze-widgets"].helper.getViewOfWidget(wid);

        if (oid !== undefined) {
            // Check if Oid is subscribed and put to vis subscribing object
            if (!vis.editMode) {
                if (!vis.subscribing.byViews[view].includes(oid)) {
                    vis.subscribing.byViews[view].push(oid);

                    return true;
                }

                if (!vis.subscribing.IDs.includes(oid)) {
                    vis.subscribing.byViews[view].push(oid);

                    return true;
                }
            }
        }

        return oidNeedSubscribe;
    },
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
    extractHtmlWidgetData(el, widgetData, parentId, widgetName, callback) {
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

        if (widgetData.oid) {
            let oidsNeedSubscribe = zuspitzeHelper.oidNeedSubscribe(
                widgetData.oid,
                parentId,
                false
            );

            if (widgetData["oid-working"]) {
                oidsNeedSubscribe = zuspitzeHelper.oidNeedSubscribe(
                    widgetData["oid-working"],
                    parentId,
                    false
                );
            }

            if (oidsNeedSubscribe) {
                zuspitzeHelper.subscribeStatesAtRuntime(
                    parentId,
                    function () {
                        if (callback) callback(widgetData);
                    }
                );
            } else {
                if (callback) callback(widgetData);
            }
        } else {
            if (callback) callback(widgetData);
        }

        function formatTypeOfValue(value) {
            if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                return value.toLowerCase() === "true";
            }

            return value;
        }
    }
};

let zuspitzeHelper = vis.binds["zugspitze-widgets"].helper;