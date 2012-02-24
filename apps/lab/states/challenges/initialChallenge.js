// ==========================================================================
// Project:   Lab
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CcChat window Ki YES NO SC*/

/* This is a totally empty initial challenge state, implemented just so every
 * activity can have an initial challenge state which does nothing. Every activity
 * should get switched to a real challenge state by the inActivity state.
 *
 * ANY FUNCTIONALITY IMPLEMENTED HERE WILL GET RUN BY *ALL* ACTIVITIES, NO
 * MATTER THEIR REAL CHALLENGE STATE! So be careful what you put here.
 */
Lab.initialChallenge = Ki.State.extend({

  challengeComplete: YES,

  enterState: function() {
  },

  exitState: function() {
  }

});
