// ==========================================================================
// Project:   Geniverse - NotepadView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/**
 *   @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
 */
Geniverse.NotepadView = SC.PalettePane.create({
  layout: { width: 440, height: 430, centerX: 0, centerY: 0 },
  isModal:NO,
  contentView: SC.View.extend({
    childViews: 'titleView notepadView hideButton'.w(),

    titleView: SC.LabelView.design({
      layout: { centerY: 0, height: 24, left: 0, top:0, width: 440 },
      //valueBinding: this.get('titlePath'),
      value: 'Note Pad',
      controlSize: "bity",
      fontWeight: SC.BOLD_WEIGHT,
      textAlign: SC.ALIGN_CENTER,
      classNames: "sc-pane sc-main sc-theme".w()
    }),

    hideButton: SC.ButtonView.extend({
      layout: { bottom: 5, right: 5, width: 200, height: 24 },
      title: "Save and Close",
      action: "commitAndRemoveView",
      target: "Geniverse.notepadController"
    }),

    // TODO: Solve Firefox bugs:
    //  1: value property is not updated when notepadView doesn't have focus (lacks blue outline)
    //  2: titleView lacks dark background, making title hard to read 
    notepadView: SC.TextFieldView.design({
      layout: { left: 10, top: 24, width: 420, height: 375 },
      hint: "Type your personal lab notes into this Note Pad",
      isEditable: YES,
      isTextArea: YES,
      //valueBinding: "Geniverse.notepadController.content"
      value: "",
      notepadViewValueDidChange: function () {
        var notepadViewValue = this.get('value');
        //console.log('notepadViewValueDidChange to:',notepadViewValue);
        //console.log("setting notepadController content");
        Geniverse.notepadController.set('content',notepadViewValue);
      }.observes('value')
    })
  })
});