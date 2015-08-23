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

    onTapNav = function ( event ) {
      var css_map,
        $target = $( event.elem_target ).closest('.spa-avtr-box');

      if ( $target.length === 0 ) { return false; }
      $target.css({ 'background-color': getRandRgb() });
      updateAvatar( $target );
    };

    onHeldstartNav = function ( event ) {
      var offset_target_map, offset_nav_map,
        $target = $( event.elem_target ).closest('.spa-avtr-box');

      if ( $target.length === 0 ) { return false; }

      stateMap.$drag_target = $target;
      offset_target_map = $target.offset();
      offset_nav_map = jqueryMap.$container.offset();

      offset_target_map.top -= offset_nav_map.top;
      offset_target_map.left -= offset_nav_map.left;

      stateMap.drag_map = offset_target_map;
      stateMap.drag_bg_color = $target.css('background-color');

      $target
        .addClass('spa-x-is-drag')
        .css('background-color');
    };

    onHeldmoveNav = function ( event ) {
      var drag_map = stateMap.drag_map;
      if ( ! drag_map ) { return false; }

      drag_map.top += event.px_delta_y;
      drag_map.left += event.px_delta_x;

      stateMap.$drag_target.css({
        top: drag_map.top,
        left: drag_map.left
      });
    };

    onHeldendNav = function ( event ) {
      var $drag_target = stateMap.$drag_target;
      if ( ! $drag_target ) { return false; }

      $drag_target
        .removeClass('sap-x-is-drag')
        .css('background-color', stateMap.drag_bg_color);

      stateMap.drag_bg_color = undefined;
      stateMap.$drag_target = null;
      stateMap.drag_map = null;
      updateAvatar( $drag_target );
    };

    //todo
  };
  return {}; }());
