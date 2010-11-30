// ==========================================================================
// Project:   Geniverse.NoteRecord
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

/** @class

  This is the model for records that represent the textual content of a Notepad

  @extends SC.Record
  @version 0.1
  @author Dr. Baba Kofi Weusijana <kofi@edutek.net>
*/
Geniverse.NoteRecord = SC.Record.extend(
/** @scope Geniverse.NoteRecord.prototype */ {

  username: SC.Record.attr(String, {
    isRequired: YES
  }),
  
  text: SC.Record.attr(String, {
    defaultValue: '', 
    isRequired: YES
  }),
  
  time: SC.Record.attr(Number)

});

Geniverse.NoteRecord.modelName = "noteRecord";
Geniverse.NoteRecord.modelsName = "noteRecords";

// TODO enable if we want to use the automated rails backend code to persist changes to activities
// Geniverse.railsBackedTypes.push(Geniverse.NoteRecord.modelName);