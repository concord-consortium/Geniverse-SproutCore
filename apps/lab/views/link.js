// ==========================================================================
// Project:   Lab - LinkView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab */

/**
 * This makes a HTML anchor link with a LabelView child
 * by overloading the render method.
 * Be sure to set the href property.
 * If the title property is set,
 * the link's label's value will be set to title.
 * If layerId property is set,
 * the link's label's layerId will be set to layerId+'Label'.
 * The toolTip property works too.
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
Lab.LinkView = SC.View.extend({
  title:  '',
  layerId: null,
  target: null,
  action: null,
  toolTip: null,
  tagName: 'a',

  render: function(context, firstTime) {
    // add href attr if tagName is anchor...
    var href, toolTip, classes, theme;
    if (this.get('tagName') === 'a') {
      href = this.get('href');
      if (!href || (href.length === 0)) {
        var _target = this.get('target');
        var _action = this.get('action');
        if (_target && _action) {
          href = 'javascript:' + _target + '.' + _action + '();';
        } else {
          href = 'javascript:;';
        }
      }
      context.attr('href', href);
    }

    // if there is a title, add a child label and set its value to title
    var _title = this.get('title');
    if (firstTime && _title) {
      var labelLayerId = '';
      var _layerId = this.get('layerId');
      if (_layerId) labelLayerId = _layerId + 'Label';
      this.appendChild(
        this.createChildView(
          SC.LabelView.design({
            layerId: labelLayerId,
            value: _title
          })
          )
        );
    }

    // If there is a toolTip set, grab it and localize if necessary.
    toolTip = this.get('toolTip');
    if (SC.typeOf(toolTip) === SC.T_STRING) {
      if (this.get('localize')) toolTip = toolTip.loc();
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }

    // render inner html
    sc_super();
  }
});