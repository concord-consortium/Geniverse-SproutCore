// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab SC Ki console*/

Lab.statechart = Ki.Statechart.create({

  initialState: 'loggedOut',

  loggedOut: Ki.State.plugin('Lab.loggedOut'),

  loggedIn: Ki.State.plugin('Lab.loggedIn')

});
