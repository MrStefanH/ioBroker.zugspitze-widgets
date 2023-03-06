/*
    ioBroker.vis zugspitze-widgets Widget-Set

    version: "0.0.61"

    Copyright 2023 MonkeyParson pfaffe.st@gmail.com
*/
"use strict";

/* global $, vis, systemDictionary */

// add translations for edit mode
$.extend(
    true,
    systemDictionary,
    {
        // Add your translations here, e.g.:
        // "size": {
        // 	"en": "Size",
        // 	"de": "Größe",
        // 	"ru": "Размер",
        // 	"pt": "Tamanho",
        // 	"nl": "Grootte",
        // 	"fr": "Taille",
        // 	"it": "Dimensione",
        // 	"es": "Talla",
        // 	"pl": "Rozmiar",
        // 	"zh-cn": "尺寸"
        // }
    }
);

// this code can be placed directly in zugspitze-widgets.html
vis.binds["zugspitze-widgets"] = {
    version: "0.0.61",
    showVersion: function () {
        if (vis.binds["zugspitze-widgets"].version) {
            console.log('Version zugspitze-widgets: ' + vis.binds["zugspitze-widgets"].version);
            vis.binds["zugspitze-widgets"].version = null;
        }
    }
};

vis.binds["zugspitze-widgets"].showVersion();