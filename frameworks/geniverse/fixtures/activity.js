// ==========================================================================
// Project:   Geniverse.Activity Fixtures
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */

sc_require('models/activity');

Geniverse.Activity.FIXTURES = [

  { guid: 1,
    title: 'Geniverse Activity',
    baseChannelName: 'geniverse-chat-trial-b',
    maxUsersInRoom: 4,
    initialAlleles: "[ [ [ {alleles: 'a:A,b:A,a:B,b:B', sex: 1, name: 'Starting Mother'}, " +
          "{alleles: 'a:A,b:a,a:B,b:B', sex: 0, name: 'Starting Father'}, " +
          "{alleles: 'a:a,b:a,a:B,b:B', sex: 1, name: 'Starting Mother2'}, " +
          "{alleles: 'a:a,b:a,a:B,b:B', sex: 0, name: 'Starting Father2'} ]," +
          "[ {alleles: 'a:A,b:A,a:B,b:B', sex: 1, name: 'Starting Mother'}, " +
          "{alleles: 'a:A,b:a,a:B,b:B', sex: 0, name: 'Starting Father'}, " +
          "{alleles: 'a:a,b:a,a:B,b:B', sex: 1, name: 'Starting Mother2'}, " +
          "{alleles: 'a:a,b:a,a:B,b:B', sex: 0, name: 'Starting Father2'} ] ] ];",
    sendBredDragons: NO
  }

];
