// ==========================================================================
// Project:   Geniverse - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Lab Geniverse CC, CcChat, java static_url sc_static sc_require */
Lab.marginSize = 15;

sc_require('views/top_bar_view');
sc_require('views/bottom_bar_view');

Lab.identCodonPage = SC.Page.design({
  
  pagePath: 'Lab.identCodonPage',
  title: 'Identify the Connection Between DNA and Amino Acids',
  
  // challengeType: 'matchOneAtATimeChallenge',
  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    // defaultResponder: Geniverse,
    classNames: ['brown'], 
    childViews: 'backgroundView mainAppView topBar bottomBar'.w(),
    backgroundView: SC.ImageView.design({
      value: static_url('lab_background.png'),
      classNames: ['transparent','scalingimage']
    }),
    topBar: Lab.TopBarView.design({
      classNames: ['brown']
    }),
    bottomBar: Lab.BottomBarView.design({
      classNames: ['brown']
    }),

    mainAppView: SC.View.design({
      
      childViews: 'mwAppletView'.w(),
      
		  mwAppletView: SC.View.design({

			  childViews: 'mwApplet DNAString setDNAButton startButton stopButton resetButton'.w(),

				mwApplet: CC.MwAppletView.design({
			    cmlUrl: "http://mw2.concord.org/model/133c86ed444/transcribe-translate.cml",
			    layout: { centerX: 0, centerY: -90, width: 554, height: 325 }
			  }),
			
				DNAString: SC.TextFieldView.design({
					layout: { centerX: -60, centerY: 110, width: 400, height: 25},
					value: "AGATTTGGGCTCATGCTAGCTATAGTAGTATAA",
					leftAccessoryView: SC.LabelView.design({
							layout: { left: 5, top: 3, width: 90, height: 25},
							value: 'Coding Strand: ',
							classNames: ['textFieldLabel']
							})
				}),

				setDNAButton: SC.ButtonView.design({
					layout: { centerY: 111, centerX: 207, height: 25, width: 125},
					title: "Set DNA Strand",
					appletBinding: "*parentView.mwApplet",
					strandBinding: "*parentView.DNAString.value",
					action: function() {
						this.get('applet').run(this.appletAction,this);
					},
					appletAction: function(applet) {
						applet.runMWScript("mw2d:1:reset;");
						setTimeout(applet.runMwScript("mw2d:1:stop; select atom all; remove; set DNA "+this.get('strand')),500);
					}
				}),

				startButton: SC.ButtonView.design({
					layout: { centerY: 150, centerX: -85, height: 50, width: 80},
					title: "Start",
					appletBinding: "*parentView.mwApplet",
					action: function() {
						this.get('applet').run(this.appletAction);
					},
					appletAction: function(applet) {
						applet.runMwScript("mw2d:1:run");
					}
				}),

				stopButton: SC.ButtonView.design({
					layout: { centerY: 150, centerX: 0, height: 50, width: 80},
					title: "Stop",
					appletBinding: "*parentView.mwApplet",
					action: function() {
						this.get('applet').run(this.appletAction);
					},
					appletAction: function(applet) {
						applet.runMwScript("mw2d:1:stop");
					}
				}),

				resetButton: SC.ButtonView.design({
					layout: { centerY: 150, centerX: 85, height: 50, width: 80},
					title: "Reset",
					appletBinding: "*parentView.mwApplet",
					strandBinding: "*parentView.DNAString.value",
					action: function() {
						this.get('applet').run(this.appletAction,this);
					},
					appletAction: function(applet) {
						applet.runMWScript("mw2d:1:reset;");
						setTimeout(applet.runMwScript("mw2d:1:stop; select atom all; remove; set DNA "+this.get('strand')),500);
					}
				})
			})
		})
  })      
});

