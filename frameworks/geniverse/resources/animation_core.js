sc_require('lib/burst-core');

(function(window, document, $, Raphael, Burst){

  $.fn.geniverse = function(json_file, geneMap, options) { // geneMap is file containing visiblity that can be merged -Dan
    var burst = new Burst();

    // DEFAULTS
    //////////////////////////////////////////////////////////////////////////////

    var defaultOpts = $.extend(true,{
      mode            : 'parent',
      context         : null,
      loaded          : $.noop,
      animationComplete: $.noop,
      gameteSelected  : $.noop,
      zoom            : 2,
      width           : 460,
      height          : 320,
      swap            : 'none', // was 'user' but this causes pause at frame 30
      alleleCount     : 12,
      segLength       : 10,
      segCount        : 3,
      segMoveSpeed    : 5,
      innerThickness  : 6,
      outerThickness  : 14,
      dragTimeout     : 2000,
      grabAllele      : 1,
      maxDragSpeed    : 12,
      unfoldedAngle   : Math.PI / 6,
      foldedAngle     : Math.PI / 6, // keep chromosomes unfolded used to be Math.PI * 2
      foldDamp        : Math.PI / 4,
      alleleAngleChangeProbability : 0.09889,
        
      color: {
        hover              : "#00FF00",
        male_inner         : "rgba(0,0,255,1)",
        male_outer         : "rgba(0,0,255,.1)",
        female_inner       : "rgba(0,0,255,1)",
        female_outer       : "rgba(0,0,255,.1)",
        male_outer_hover   : "rgba(0,0,255,.1)",
        female_outer_hover : "rgba(255,0,255,.1)",

        recomb_inner_hover : "rgba(0,128,0,0.85)",
        recomb_outer_hover : "rgba(0,255,0,0.333)",

        swapUI_fill        : "#EEEEEE",
        swapUI_stroke      : "#BBBBBB",
        cell_fill          : "#EFEFFF",
        cell_stroke        : "#DEDEFF",
        cell_fill_hover    : "#CCFFCC",
        cell_stroke_hover  : "#AAFFAA",
		cell_selected      : "#f8fe0e"
      }
    }, options);
    // ^^ DEFAULTS.



    // GLOBAL VARIABLES
    ////////////////////////////////////////////////////////////////////////////

    var self = this,
        drawLoop, // The variable in which the main draw loop Interval is storred
        membranes = [],
        chromosomes = [],
        mode = defaultOpts.mode,
        owner = defaultOpts.owner,
        inRecombSelection = 0,
        inRecombChromeIndex = null,
        pairingMode = false,
        playing = false,
        inswap = null,
        timeline,
        swapui,
        frame = 0,

        PI         = Math.PI,
        TWO_PI     = PI * 2,
        HALF_PI    = PI / 2,
        Q_PI       = PI / 4,
        sin        = Math.sin,
        cos        = Math.cos,
        atan2      = Math.atan2,
        random     = function( amt ){ return Math.random() * amt; },
        centerX    = defaultOpts.width / 2,
        centerY    = defaultOpts.height / 2,
        mouseX     = 0,
        mouseY     = 0,
        lmouseX    = 0,
        lmouseY    = 0,
        mouseDeg   = 0.1,
        mouseSpeed = 0,
        mouseDragging = +new Date(),
        overDragMultiplier = 1,
        overDragMultiplierB = 0.5,
        overDragMultiplierC = 0.2
    ;
    // ^^ GLOBAL VARIABLES.


    // GENERAL PROGRAM FUNCTIONS
    //////////////////////////////////////////////////////////////////////////////

    // Set up the Raphael "paper" as the paper container
    var paper_container = self.find( '.cell' )[0],
        paper = Raphael( paper_container, defaultOpts.width, defaultOpts.height );

    // Determine if a string isJson
    function isJson( arg ) {

      if ( !arg ) {
        return false;
      }

      arg = $.isPlainObject(arg) ? JSON.stringify(arg) : arg;
      return ( new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$') ).test(arg);
    };

    // Constrain a value within bounds, used to stop chromosomes leaving the viewport
    function constrain( aNumber, aMin, aMax ){
      return Math.min( Math.max( aNumber, aMin ), aMax );
    };
    
    // Find the distance between two points 
    var dist = function dist(x1, y1, x2, y2){
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // Loads a geniverse data file and builds the scene
    function load( input, inputMap ){
      var data;

      switch( mode ){
        case 'parent':
          membranes[0] = new Membrane({ paper: paper, x: centerX, y: centerY, radius: centerY - 10, opacity:0.7, hidden:false });
          membranes[1] = new Membrane({ paper: paper, x: centerX, y: centerY, radius: centerY - 10, opacity:0.7, hidden:true });
          membranes[2] = new Membrane({ paper: paper, x: centerX, y: centerY, radius: centerY - 10, opacity:0.7, hidden:true });
          membranes[3] = new Membrane({ paper: paper, x: centerX, y: centerY, radius: centerY - 10, opacity:0.7, hidden:true });
          break;
        case 'offspring':
          membranes[0] = new Membrane({ paper: paper, x: centerX-centerX/2, y: centerY, radius: centerY/2, opacity:0.7, hidden:false });
          membranes[1] = new Membrane({ paper: paper, x: centerX+centerX/3, y: centerY, radius: centerY/2, opacity:0.7, hidden:false, isSperm: true });
          break;
      }
        
      function loadData(data){
	    var x, y, index=0, len=defaultOpts.segLength*defaultOpts.segCount*defaultOpts.alleleCount;

        for ( var i in data ) {
          if ( data.hasOwnProperty(i) ) {
            for ( var j=0; j< (defaultOpts.alleleCount/2); j++ ) {
              if ( data[i].hasOwnProperty(j) ) {
                // Create copies if in meiosis ( Mode: 'parent' )
                if( mode==='parent' ){
                  var dw = defaultOpts.width/4,
                      dh = defaultOpts.height/4;
                  x = random( dw ) + centerX -dw/2;
                  y = random( dh ) + centerY -dh/2;
                  chromosomes[index] = new Chromosome({ paper: paper, x:x, y:y, data: data[i][j], index:index, hidden: true });
                  chromosomes[index+1] = new Chromosome({ paper: paper, x:x, y:y, data: data[i][j], index:index+1, hidden: false });
                  index+=2;
                }else{
                  if( index < 3 ){
                    x = centerX - centerX/2;
                    y = defaultOpts.height/2;
                  }else{
                    x = centerX + centerX/3;
                    y = defaultOpts.height/2;
                  }
                  chromosomes[index] = new Chromosome({ paper: paper, x:x, y:y, data: data[i][j], index:index, hidden: false });
                  index+=1;
                }
              }
            }
          }

          // Perpare Chromosomes for Swappping
          if( mode === 'parent' ){
            chromosomes[ 0].swapList = [ chromosomes[ 2], chromosomes[ 3] ];
            chromosomes[ 1].swapList = [ chromosomes[ 2], chromosomes[ 3] ];
            chromosomes[ 2].swapList = [ chromosomes[ 0], chromosomes[ 1] ];
            chromosomes[ 3].swapList = [ chromosomes[ 0], chromosomes[ 1] ];          
            chromosomes[ 4].swapList = [ chromosomes[ 6], chromosomes[ 7] ];
            chromosomes[ 5].swapList = [ chromosomes[ 6], chromosomes[ 7] ];                                        
            chromosomes[ 6].swapList = [ chromosomes[ 4], chromosomes[ 5] ];
            chromosomes[ 7].swapList = [ chromosomes[ 4], chromosomes[ 5] ];          
            chromosomes[ 8].swapList = [ chromosomes[10], chromosomes[11] ];
            chromosomes[ 9].swapList = [ chromosomes[10], chromosomes[11] ];
            chromosomes[10].swapList = [ chromosomes[ 8], chromosomes[ 9] ];
            chromosomes[11].swapList = [ chromosomes[ 8], chromosomes[ 9] ];
            chromosomes[ 0].copy = chromosomes[ 1];
            chromosomes[ 1].copy = chromosomes[ 0];
            chromosomes[ 2].copy = chromosomes[ 3];
            chromosomes[ 3].copy = chromosomes[ 2];
            chromosomes[ 4].copy = chromosomes[ 5];
            chromosomes[ 5].copy = chromosomes[ 4];
            chromosomes[ 6].copy = chromosomes[ 7];
            chromosomes[ 7].copy = chromosomes[ 6];
            chromosomes[ 8].copy = chromosomes[ 9];
            chromosomes[ 9].copy = chromosomes[ 8];
            chromosomes[10].copy = chromosomes[11];
            chromosomes[11].copy = chromosomes[10];
          }
		
          // Fire the loaded callback
          defaultOpts.loaded.call(defaultOpts.context);
        }
        
      };
	//  read in json data about drake genes (input url) and map of which genes show (inputMap url) and merge these objects -Dan
	  var geneInfo;
	  var geneMapping;			
      
      if( isJson( input ) ){
        geneInfo = $.isPlainObject( input ) ? input : JSON.parse( input );
      } else {
		$.ajax({
        url: input,
        data: {},
        cache: false,
        async: false,
        dataType: 'json',
        success: function(response){
          geneInfo = response;
        	}
		});
	  }
	  
	  if( isJson( inputMap ) ){
        geneMapping = $.isPlainObject( inputMap ) ? input : JSON.parse( inputMap );
      } else {
		$.ajax({
        url: inputMap,
        data: {},
        cache: false,
        async: false,
        dataType: 'json',
        success: function(response){
          geneMapping = response;
        	}
		});
	  }
	 if (mode==='parent') {
		geneInfo = $.extend(true, geneInfo, geneMapping);
	}
	 loadData(geneInfo);
	  
    };

    // Swap Two Genes Between Two Chromosomes
    function swap( alleleA, alleleB ){
      var geneB = alleleB.gene,
          sexB = alleleB.sex,
		  onB = alleleB.on;
      alleleB.gene = alleleA.gene;
      alleleA.gene = geneB;
      alleleB.sex = alleleA.sex;
      alleleA.sex = sexB;      
      alleleB.on = alleleA.on;
      alleleA.on = onB;      
      alleleA.style.call(alleleA,alleleA.SVG_outer,'outer');
      alleleA.style.call(alleleA,alleleA.SVG_inner,'inner');
      alleleB.style.call(alleleB,alleleB.SVG_outer,'outer');
      alleleB.style.call(alleleB,alleleB.SVG_inner,'inner');
      alleleB.geneText.attr({ text:alleleB.gene });
      alleleA.geneText.attr({ text:alleleA.gene });
    };

    // Remove hover/click events when not in pairing mode
    function unbindPairEvents(){

      for(var i=0, l=chromosomes.length; i< l; i++){
        for(var j=0, l2=chromosomes[i].alleles.length; j< l2; j++){

          var allele = chromosomes[i].alleles[j];
          
          for(var n=0, l3=allele.SVG_outer.events.length; n< l3; n++){
            var event = allele.SVG_outer.events[n];
            if( event && event.f && event.f.name ){
              if( event.f.name === "gvhover" ||
                  event.f.name === "gvout"   ||
                  event.f.name === "gvclick"
              ){
                event.unbind();
              }
              
            }
          }

        }
      }
      
    };

    function swapMulti( alleles1, alleles2 ){
      for( var i in alleles1 ){
        swap( alleles1[i], alleles2[i] );
      }
    };

    function recombinationBindEvents(){

      function whichPair( i ){
        if      ( i < 4 )         { return 1; }
        else if ( i > 3 && i < 8 ){ return 2; }
        else if ( i > 7 )         { return 3; }
        else                      { return 0; }
      };

      var click = function gvclick(){
        
        if( !inRecombSelection ){
          for(var i=this.index, l=this.parent.alleles.length; i< l; i++){
            var allele = this.parent.alleles[i];
            allele.SVG_inner.attr({ 'stroke': defaultOpts.color.hover });
            allele.SVG_outer.attr({ 'stroke': defaultOpts.color.hover });
            var swap1 = allele.parent.swapList[0],
                swap2 = allele.parent.swapList[1];
            swap1.alleles[i].SVG_outer.attr({ 'stroke': defaultOpts.color.recomb_outer_hover });
            swap2.alleles[i].SVG_outer.attr({ 'stroke': defaultOpts.color.recomb_outer_hover });
            swap1.alleles[i].SVG_inner.attr({ 'stroke': defaultOpts.color.recomb_inner_hover });            
            swap2.alleles[i].SVG_inner.attr({ 'stroke': defaultOpts.color.recomb_inner_hover });
            swap1.alleles[i].recombOption = true;
            swap2.alleles[i].recombOption = true;
            allele.recombSelected = true;
            inRecombSelection = whichPair( this.parent.index );
            inRecombChromeIndex = this.parent.index;
          }
        }else{
          if( inRecombChromeIndex != this.parent.index ){
            // Collect selected alleles for swapping
            var alleles1 = [], alleles2 = [];
            for( var i in this.parent.alleles ){
              if( this.parent.alleles[i].recombOption ){
                alleles1.push( this.parent.alleles[i] );
              }
            }
            var alleles = chromosomes[inRecombChromeIndex].alleles;
            for( i=0, l=alleles.length; i< l; i++){
              if( this.parent.alleles[i].recombOption ){
                alleles2.push( alleles[i] );
              }
            }
            // Initiate multi-swap
            swapMulti(alleles1, alleles2);
          }
          // Reset colors of previously selected Alleles
          for(var i=0, l=chromosomes.length; i< l; i++){
            for(var j=0, k=chromosomes[i].alleles.length; j< k; j++){
              var allele = chromosomes[i].alleles[j];
              allele.SVG_inner.attr({ 'stroke': defaultOpts.color[allele.sex+'_inner'], opacity: 1 });
              allele.SVG_outer.attr({ 'stroke': defaultOpts.color[allele.sex+'_outer'], opacity: 1 });
              allele.recombOption = false;
              allele.recombSelected = false;
            }
            inRecombChromeIndex = null;
          }
          inRecombSelection = 0;          
        }
      };

      var hoverOver = function gvhover(){
        this.hovering = true;
        for(var i=this.index, l=this.parent.alleles.length; i< l; i++){
          var allele = this.parent.alleles[i];
          if( !allele.recombOption && !inRecombSelection ){
            allele.SVG_inner.attr({ 'stroke': defaultOpts.color.hover });
            allele.SVG_outer.attr({ 'stroke': defaultOpts.color.hover });
          }
        } 
      };
      
      var hoverOut = function gvout(){
        for(var i=0, l=this.parent.alleles.length; i< l; i++){
          var allele = this.parent.alleles[i];
          if( allele.recombSelected == true ){
          }else{
            if( !allele.recombOption ){
              allele.SVG_inner.attr({ 'stroke': defaultOpts.color[allele.sex+'_inner'] });
              allele.SVG_outer.attr({ 'stroke': defaultOpts.color[allele.sex+'_outer'] });
            }else{
              allele.SVG_outer.attr({ 'stroke': '#0F0' });
              allele.SVG_inner.attr({ 'stroke': '#0F0' });
              allele.parent.copy.alleles[allele.index].SVG_outer.attr({ 'stroke': '#0F0' });
              allele.parent.copy.alleles[allele.index].SVG_inner.attr({ 'stroke': '#0A0' });
            }
          }
        }
        this.hovering = false;        
      };

      for(var i=0, l=chromosomes.length; i< l; i++){
        for(var j=0, k=chromosomes[i].alleles.length; j< k; j++){

          var allele = chromosomes[i].alleles[j];

          (function( al ){

            allele.SVG_outer.hover( function gvhover(){
              hoverOver.call( al );
            },function gvhout(){
              hoverOut.call( al );
            });

            allele.SVG_outer.click( function gvclick(){
              click.call( al );
            });

          })( allele );

        }
      }
      
    };

    // Recurse across Chromosome, applying physics by segment
    function recurse( startSeg, direction ){

      var nextSegIndex = startSeg.index + direction,
          nextSeg = null,
          bindSeg = false;
          
      if( nextSegIndex == -1 ){
        if( startSeg.parent.index > 0 ){
          bindSeg = true;
          nextSeg = startSeg.parent.parent.alleles[ startSeg.parent.index-1 ].segs[ defaultOpts.segCount-1 ];
        }
      }else if( nextSegIndex > defaultOpts.segCount-1 ){
        if( startSeg.parent.index < startSeg.parent.parent.alleleCount-1 ){
          bindSeg = true;
          nextSeg = startSeg.parent.parent.alleles[ startSeg.parent.index+1 ].segs[ 0 ];
        }
      }else{
        nextSeg = startSeg.parent.segs[ nextSegIndex ];
      }
      
      if( nextSeg ){
        segRestorate( nextSeg, startSeg, direction );
        segAttractor( nextSeg, startSeg, bindSeg?0:defaultOpts.segLength, bindSeg?1:defaultOpts.segMoveSpeed, bindSeg );
        recurse( nextSeg, direction );
      }

    };    

    // Allele segments, repel/restore to angles defined by folding factor
    function segRestorate( seg, nextSeg, direction, nx, ny ){
      var parent = seg.parent.parent,
          distance = dist( seg.x, seg.y, nextSeg.x, nextSeg.y ),
          angle = seg.angle*parent.foldFactor+nextSeg.angle*parent.foldFactor/2+parent.rotation,
          nx = seg.x + sin(angle)*defaultOpts.segLength,
          ny = seg.y + cos(angle)*defaultOpts.segLength;
      seg.x += (nx-seg.x) / (defaultOpts.segMoveSpeed*seg.parent.parent.overDragMultiplier)/2*direction;
      seg.y += (ny-seg.y) / (defaultOpts.segMoveSpeed*seg.parent.parent.overDragMultiplier)/2*direction;
      seg.x = constrain( seg.x, 0, defaultOpts.width );
      seg.y = constrain( seg.y, 0, defaultOpts.height );
    };

    // Allele segments, magnetic-type attractor to allow realistic "pulling"
    function segAttractor( seg, nextSeg, minDist, speed, bindSeg, nx, ny ){
      if(bindSeg){
        seg.x = nextSeg.x;
        seg.y = nextSeg.y;
      }else{
        var distance = dist( seg.x, seg.y, nextSeg.x, nextSeg.y );
        if( distance > minDist ){
          var angle = Math.atan2( nextSeg.x-seg.x, nextSeg.y-seg.y ),
              rnd = random( defaultOpts.foldDamp ) - ( defaultOpts.foldDamp / 2 );
          nx = seg.x + sin(angle+rnd)*(defaultOpts.segLength*overDragMultiplierC);
          ny = seg.y + cos(angle+rnd)*(defaultOpts.segLength*overDragMultiplierC);
          seg.x += (nx-seg.x) / 1;
          seg.y += (ny-seg.y) / 1;
        }
      }
      seg.x = constrain( seg.x, 0, defaultOpts.width );
      seg.y = constrain( seg.y, 0, defaultOpts.height );      
    };

    // Clear offsets from when the use has dragged a chromosome  
    function clearOffsets(){
      for(var i in chromosomes){
        if(chromosomes.hasOwnProperty(i)){
          var i_chrome = chromosomes[i];
          i_chrome.offsetX = 0;
          i_chrome.offsetY = 0;
          i_chrome.offsetOriginX = 0;
          i_chrome.offsetOriginY = 0;
        }
      }
    };

    var frameCount = 0;

    // Main Draw Routine
    function draw(){

      frameCount++;
    
      for(var i in chromosomes){
        if(chromosomes.hasOwnProperty(i)){
          var i_chrome = chromosomes[i];          
          i_chrome.physics();          
          for(var j in i_chrome.alleles ){
            if(i_chrome.alleles.hasOwnProperty(j)){
              var j_allele = i_chrome.alleles[j];
              j_allele.updatePath();
              j_allele.swapPathAttrs();
              if( j_allele.recombOption == true ){
                j_allele.SVG_inner.attr({ opacity: 0.75+sin(frameCount/2)*0.5 });
                j_allele.SVG_outer.attr({ opacity: 0.75+sin(frameCount/4)*0.5 });
              }
            }
          }
        }
      }

      if(pairingMode){
        if(!swapui){
          var width = defaultOpts.width,
                      height = defaultOpts.height,
                      centerX = defaultOpts.width/2 - 50;

          swapui = paper.rect(centerX,5,100,105,6).insertBefore(chromosomes[0].alleles[0].SVG_inner);
          swapui.attr({fill: defaultOpts.color.swapUI_fill , stroke: defaultOpts.color.swapUI_stroke });
        }
      }
      
      if(mouseSpeed>0){
        mouseSpeed-=mouseDeg;
      }else{
        mouseSpeed = 0;
      }
      
    };
    // ^^ GENERAL PROGRAM FUNCTIONS.
    

    
    ////////////////////////////////////////////////////////////////////////////
    // CELL MEMBRANE OBJECT
    ////////////////////////////////////////////////////////////////////////////
    function Membrane( props ){
      this.type="Membrane";
      $.extend(this, props);

      this.SVG = this.genSVG();

      this.SVG.hover(
        function(){ // only change color if not selected -Dan
          if((frame===100 && mode==='parent') && (this.attr("fill") === defaultOpts.color.cell_fill)){
            this.attr({ fill:defaultOpts.color.cell_fill_hover, stroke:defaultOpts.color.cell_stroke_hover })
             document.body.style.cursor='pointer';
          }
        },function(){ // only change color if not already hover color -Dan
	          if((frame===100 && mode==='parent') && (this.attr("fill") === defaultOpts.color.cell_fill_hover)){
            this.attr({ fill:defaultOpts.color.cell_fill, stroke:defaultOpts.color.cell_stroke });
             document.body.style.cursor='auto';
          }
        }
      );

      this.SVG.click(function(x, y){
        if( mode === 'parent' ){
          clearOffsets();
          var data = {chromosomes:[]};
          if(frame===100){
            for(var i=0, l=chromosomes.length; i< l; i++){
              if( dist( chromosomes[i].alleles[0].segs[0].x, chromosomes[i].alleles[0].segs[0].y, this.attrs.cx, this.attrs.cy ) < this.attrs.r ){
                data.chromosomes[data.chromosomes.length] = {alleles:[]};
                for(var j=0, l2=chromosomes[i].alleles.length; j< l2; j++){
                  data.chromosomes[data.chromosomes.length-1].alleles[j] = {
                    sex : chromosomes[i].alleles[j].sex,
                    gene: chromosomes[i].alleles[j].gene,
					on	: chromosomes[i].alleles[j].on
                  };
                }
              }
            }
            
            //$(document).trigger('gamete-clicked', data);
            defaultOpts.gameteSelected.call(defaultOpts.context, data);
			// change all membranes to unselected color then select the currently clicked gamete
			for (var i=0; i<4; i++) {
				membranes[i].SVG.attr({ fill:defaultOpts.color.cell_fill, stroke:defaultOpts.color.cell_stroke });
			}
			this.attr({ fill:defaultOpts.color.cell_selected, stroke:defaultOpts.color.cell_stroke });
          }
        }
      });

      return this;
    };
    
    Membrane.prototype.genSVG = function(){
      if( this.hidden ){
        this.opacity = 0;
      }
      
      var shape;
      
      if( this.isSperm ){
        this.stretch = 1;        
        var edge_r = this.radius*1.125
        shape = paper.ellipse( this.x, this.y, edge_r, this.radius*0.75 );
        this.tail = paper.path(
          ' M' + (this.x+edge_r) + ',' + this.y         +
          ' L' + (this.x+edge_r+15) + ',' + (this.y+10) +
          ' L' + (this.x+edge_r+30) + ',' + (this.y-10) +
          ' L' + (this.x+edge_r+45) + ',' + (this.y+10) +
          ' L' + (this.x+edge_r+60) + ',' + (this.y-10)
        ).attr({
          'stroke-width'  : 4,
           stroke         : defaultOpts.color.cell_stroke,
           opacity        : this.opacity
        });
      }else{
        shape = paper.circle( this.x, this.y, this.radius );
      }
      
      shape.attr({
        'stroke-width'  : 4,
         fill           : defaultOpts.color.cell_fill,
         stroke         : defaultOpts.color.cell_stroke,
         opacity        : this.opacity
      });
      
      return shape;
    };
    
    Membrane.prototype.updateSVG = function( x, y, radius ){
      if( this.isSperm ){
        var edge_r = this.radius*1.125;
        this.tail.attr({
          path:
            ' M' + (this.x+edge_r*this.stretch) + ',' + this.y         +
            ' L' + (this.x+edge_r+15*this.stretch) + ',' + (this.y+10) +
            ' L' + (this.x+edge_r+30*this.stretch) + ',' + (this.y-10) +
            ' L' + (this.x+edge_r+45*this.stretch) + ',' + (this.y+10) +
            ' L' + (this.x+edge_r+60*this.stretch) + ',' + (this.y-10),
          opacity: this.opacity
        });
        this.SVG.attr({ cx:this.x, cy:this.y, rx:edge_r*this.stretch, ry:this.radius*0.75, opacity:this.opacity });
      }else{
        this.SVG.attr({ cx:this.x, cy:this.y, r:this.radius, opacity:this.opacity });
      }
    };

    
    
    ////////////////////////////////////////////////////////////////////////////
    // SEGMENT OBJECT
    ////////////////////////////////////////////////////////////////////////////
    function Segment( props ){
      this.type="Segment";
      $.extend(this, props);
      return this;
    }
    
    // retrieve next segment object in parent.segs array. If none exists,
    // attempt to move on to first seg in next allele (this.parent.next()).
    // If attempt fails, return false.
    Segment.prototype.next = function() {
      this.index = this.parent.segs.indexOf(this);
      this.nextSeg = typeof(this.parent.segs[this.index + 1]) !== 'undefined' ? this.parent.segs[this.index + 1] : false;
      if(!this.nextSeg && this.parent.next()) {
        this.nextSeg = this.parent.nextAllele.segs.length > 0 ? this.parent.nextAllele.segs[0] : false;
      }
      return this.nextSeg;
    };
    
    // Retrieve prev segment object in parent.segs array. If none exists,
    // attempt to move on to last seg in previous allele (this.parent.prev()).
    // If attempt fails, return false.
    Segment.prototype.prev = function() {
      this.index = this.parent.segs.indexOf(this);  
      this.prevSeg = typeof(this.parent.segs[this.index - 1]) !== 'undefined' ? this.parent.segs[this.index - 1] : false;
      if(!this.prevSeg && this.parent.prev()) {
        this.prevSeg = this.parent.prevAllele.segs.length > 0 ? this.parent.prevAllele.segs[this.parent.prevAllele.segs.length-1] : false;
      }
      return this.prevSeg;
    };
    // ^^ SEGMENT OBJECT.


    ////////////////////////////////////////////////////////////////////////////
    // ALLELE OBJECT
    ////////////////////////////////////////////////////////////////////////////

    function Allele( props ){
      this.type="Allele";
      $.extend(this, props);

      this.paper = this.parent.paper;
      this.segs = [];
      this.x = this.x || this.parent.x;
      this.y = this.y || this.parent.y;      

      this.segCount = defaultOpts.segCount;
      this.segLength = defaultOpts.segLength;
	  this.rightLabelOffsetX = 17;
	  this.labelOffsetY = -4.5;
	  this.labelWidth = Geniverse.chromosomeController.alleleLabelMap[this.gene].length*7;
	  this.leftLabelOffsetX = -1 * (this.labelWidth + this.rightLabelOffsetX);
	
      this.genPath();

      this.SVG_inner = this.build();
      this.style(this.SVG_inner, 'inner');
      this.SVG_outer = this.build();
      this.style(this.SVG_outer, 'outer');

      this.labelLink = this.paper.path("M"+(this.x)+","+(this.y)+" L"+(this.x+this.labelOffsetX)+","+(this.y+this.labelOfsetY)).attr( {
		'stroke'	  : '#000',
		'stroke-width': '0.5px'
	  })

// make geneFrame variable widths by looking at length of string -Dan
     this.geneFrame = this.paper.rect(this.x-6, this.y-7, this.labelWidth, 14, 1).attr({
        'fill'          : '#FFF',
        'stroke'        : defaultOpts.color[ this.sex + '_outer' ],
        "stroke-width"  : "2px"
      });
      
      this.geneText = this.paper.text(this.x, this.y, Geniverse.chromosomeController.alleleLabelMap[this.gene]).attr( {
        'font'        : '14px Helvetica, Arial',
        'stroke'      : 'none',
        'fill'        : '#000',
        'text-anchor' : 'start'
      }).toFront();
     
      if( this.parent.hidden ){
        this.hide();
      }
	
	  this.labelLink.hide();
      this.geneText.hide(); 
	  this.geneFrame.hide(); 
     
      
      this.SVG_outer.drag(this.dragmove_mouse, this.dragstart_mouse, this.dragstop_mouse);

      var raphobj = this.SVG_inner;

      this.SVG_outer.hover(function(){
        if(!this.parent.parent.hidden){
			for(var i=0; i < this.parent.parent.alleleCount; i++){
		    	if (this.parent.parent.alleles[i].on) { 
			  		this.parent.parent.alleles[i].labelLink.show(); 
					this.parent.parent.alleles[i].geneText.show(); 
					this.parent.parent.alleles[i].geneFrame.show(); 
				}
			}
            document.body.style.cursor='pointer';
        }
      },function(){
        if(!this.parent.parent.hidden){
			for(var i=0; i < this.parent.parent.alleleCount; i++){
		    	if (this.parent.parent.alleles[i].on == true) { 
			  		this.parent.parent.alleles[i].labelLink.hide(); 
					this.parent.parent.alleles[i].geneText.hide(); 
					this.parent.parent.alleles[i].geneFrame.hide(); 
				}
			}
            document.body.style.cursor='auto';
        }
      });
            
      return this;
    };
    
    Allele.prototype.hide = function(){
      this.SVG_inner.attr({stroke:"rgba(0,0,0,0)"});
      this.SVG_outer.attr({stroke:"rgba(0,0,0,0)"});
      this.geneFrame.attr({opacity:0});
      this.geneText.attr({opacity:0});
    };

    Allele.prototype.show = function(){
      this.style(this.SVG_inner, 'inner');
      this.style(this.SVG_outer, 'outer');
      this.geneFrame.attr({opacity:1});
      this.geneText.attr({opacity:1});
    };

    // Return next allele object in this.alleles, if none exists, return false
    Allele.prototype.next = function() {
      this.index = this.parent.alleles.indexOf(this);
      this.nextAllele = typeof(this.parent.alleles[this.index + 1]) !== 'undefined' ? this.parent.alleles[this.index + 1] : false;
      return this.nextAllele;
    };

    Allele.prototype.prev = function() {
      this.index = this.parent.alleles.indexOf(this);
      this.prevAllele = typeof(this.parent.alleles[this.index - 1]) !== 'undefined' ? this.parent.alleles[this.index - 1] : false;
      return this.prevAllele;
    };
    
    Allele.prototype.genPath = function(){
      var x = this.x, y = this.y, foldedAngle, unfoldedAngle, angle;
      this.segs[ 0 ] = new Segment({ x:x, y:y, index:0, angle:0, parent:this });
      this.path = "M" + x + "," + y + " ";
      for(var i=1; i < this.segCount; i++){
        foldedAngle = random(defaultOpts.foldedAngle) - (defaultOpts.foldedAngle/2);
        x += parseFloat((sin( foldedAngle + this.parent.rotation) * this.segLength));
        y += parseFloat((cos( foldedAngle + this.parent.rotation) * this.segLength));
        this.path += "L" + x + "," + y + " ";
        this.segs[ i ] = new Segment({ x:x, y:y, foldedAngle:foldedAngle, angle:foldedAngle, index:i, parent:this });
      }
    };
    
    Allele.prototype.updatePath = function(){
      var offsetX = this.parent.offsetX,
          offsetY = this.parent.offsetY,
          x = this.segs[0].x + offsetX,
          y = this.segs[0].y + offsetY;
      
	  this.labelLink.attr({ path: "M"+ x +","+ y+" L"+ ((x > this.paper.width/2) ? x+this.leftLabelOffsetX : x+this.rightLabelOffsetX) +","+ (y+this.labelOffsetY)}).toFront();
	  this.geneFrame.attr({ 'x':((x > this.paper.width/2) ? x+this.leftLabelOffsetX : x+this.rightLabelOffsetX), 'y': (y+this.labelOffsetY)}).toFront();
      this.geneText.attr({ 'x': ((x > this.paper.width/2) ? x+this.leftLabelOffsetX : x+this.rightLabelOffsetX)+2, 'y': y}).toFront();
      
      if(!this.jqObj) {
          this.jqObj = $(this.genekey);
      }

      this.path = "M" + x + "," + y + " ";
      for(var i=1; i < this.segCount; i++){
        this.path += "L" + (offsetX+this.segs[i].x) + "," + (offsetY+this.segs[i].y) + " ";
      }
    };
   
    Allele.prototype.swapPathAttrs = function(){
      this.SVG_inner.attr("path", this.path);
      this.SVG_outer.attr("path", this.path);
    };
      
    Allele.prototype.build = function(){
      var newPath = this.paper.path( this.path );
      newPath.parent = this;
      return newPath;
    };

    Allele.prototype.style = function( SVG, type ){
      SVG.attr({
        "stroke-linecap"  : "round",
        "stroke-linejoin" : "round",
        "stroke"          : defaultOpts.color[ this.sex + '_' + type ],
        "stroke-width"    : defaultOpts[ type + "Thickness" ] + "px"
      });
      return this;
    };

    Allele.prototype.dragstart_mouse = function(x,y){
      mouseDragging = +new Date();
    };

    Allele.prototype.dragmove_mouse = function(x,y){
      if(!playing){
        this.parent.parent.offsetX = (this.parent.parent.offsetOriginX||0) + x;
        this.parent.parent.offsetY = (this.parent.parent.offsetOriginY||0) + y;
      }
    };

    Allele.prototype.dragstop_mouse = function(){
      if(!playing){
        this.parent.parent.offsetOriginX = this.parent.parent.offsetX||0;
        this.parent.parent.offsetOriginY = this.parent.parent.offsetY||0;
      }
    };

    Allele.prototype.dragstart = function( override ){
      var closest, thisDist, minDist=400, seg=this.parent.segs;
    
      this.parent.parent.inDrag = true;
      this.parent.selected = null;
      
      if( override ){
        this.parent.selected = seg[ 0 ];
      }else{
        for( var i in this.parent.segs ){
          if(this.parent.segs.hasOwnProperty(i)) {
            thisDist = dist( seg[i].x, seg[i].y, mouseX, mouseY );
            if( thisDist < minDist ){
              minDist = thisDist;
              this.parent.selected = seg[ i ];
            }
          }
        }
      }
    
      this.parent.selectedJoin = null;
      if( this.parent.selected.index === i ){
        if(this.parent.index !== this.parent.parent.alleleCount-1){
          this.parent.selectedJoin = this.parent.parent.alleles[this.parent.index+1].segs[0];
        }
      }else if(this.parent.selected.index === 0){
        if( this.parent.index > 0 ){
          this.parent.selectedJoin = this.parent.parent.alleles[this.parent.index-1].segs[defaultOpts.segCount-1];
        }
      }
    };    

    
    Allele.prototype.dragmove = function(x, y){
     
      function doDrag(){
         
        this.parent.selected.x = mouseX;
        this.parent.selected.y = mouseY;
        
        var distanceToSelection = 0;
        var curSeg = this.parent.selected;
        
        while( curSeg.next() ){
          distanceToSelection++;
          curSeg = curSeg.nextSeg;
          curSeg.x += (mouseX-curSeg.x)*(overDragMultiplierB/distanceToSelection);
          curSeg.y += (mouseY-curSeg.y)*(overDragMultiplierB/distanceToSelection);
        }
        
        // reset vars for prev()
        distanceToSelection = 0;
        curSeg = this.parent.selected;
        
        while( curSeg.prev() ){
          distanceToSelection++;
          curSeg = curSeg.prevSeg;
          curSeg.x += (mouseX-curSeg.x)*(overDragMultiplierB/distanceToSelection);
          curSeg.y += (mouseY-curSeg.y)*(overDragMultiplierB/distanceToSelection);
        }

        this.parent.updatePath();
        this.parent.swapPathAttrs();
        
        if(this.parent.selectedJoin){
          this.parent.selectedJoin.x = mouseX;
          this.parent.selectedJoin.y = mouseY;
          this.parent.selectedJoin.parent.updatePath();
          this.parent.selectedJoin.parent.swapPathAttrs();
        }

      };

      
      // Override mouse position when dragged by Burst timeline
      if( arguments[5] ){
        mouseX = arguments[6], mouseY = arguments[7];
        doDrag.apply(this,arguments);
      }else{
        if( !pairingMode ){
          doDrag.apply(this,arguments);
        }
      }
      
      var link =this;
      clearTimeout( link.parent.parent.lastDragTimeout );
        link.parent.parent.lastDragTimeout = setTimeout(function(){
          link.parent.dragstop.call(link);
        },500);
      
    };
    
    Allele.prototype.dragstop = function(){
      this.parent.selected = null;
      this.parent.selectedJoin = null;
      this.parent.parent.overDragMultiplier = 1;
      var chromosomeLink = this.parent.parent,
          timeOut = window.setTimeout(function(){
        chromosomeLink.inDrag = false;
      }, defaultOpts.dragTimeout);
      
    };
    // ^^ ALLELE OBJECT.



    ////////////////////////////////////////////////////////////////////////////
    // CHROMOSOME OBJECT
    ////////////////////////////////////////////////////////////////////////////

    function Chromosome( props ){
    
      // Set the type for easy debugging
      this.type = "Chromosome";

      // Extend the object with the properties passed
      $.extend(this, props);

      this.rotation = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.dragX = this.x;
      this.dragY = this.y;
      this.originX = this.x;
      this.originY = this.y;
      
      this.foldFactor = 1;

      this.inDrag = false;
      this.overDragMultiplier = 1;
      
      // Get default number of Alleles per Chromosome from defaults
      this.alleleCount = this.data.alleles.length;

      // Array to hold Allele Objects
      this.alleles = [];

      // Set XY cursor coords
      var x=this.x, y=this.y;
      
      // Loop through alleles array
      for(var i=0; i < this.alleleCount; i++){
        // Creatye and store a new Allele 
        this.alleles[i] = new Allele({
          paper   : this.paper,
          x       : x,
          y       : y,
          sex     : this.data.alleles[i].sex,
          gene    : this.data.alleles[i].gene,
		  on      : this.data.alleles[i].on,  // add the mapping of gene visibility - Dan
          parent  : this,
          index   : i
        });
        
        // Get the last XY position of the last segment of the new Allele Object
        var lastSeg = this.alleles[ i ].segs[ this.alleles[ i ].segCount - 1 ];
        
        // Modulate XY cursor position, so the next Allele's XY coords will begin
        // ...at the end segment of the previous Allele, creating a chain.
        x = lastSeg.x;
        y = lastSeg.y;
      
      }
      
      this.lastSelected = this.alleles[window.parseInt(random(this.alleles.length), 10)].segs[window.parseInt(random(this.alleles[0].segs.length), 10)];
    };

    Chromosome.prototype.hide = function(){
      for(var i=0; i < this.alleleCount; i++){
        this.alleles[i].hide();
      }
      this.hidden = true;
    };

    Chromosome.prototype.show = function(){
      for(var i=0; i < this.alleleCount; i++){
        this.alleles[i].show();
      }
      this.hidden = false;
    };

    Chromosome.prototype.physics = function(){

      // Check if Burst is dragging/animating this Chromosome

      // GENERAL JOSTLING
      var allele, seg, rndAngle, foldAmt, i=0, l;
      for(i=0, l=this.alleleCount; i<l; i++){
        allele = this.alleles[i];
        for(var j=0, l2=defaultOpts.segCount; j<l2; j++){
          seg = allele.segs[j];
          if( seg.angle ){
            if( random(1) > defaultOpts.alleleAngleChangeProbability ){
              seg.foldedAngle = random( defaultOpts.foldedAngle ) - ( defaultOpts.foldedAngle / 2 );
              seg.angle = seg.foldedAngle * this.foldFactor;
            }
          }
        }
      }

      // DRAG RECUSIVE PHYSICS
      var selected = null,
          selectedJoin = null;
      for(i=0, l=this.alleles.length; i<l; i++){
        allele = this.alleles[i];
        if(allele.selected){
          selected = allele.selected;
          this.lastSelected = selected;
        }
        if(allele.selectedJoin){
          selectedJoin = allele.selectedJoin;
        }
      }

      recurse( this.lastSelected,  1 );
      recurse( this.lastSelected, -1 );
    
    };
    // ^^ CHROMOSOME OBJECT.

    

    // SETUP, INSTANTIATION & INITIALIZATION
    ////////////////////////////////////////////////////////////////////////////


    // Store mouse position when moved
    paper_container.addEventListener('mousemove', function(e){
      lmouseX = mouseX;
      lmouseY = mouseY;
      var scrollX = (window.scrollX !== null && typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset;
      var scrollY = (window.scrollY !== null && typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset;
      mouseX = e.clientX - paper_container.offsetLeft + scrollX;
      mouseY = e.clientY - paper_container.offsetTop + scrollY;
      mouseSpeed = dist(lmouseX, lmouseY, mouseX, mouseY);
      if( pairingMode ){
        if(mouseY < 110){
          swapPair = "a";
        }else if(mouseY > 110 && mouseY < 215){
          swapPair = "b";
        }else if(mouseY > 215){
          swapPair = "c";
        }
        pairingUI( swapPair );
      }
    }, false);
        
    //////////////////////
    function pairingUI( swapPair ){
      // Center swap ui respective to plugin width
      var width = defaultOpts.width,
          height = defaultOpts.height,
          centerX = defaultOpts.width/2 - 50;
      switch( swapPair ){
        case "a":
          swapui.attr({x:centerX,y:5,width:100,height:105});
          break;
        case "b":
          swapui.attr({x:centerX,y:110,width:100,height:105});
          break;
        case "c":
          swapui.attr({x:centerX,y:215,width:100,height:105});
          break;
      };
    };

    // Initiate the load function that generates the scene
    load( json_file, geneMap );    

    // Full JSON generation function
    self.data("get-json", function(){

      // Generate JSON
      var struct = { chromosomes: [] };
      $.each(chromosomes, function() {
        var chromosome = struct.chromosomes[ struct.chromosomes.push({ alleles: [] }) - 1];
        
        $.each(this.alleles, function() {
          var allele = chromosome.alleles[ chromosome.alleles.push({}) - 1 ];
          allele.sex = this.sex;
          allele.gene = this.gene;
		  allele.on = this.on;
        });
        
      });
      
      return struct;
      
    });



    ////////////////////////////////////////////////////////////////////////////
    // B U R S T - T I M E L I N E - G E N E R A T I O N
    ////////////////////////////////////////////////////////////////////////////

    function generateTimeline( mode ){    
    
      switch( mode ){
        
        case 'offspring':

          /*
           F E R T I L I Z A T I O N  - Mode: "offspring"
          :--------:-----------------------------------------------------------:
          : Frame  : Event/animation                                           :
          :--------:-----------------------------------------------------------:
          : 0-9    : Random movement                                           :
          : 11     : Split from 6 to 12 chromosomes                            :
          : 10-30  : Random to Pairing, chromosomes align                      :
          : 33     : Pairing screen                                            :
          :--------:-----------------------------------------------------------:
          */          
          
          var dragByAllele = function(e){
            var allele = this.alleles[defaultOpts.grabAllele];
            allele.dragstart.call(allele.SVG_outer, true);
            allele.dragmove.call(allele.SVG_outer,null,null,null,null,null,true,this.dragX,this.dragY);
          };
          
          timeline = burst.timeline( 'geniverseTimeline_' + owner, 1, 35, 0.25, false )

            ////////////////////////////////////////////////////////////////////
            // MEMBRANES

            .obj('memb1_'+owner,membranes[0])
              .track('radius')
                .key(0,membranes[0].radius,'inOutQuad')
                .key(23,centerX/1.5)
              .track('x')
                .key(0,membranes[0].x,'inOutQuad')
                .key(23,centerX)
                .always(function(e){
                  frame = ~~e.frame;
                  scrub.slider('value',e.frame*100);
                  frameInput.val(~~e.frame);
                  this.updateSVG();
                  if(frame >= 35 && mode === 'offspring'){
                    burst.stop();
                    defaultOpts.animationComplete.call(defaultOpts.context);
                  }
                })

            .obj('memb2_'+owner,membranes[1])
              .track('radius')
                .key(0,membranes[1].radius,'inOutQuad')
                .key(23,membranes[1].radius*1.5)
              .track('opacity')
                .key(0,membranes[1].opacity,'inOutQuad')
                .key(23,0)
              .track('x')
                .key(0,membranes[1].x,'inOutQuad')
                .key(23,centerX-centerX/6)
                .always(function(e){
                  this.updateSVG();
                })


            ////////////////////////////////////////////////////////////////////
            // Move Chromosomes
            
            .obj('m1_'+owner,chromosomes[0])
              .track('dragX')
                .key(0,centerX-centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
            .obj('m2_'+owner,chromosomes[1])
              .track('dragX')
                .key(0,centerX-centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
            .obj('m3_'+owner,chromosomes[2])
              .track('dragX')
                .key(0,centerX-centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
            .obj('f1_'+owner,chromosomes[3])
              .track('dragX')
                .key(0,centerX+centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
            .obj('f2_'+owner,chromosomes[4])
              .track('dragX')
                .key(0,centerX+centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
            .obj('f3_'+owner,chromosomes[5])
              .track('dragX')
                .key(0,centerX+centerX/2,'inOutQuad').key(23,centerX)
                .always(function(e){dragByAllele.call(this,e)})
          ;


          break;
        
        case 'parent':

          /*
           M E I O S I S - Mode: "parent"
          :--------:-----------------------------------------------------------:
          : Frame  : Event/animation                                           :
          :--------:-----------------------------------------------------------:
          : 0-9    : Random movement                                           :
          : 11     : Split from 6 to 12 chromosomes                            :
          : 10-30  : Random to Pairing, chromosomes align                      :
          : 30     : Pairing screen                                            :
          : 31-40  : Chromosomes drag outwards                                 :
          : 41-50  : Cell membrane devides, 1-2                                :
          : 51-70  : Chromoesomes rotate                                       :
          : 71-80  : Chomosomes devide and drag-separate                       :
          : 80-90  : Cell membranes devide, 2-4                                :
          : 90-100 : Chromosomes filding factor goes back to normal            :
          :--------:-----------------------------------------------------------:
          */    
      	
		  pairOffset = 10;
          timeline = burst.timeline( 'geniverseTimeline_' + owner, 1, 101, 0.5, false )

            ////////////////////////////////////////////////////////////////////
            // MEMBRANES

            .obj('memb1_'+owner,membranes[0])
              .track('x')
                .key(0,centerX)
                .key(30,centerX)
                .key(31,centerX)
                .key(50,centerX/2)
                .key(100,centerX/2)
              .track('y')
                .key(0,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .key(100,centerY-centerY/2)
              .track('radius')
                .key(0,centerY-10)
                .key(30,centerY-10)
                .key(31,centerY-10)
                .key(40,centerY/1.5)
                .key(60,centerY/1.5)
                .key(80,centerY/2.5)
                .key(100,centerY/2.5)
                .always(function(e){
                  this.updateSVG.call(this);
                })

            .obj('memb2_'+owner,membranes[1])
              .track('x')
                .key(0,centerX)
                .key(30,centerX)
                .key(31,centerX)
                .key(50,centerX+centerX/2)
                .key(100,centerX+centerX/2)
              .track('y')
                .key(0,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .key(100,centerY-centerY/2)
              .track('opacity')
                .key(21,0)
                .key(31,0.5)
                .key(50,0.7)
                .key(100,0.7)
              .track('radius')
                .key(0,centerY-10)
                .key(30,centerY-10)
                .key(31,centerY-10)
                .key(50,centerY/1.5)
                .key(60,centerY/1.5)
                .key(80,centerY/2.5)
                .key(100,centerY/2.5)
                .always(function(e){
                  this.updateSVG.call(this);
                })

            .obj('memb3_'+owner,membranes[2])
              .track('x')
                .key(0,centerX+centerX/2)
              .track('y')
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .key(100,centerY+centerY/2)
              .track('opacity')
                .key(50,0)
                .key(80,0.7)
                .key(100,0.7)
              .track('radius')
                .key(60,centerY/1.5)
                .key(80,centerY/2.5)
                .key(100,centerY/2.5)
                .always(function(e){
                  this.updateSVG.call(this);
                })

            .obj('memb4_'+owner,membranes[3])
              .track('x')
                .key(0,centerX-centerX/2)
              .track('y')
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .key(100,centerY+centerY/2)
              .track('opacity')
                .key(50,0)
                .key(80,0.7)
                .key(100,0.7)
              .track('radius')
                .key(60,centerY/1.5)
                .key(80,centerY/2.5)
                .key(100,centerY/2.5)
                .always(function(e){
                  this.updateSVG.call(this);
                })

            ////////////////////////////////////////////////////////////////////
            // A-PAIR
            
            // naming convention: "c" + PairLetter(a-c) + ChromosomeNumber(1-2) + OriginCopyLetter(a-b);

            // Chromosome A1a - chromosomes[1]
            .obj('ca1a_'+owner,chromosomes[1])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
//                .key(70,HALF_PI)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[0].originX)
                .key(30,centerX-defaultOpts.outerThickness)
                .key(31,centerX-defaultOpts.outerThickness)
                .key(50,centerX-centerX/2-30)
                .key(70,centerX-centerX/2-30)
                .key(80,centerX-centerX/2)
              .track('dragY')
                .key(0,chromosomes[0].originY)
                .key(30,centerY-130)
                .key(31,centerY-130)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .always(function(e){
                  
                  // Set the global frame property so geniverse.js knows when
                  // you are in either pairing or final selection mode.
                  frame = ~~e.frame;

                  if(e.frame > 100){
                   // burst.timelines['geniverseTimeline_'+owner].play(100);
                    burst.stop();
                  }
                  
                  if(e.frame==30 && defaultOpts.swap == "user"){
// need to look at this to prevent pause - Dan
					pairingMode = true;
                    if(swapui){swapui.attr({opacity:1});}
                    burst.stop();
                    recombinationBindEvents();              
                    draw();
                    burst.stop();
                  }else if(e.frame==30 && defaultOpts.swap == "auto"){
                    for(var i=0, l=chromosomes.length; i< l; i++){
                      for(var j=0, k=chromosomes[i].alleles.length; j< k; j++){
                        if(Math.random()>0.654321){
                          swap( 
                            chromosomes[i].alleles[j],
                            chromosomes[i].swapList[~~Math.random()].alleles[j]
                          );
                        }
                      }
                    }
                  }else{
                    if(pairingMode = true){
                      pairingMode = false;
                      if(swapui){swapui.attr({opacity:0});}
                      unbindPairEvents();
                    }
                  }

                  if(frame >= 100 && mode === 'parent'){
                    burst.stop();
                    defaultOpts.animationComplete.call(defaultOpts.context);
                  }

                  scrub.slider('value',e.frame*100);
                  frameInput.val(~~e.frame);
                  
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);                  
                  
                })

            // Chromosome A1b - chromosomes[0]
            .obj('ca1b_'+owner,chromosomes[0])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(40,0)
                .key(50,0)
              .track('dragX')
                .key(0,chromosomes[1].originX + pairOffset)
                .key(30,centerX-defaultOpts.outerThickness + pairOffset)
                .key(31,centerX-defaultOpts.outerThickness + pairOffset)
                .key(50,centerX-centerX/2-30 + pairOffset)
                .key(70,centerX-centerX/2-30 + pairOffset)
                .key(80,centerX-centerX/2 + pairOffset)
              .track('dragY')
                .key(0,chromosomes[1].originY)
                .key(30,centerY-130)
                .key(31,centerY-130)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome A2a - chromosomes[3]
            .obj('ca2a_'+owner,chromosomes[3])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(40,0)
                .key(50,0)
              .track('dragX')
                .key(0,chromosomes[2].x)
                .key(30,centerX+defaultOpts.outerThickness)
                .key(31,centerX+defaultOpts.outerThickness)
                .key(50,centerX+centerX/2+30)
                .key(70,centerX+centerX/2+30)
                .key(80,centerX+centerX/2)
              .track('dragY')
                .key(0,chromosomes[2].y)
                .key(30,centerY-130)
                .key(31,centerY-130)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome A2b  - chromosomes[2]
            .obj('ca2b_'+owner,chromosomes[2])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(40,0)
                .key(50,0)
              .track('dragX')
                .key(0,chromosomes[3].originX + pairOffset)
                .key(30,centerX+defaultOpts.outerThickness + pairOffset)
                .key(31,centerX+defaultOpts.outerThickness + pairOffset)
                .key(50,centerX+centerX/2+30 + pairOffset)
                .key(70,centerX+centerX/2+30 + pairOffset)
                .key(80,centerX+centerX/2 + pairOffset)
              .track('dragY')
                .key(0,chromosomes[3].originY)
                .key(30,centerY-130)
                .key(31,centerY-130)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            ////////////////////////////////////////////////////////////////////
            // B-PAIR

            // Chromosome B1a - chromosomes[5]
            .obj('cb1a_'+owner,chromosomes[5])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[4].originX)
                .key(30,centerX-defaultOpts.outerThickness)
                .key(31,centerX-defaultOpts.outerThickness)
                .key(50,centerX-centerX/2-30)
                .key(70,centerX-centerX/2-30)
                .key(80,centerX-centerX/2)
              .track('dragY')
                .key(0,chromosomes[4].originY)
                .key(30,centerY-25)
                .key(31,centerY-25)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })

            // Chromosome B1b - chromosomes[4]
            .obj('cb1b_'+owner,chromosomes[4])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[5].originX + pairOffset)
                .key(30,centerX-defaultOpts.outerThickness + pairOffset)
                .key(31,centerX-defaultOpts.outerThickness + pairOffset)
                .key(50,centerX-centerX/2-30 + pairOffset)
                .key(70,centerX-centerX/2-30 + pairOffset)
                .key(80,centerX-centerX/2 + pairOffset)
              .track('dragY')
                .key(0,chromosomes[5].originY)
                .key(30,centerY-25)
                .key(31,centerY-25)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome B2a - chromosomes[7]
            .obj('cb2a_'+owner,chromosomes[7])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[6].originX)
                .key(30,centerX+defaultOpts.outerThickness)
                .key(31,centerX+defaultOpts.outerThickness)
                .key(50,centerX+centerX/2+30)
                .key(70,centerX+centerX/2+30)
                .key(80,centerX+centerX/2)
              .track('dragY')
                .key(0,chromosomes[6].originY)
                .key(30,centerY-25)
                .key(31,centerY-25)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome - chromosomes[6]
            .obj('cb2b_'+owner,chromosomes[6])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[7].originX + pairOffset)
                .key(30,centerX+defaultOpts.outerThickness + pairOffset)
                .key(31,centerX+defaultOpts.outerThickness + pairOffset)
                .key(50,centerX+centerX/2+30 + pairOffset)
                .key(70,centerX+centerX/2+30 + pairOffset)
                .key(80,centerX+centerX/2 + pairOffset)         
              .track('dragY')
                .key(0,chromosomes[7].originY)
                .key(30,centerY-25)
                .key(31,centerY-25)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            ////////////////////////////////////////////////////////////////////
            // C-PAIR

            // Chromosome C1a - chromosomes[9]
            .obj('cc1a_'+owner,chromosomes[9])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
               .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(60,0)
              .track('dragX')
                .key(0,chromosomes[8].originX)
                .key(30,centerX-defaultOpts.outerThickness)
                .key(31,centerX-defaultOpts.outerThickness)
                .key(50,centerX-centerX/2-30)
                .key(70,centerX-centerX/2-30)
                .key(80,centerX-centerX/2)
              .track('dragY')
                .key(0,chromosomes[8].originY)
                .key(30,centerY+80)
                .key(31,centerY+80)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })

            // Chromosome C1b - chromosomes[8]
            .obj('cc1b_'+owner,chromosomes[8])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[9].originX + pairOffset)
                .key(30,centerX-defaultOpts.outerThickness + pairOffset)
                .key(31,centerX-defaultOpts.outerThickness + pairOffset)
                .key(50,centerX-centerX/2-30 + pairOffset)
                .key(70,centerX-centerX/2-30 + pairOffset)
                .key(80,centerX-centerX/2 + pairOffset)
              .track('dragY')
                .key(0,chromosomes[9].originY)
                .key(30,centerY+80)
                .key(31,centerY+80)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)            
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome C2a - chromosomes[11]
            .obj('cc2a_'+owner,chromosomes[11])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[10].originX)
                .key(30,centerX+defaultOpts.outerThickness)
                .key(31,centerX+defaultOpts.outerThickness)
                .key(50,centerX+centerX/2+30)
                .key(70,centerX+centerX/2+30)
                .key(80,centerX+centerX/2)
              .track('dragY')
                .key(0,chromosomes[10].originY)
                .key(30,centerY+80)
                .key(31,centerY+80)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY+centerY/2)
                .always(function(e){
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })


            // Chromosome C2b - chromosomes[10]
            .obj('cc2b_'+owner,chromosomes[10])
              .track('foldFactor')
                .key(0,PI)
                .key(30,defaultOpts.unfoldedAngle)
                .key(90,defaultOpts.unfoldedAngle)
              .track('rotation')
                .key(0,0)
                .key(41,0)
                .key(70,0)
              .track('dragX')
                .key(0,chromosomes[11].originX + pairOffset)
                .key(30,centerX+defaultOpts.outerThickness + pairOffset)
                .key(31,centerX+defaultOpts.outerThickness + pairOffset)
                .key(50,centerX+centerX/2+30 + pairOffset)
                .key(70,centerX+centerX/2+30 + pairOffset)
                .key(80,centerX+centerX/2 + pairOffset)
              .track('dragY')
                .key(0,chromosomes[11].originY)
                .key(30,centerY+80)
                .key(31,centerY+80)
                .key(50,centerY)
                .key(60,centerY)
                .key(80,centerY-centerY/2)
                .always(function(e){
                  if(this.hidden){
                    if(e.frame>11){
                      this.show();
                    }else{
                      this.hide();
                    }
                  }else{
                    if(e.frame<11){
                      this.hide();
                    }else{
                      this.show();
                    }
                  }
                  var allele = this.alleles[defaultOpts.grabAllele];
                  allele.dragstart.call(allele.SVG_outer, true);
                  allele.dragmove.call(allele.SVG_outer,null,null,null,null,null, true,this.dragX,this.dragY);
                })

          ; // ^^ Meiosis Timeline (Burst-Core)
      
          break;
        }
            
    };
    // ^^ Burst Timeline Generation
    
    // Generate the timeline based on the mode (parent/offspring)
    generateTimeline( mode );      
    
    
    // Bind DOM UI to Burst
    ////////////////////////////////////////////////////////////////////////////

    self.find('.play').click(function(){
      clearOffsets();
      burst.loaded = {};
      burst.load('geniverseTimeline_'+owner);
      burst.play();
    });
    self.find('.stop').click(function(){
      burst.stop();
    });
    
    var frameInput = self.find('.frame input').change(function(e){
      frame = parseInt(this.value);
      burst.frame(frame);
      scrub.slider('value',frame*100);
      if(frame === 30){
        burst.timelines['geniverseTimeline_'+owner].play(29);
        burst.timelines['geniverseTimeline_'+owner].play(30);
      }
      if(frame >= 100 && mode === 'parent'){
        defaultOpts.animationComplete.call(defaultOpts.context);
      }
      if(frame >= 35 && mode === 'offspring'){
        defaultOpts.animationComplete.call(defaultOpts.context);
      }
      playing = false;
      return this;
    });
      
    // Jump straight to swap mode when clicking the "Swap" buttons...
    if( mode === 'parent' ){
      var swapButton = self.find('.swap').click(function(){
        burst.timelines['geniverseTimeline_'+owner].play(29);
        burst.timelines['geniverseTimeline_'+owner].play(30);
        frame = 30;
        scrub.slider('value',3000);
        frameInput.val(30);
        clearOffsets();
        burst.stop();
        playing = false;
        return this;
      });      
    }

    // Update the animation when the slider is sliden
    var scrub = self.find('.scrub');

    scrub.slider({
      min: 1,
      max: burst.timelines['geniverseTimeline_'+owner].end*100,
      value: 0,
      slide: function(event, ui){
        
        burst.loaded = {};
        burst.load('geniverseTimeline_'+owner);
        frame=~~(ui.value/100);
        burst.timelines['geniverseTimeline_'+owner].play(frame);
        frameInput.val(frame);
        if(frame == burst.timelines['geniverseTimeline_'+owner].end){
          defaultOpts.animationComplete.call(defaultOpts.context);
        }
        playing = false;
        clearOffsets();
        burst.stop();
      },
      stop: function(event, ui){
        playing = false;
        burst.stop();
        frame=parseInt(ui.value/100);
        if(frame>100){frame=100};
        clearOffsets();
        burst.frame(frame);
      }
    });

    // Set Draw-Loop Interval
    ////////////////////////////////////////////////////////////////////////////
    drawLoop = window.setInterval(function(){ draw(); }, 50);

  };
  
})(this, this.document, this.jQuery, this.Raphael, Burst); 
