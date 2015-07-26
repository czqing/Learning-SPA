/*
 * spa.shell.js
 * Shell module for SPA
 */

/* global $, spa */
spa.shell = (function () {
  'use strict';
  //module scope variables
  var
    configMap = {
      anchor_schema_map: {
        chat: { opened: true, closed: true }
      },
      resize_interval: 200,
      main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo">'
            + '<h1>SPA</h1>'
            + '<p>javascript end to end</p>'
          + '</div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>'
        + '<div class="">'
    },
    stateMap = {
      $container: undefined,
      anchor_map: {},
      resize_idto: undefined
    },
    jqueryMap = {},

    copyAnchorMap, setJqueryMap,
    changeAnchorPart, onHashchange, onResize,
    onTapAcct, onLogin, onLogout,
    setChatAnchor, initModule;

  //utility methods
  //return copy of stored anchor map; minimizes overhead
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };

  //DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $acct: $container.find('.spa-shell-head-acct'),
      $nav: $container.find('.span-shell-main-nav')
    };
  };

  //DOM method /toggleChat/
  /*
  toggleChat = function ( do_extend, callback ) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = !is_open && !is_closed;

    //avoid race condition
    if ( is_sliding ) { return false; }

    //extend chat slider
    if ( do_extend ) {
      jqueryMap.$chat.animate(
        { height: configMap.chat_extend_height },
        configMap.chat_extend_time,
        function () {
          jqueryMap.$chat.attr(
            'title', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if ( callback ) { callback( jqueryMap.$chat ) }
        }
      );
      return true;
    }

    //retract chat slider
    jqueryMap.$chat.animate(
      { height: configMap.chat_retract_height },
      configMap.chat_retract_time,
      function () {
        jqueryMap.$chat.attr(
          'title', configMap.chat_retracted_title
        );
        stateMap.is_chat_retracted = true;
        if ( callback ) { callback( jqueryMap.$chat ) }
      }
    );
    return true;
  };
  */

  //DOM method /changeAnchorPart/
  changeAnchorPart = function ( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep;

    //merge changes into anchor map
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {
        //skip dependent keys during iteration
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        //update matching dependent key
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }

    //attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      //replace URI with existing state
      $.usiAnchor.setAnchor( stateMap.anchor_map, null, true );
      bool_return = false;
    }

    return bool_return;
  };

  //event handler /onResize/
  onResize = function () {
    if ( stateMap.resize_idto )  { return true; }
    spa.chat.handleResize();
    stateMap.resize_idto = setTimeout(
      function () { stateMap.resize_idto = undefined; },
      configMap.resize_interval
    );
    return true;
  };

  //event handler /onHashchange/
  onHashchange = function ( event ) {
    var
      anchor_map_previous = copyAnchorMap(),
      is_ok = true,
      anchor_map_proposed,
      _s_chat_previous, _s_chat_proposed, s_chat_proposed;

    //attempt to parse anchor
    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    //convenience vars
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    //adjust chat component if changed
    if ( !anchor_map_previous
      || _s_chat_previous !== _s_chat_proposed
    ) {
      s_chat_proposed = anchor_map_proposed.chat;
      switch ( s_chat_proposed ) {
        case 'opened':
          is_ok = spa.chat.setSliderPosition( 'opened' );
        break;
        case 'closed':
          is_ok = spa.chat.setSliderPosition( 'closed' );
        break;
        default:
          spa.chat.setSliderPosition( 'closed' );
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }

    //revert anchor if slider change denied
    if ( !is_ok ) {
      if ( anchor_map_previous ) {
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        stateMap.anchor_map = anchor_map_previous;
      } else {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }

    return false;
  };

  onTapAcct = function ( event ) {
    var acct_text, user_name, user = spa.model.people.get_user();
    if ( user.get_is_anon() ) {
      user_name = prompt( 'Please sign-in' );
      spa.model.people.login( user_name );
      jqueryMap.$acct.text( '... processing ...' );
    }
    else {
      spa.model.people.logout();
    }
    return false;
  };

  onLogin = function ( event, login_user ) {
    jqueryMap.$acct.text( login_user.name );
  };

  onLogout = function ( event, logout_user ) {
    jqueryMap.$acct.text( 'Please sign-in' );
  };

  //callback method /setChatAnchor/
  setChatAnchor = function ( position_type ) {
    return changeAnchorPart({ chat: position_type });
  };

  //public method /initModule/
  initModule = function ( $container ) {
    //load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    //configure uriAnchor
    $.uriAnchor.configModule({
      schema_map: configMap.anchor_schema_map
    });

    //configure and initialize feature modules
    spa.chat.configModule({
      set_chat_anchor: setChatAnchor,
      chat_model: spa.model.chat,
      people_model: spa.model.people
    });
    spa.chat.initModule( jqueryMap.$container );

    //Handle URI anchor change events
    $(window)
      .bind( 'resize', onResize )
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );

    $.gevent.subscribe( $container, 'spa-login', onLogin );
    $.gevent.subscribe( $container, 'spa-logout', onLogout );

    jqueryMap.$acct
      .text( 'Please sign-in' )
      .bind( 'utap', onTapAcct );
  };

  return { initModule: initModule };
}());
