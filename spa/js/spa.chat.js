/*
 * spa.chat.js
 * Chat feature module for SPA
 */

/* global $, spa */
spa.chat = (function () {
  //module scope variables
  var
    configMap = {
      main_html: String()
        + '<div style="padding:1em; color:#fff;">'
          + 'Say hello to chat'
        + '</div>',
      settable_map: {}
    },
    stateMap = { $container: null },
    jqueryMap = {},

    setJqueryMap, configModule, initModule
  ;

  //DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { $container: $container };
  };

  //public method /configModule/
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
    return true;
  };

  //public method /initModule/
  initModule = function ( $container ) {
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };

  //return public methods
  return {
    configModule: configModule,
    initModule: initModule
  };
}());
