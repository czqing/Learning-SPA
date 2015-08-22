/*
 * spa.avtr.js
 * Avatar feature module
 */

/*global $, spa */
spa.avtr = (function () {
  'use strict';
  
  var
    configMap = {
      chat_model: null,
      people_model: null,
      settable_map: {
        chat_model: true,
        people_model: true
      }
    },

    stateMap = {
      drag_map: null,
      $drag_target: null,
      drag_bg_color: undefined
    },

    jqueryMap = {},

    getRandRgb,
    setJqueryMap,
    updateAvatar,
    onTapNav, onHeldstartNav,
    onHeldmoveNav, onHeldendNav,
    onSetchatee, onListchange,
    onLogout,
    configModule, initModule;

  getRandRgb = function () {
    var i, rgb_list = [];
    for ( i = 0; i < 3; i++ ) {
      rgb_list.push( Math.floor( Math.random() * 128 ) + 128 );
    }
    return 'rgb(' + rgb_list.join(',') + ')';
  };

  setJqueryMap = function ( $container ) {
    jqueryMap = { $container: $container };
  };

  updateAvtar = function ( $target ) {
    var css_map, person_id;

    css_map = {
      top: parseInt( $target.css( 'top' ), 10 ),
      left: parseInt( $target.css( 'left' ), 10),
      'background-color': $target.css('background-color')
    };
    person_id = $target.attr( 'data-id' );

    configMap.chat_model.update_avatar({
      person_id: person_id,
      css_map: css_map
    });

    //todo
  };
  return {}; }());
