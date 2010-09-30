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
    maxUsersInRoom: 2,
    initialAlleles: "[" + 
      "[{alleles: 'a:H,b:h,a:W,b:w,a:L,b:L,a:T,b:t,a:f,b:f,a:B', sex: 1, name: 'Starting Mother'}," +
       "{alleles: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:t,a:f,b:f,a:B', sex: 0, name: 'Starting Father'}," +
       "{alleles: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:t,a:f,b:f,a:b', sex: 0, name: 'Starting Father2'}]," +
      "[{alleles: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f,a:B', sex: 1, name: 'Starting Mother'}, {alleles: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f,a:B', sex: 0, name: 'Starting Father'}] ]",
    // initialAlleles: [
    //                               {m: 'a:H,b:h,a:W,b:w,a:L,b:L,a:T,b:t,a:f,b:f', f: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:t,a:f,b:f'}
    //                             ],
    // initialAlleles: [
    //                       {m: 'a:H,b:h,a:w,b:w,a:L,b:L,a:t,b:t,a:F,b:F', f: 'a:H,b:h,a:w,b:w,a:L,b:L,a:t,b:t,a:F,b:F'},
    //                       {m: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f', f: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f'},
    //                       {m: 'a:H,b:H,a:w,b:w,a:L,b:l,a:t,b:t,a:F,b:F', f: 'a:H,b:H,a:w,b:w,a:L,b:l,a:t,b:t,a:F,b:F'},
    //                       {m: 'a:h,b:h,a:W,b:W,a:l,b:l,a:T,b:t,a:f,b:f', f: 'a:h,b:h,a:W,b:W,a:l,b:l,a:T,b:t,a:f,b:f'},
    //                       {m: 'a:H,b:H,a:w,b:w,a:L,b:L,a:T,b:T,a:F,b:f', f: 'a:H,b:H,a:w,b:w,a:L,b:L,a:T,b:T,a:F,b:f'},
    //                       {m: 'a:H,b:h,a:w,b:w,a:L,b:L,a:t,b:t,a:F,b:F', f: 'a:H,b:h,a:w,b:w,a:L,b:L,a:t,b:t,a:F,b:F'},
    //                       {m: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f', f: 'a:h,b:h,a:W,b:w,a:l,b:l,a:T,b:T,a:f,b:f'},
    //                       {m: 'a:H,b:H,a:w,b:w,a:L,b:l,a:t,b:t,a:F,b:F', f: 'a:H,b:H,a:w,b:w,a:L,b:l,a:t,b:t,a:F,b:F'}
                    // ],
    sendBredDragons: NO
  }

];
