// ==========================================================================
// Project:   Lab - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse */

// This page describes the main user interface for your application.
Lab.loginPage = SC.Page.design({
  pagePath: 'Lab.loginPage',
  title: 'Lab Login Page',
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: Lab.statechart,

    layerId: 'login',
    title: "Welcome to the Geniverse Labs",
    childViews: 'loginBg loginPanel drakes'.w(),

    loginBg: SC.View.design({
      layerId: 'loginBox',
      layout: { height: 290, width: 250, top: 100, right: 50 }
    }),

    drakes: SC.View.design({
      layerId: 'drakes',
      layout: { height: 80, right: 140, top: 0, width: 501 }
    }),

    loginPanel: Lab.LoginLoginView.design({
      layout: {top: 120, width: 210, height: 240, right: 70}
    }),

    drakesTimer: null,
    didDisplay: function() {
      if (this.get('isVisibleInWindow')) {
        console.log("displaying now");
        this.animate();
      } else {
        console.log("not displaying anymore");
        if (this.get('drakesTimer')) {
          clearTimeout(this.get('drakesTimer'));
          this.set('drakesTimer', null);
        }
      }
    }.observes('isVisibleInWindow'),
    animationStep: 0,
    animate: function() {
      var _this = this;
      var animation = function() {
        clearTimeout(_this.get('drakesTimer'));
        var step = _this.get('animationStep');
        var top = step * 80;
        var delay = 150;
        if (step == 9) {
          _this.set('animationStep', 0);
          delay = 7000;
        } else {
          _this.set('animationStep', step+1);
        }
        $('#drakes').css({'background-position': 'right -' + top + 'px'});
        _this.set('drakesTimer', setTimeout(animation, delay));
      };
      this.set('drakesTimer', setTimeout(animation, 150));
    }
  })
});
