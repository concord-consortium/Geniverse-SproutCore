// ==========================================================================
// Project:   Geniverse.Activity Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Geniverse */

sc_require('models/activity');

Geniverse.Activity.FIXTURES = [

  { guid: 1,
    title: 'Geniverse Activity',
    baseChannelName: 'geniverse-chat-trial-b',
    maxUsersInRoom: 4,
    initialAlleles: "[" + 
      "[{alleles: 'a:H,b:H,a:B', sex: 1, name: 'Starting Mother'}," +
       "{alleles: 'a:w,b:w,a:B', sex: 0, name: 'Starting Father'}," +
       "{alleles: 'a:T,b:T,a:B', sex: 1, name: 'Starting Mother2'}," +
       "{alleles: 'a:l,b:l,a:B', sex: 0, name: 'Starting Father2'}]," +
      "[{alleles: 'a:h,b:h,a:B', sex: 1, name: 'Starting Mother'}," +
       "{alleles: 'a:W,b:W,a:B', sex: 0, name: 'Starting Father'}," +
       "{alleles: 'a:t,b:t,a:B', sex: 1, name: 'Starting Mother2'}," +
       "{alleles: 'a:L,b:L,a:B', sex: 0, name: 'Starting Father2'}]" +
     "]",
    sendBredDragons: NO
  }

];
