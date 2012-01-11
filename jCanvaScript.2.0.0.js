/*!
* jCanvaScript JavaScript Library v 2.0.0
* http://jcscript.com/
*
* Copyright 2011, Alexander Savin
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function (window, undefined)
{
	var canvases = [],
	underMouse = false,
	regHasLetters = /[A-z]+?/,
	FireFox = window.navigator.userAgent.match(/Firefox\/\w+\.\w+/i),
	fps=1000/60,
	requestAnimFrame = (function(){return window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback, element){
				return setTimeout(callback, fps);
              }})(),
	cancelRequestAnimFrame = (function(){return window.cancelAnimationFrame   ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     ||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout})();
	if (FireFox!="" && FireFox!==null)
        var FireFox_lt_7=(parseInt(FireFox[0].split(/[ \/\.]/i)[1])<7);
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }
    
	function findById(i, j, stroke)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		stroke=stroke.slice(1);
		for(var k=0;k<objsLength;k++)
			if(objs[k].optns.id==stroke)return objs[k];
		for(k=0;k<grdntsnptrnsLength;k++)
			if(grdntsnptrns[k].optns.id==stroke)return grdntsnptrns[k];
		return false;
	}
	function findByName(i, j, myGroup, stroke)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		stroke=stroke.slice(1);
		for(var k=0;k<objsLength;k++)
			if(objs[k]._name==stroke)myGroup.elements.push(objs[k]);
		for(k=0;k<grdntsnptrnsLength;k++)
			if(grdntsnptrns[k]._name==stroke)myGroup.elements.push(grdntsnptrns[k]);
		return myGroup;
	}
	function findByCanvasAndLayer (i, j, myGroup)
	{
		var objs=canvases[i].layers[j].objs,
		grdntsnptrns=canvases[i].layers[j].grdntsnptrns,
		objsLength=objs.length,
		grdntsnptrnsLength=grdntsnptrns.length;
		for(var k=0;k<objsLength;k++)
			myGroup.elements.push(objs[k]);
		for(k=0;k<grdntsnptrnsLength;k++)
			myGroup.elements.push(grdntsnptrns[k]);
		return myGroup;
	}
    /*
    *@function
    *@namespace
    * */
	var jCanvaScript = function (stroke, map) {
        if (stroke === undefined)return this;
        if (typeof stroke == 'object') {
            map = stroke;
            stroke = undefined;
        }
        var canvasNumber = -1,layerNumber = -1,limitC = canvases.length,myGroup = jCanvaScript.group(),i,j,canvas,layer,layers,element,limitL;
        if (map === undefined) {
            if (stroke.charAt(0) == '#') {
                for (i = 0; i < limitC; i++) {
                    limitL = canvases[i].layers.length;
                    for (j = 0; j < limitL; j++) {
                        element = findById(i, j, stroke);
                        if (element)return element;
                    }
                }
            }
            if (stroke.charAt(0) == '.') {
                for (i = 0; i < limitC; i++) {
                    limitL = canvases[i].layers.length;
                    for (j = 0; j < limitL; j++)
                        myGroup = findByName(i, j, myGroup, stroke);
                }
            }
        }
        else {
            if (map.canvas !== undefined) {
                for (i = 0; i < limitC; i++)
                    if (canvases[i].optns.id == map.canvas) {
                        canvasNumber = i;
                        canvas = canvases[i];
                        break;
                    }
            }
            if (map.layer !== undefined) {
                if (canvasNumber != -1) {
                    limitL = canvas.layers.length;
                    for (i = 0; i < limitL; i++)
                        if (canvas.layers[i].optns.id == map.layer) {
                            layerNumber = i;
                            layer = canvas.layers[i];
                            break;
                        }
                }
                else {
                    for (i = 0; i < limitC; i++) {
                        layers = canvases[i].layers;
                        limitL = layers.length;
                        for (j = 0; j < limitL; j++) {
                            if (layers[j].optns.id == map.layer) {
                                canvasNumber = i;
                                layerNumber = j;
                                canvas = canvases[i];
                                layer = canvas.layers[j];
                                break;
                            }
                        }
                        if (layer > -1)break;
                    }
                }
            }
            if (layerNumber < 0 && canvasNumber < 0)return jCanvaScript.group();
            if (layerNumber < 0) {
                layers = canvas.layers;
                limitL = layers.length;
                if (stroke === undefined) {
                    for (j = 0; j < limitL; j++)
                        myGroup = findByCanvasAndLayer(canvasNumber, j, myGroup);
                }
                else if (stroke.charAt(0) == '#') {
                    for (j = 0; j < limitL; j++) {
                        element = findById(canvasNumber, j, stroke);
                        if (element)return element;
                    }
                }
                else if (stroke.charAt(0) == '.') {
                    for (j = 0; j < limitL; j++)
                        myGroup = findByName(canvasNumber, j, myGroup, stroke);
                }
            }
            else {
                if (stroke === undefined) {
                    myGroup = findByCanvasAndLayer(canvasNumber, layerNumber, myGroup);
                }
                if (stroke.charAt(0) == '#') {
                    return findById(canvasNumber, layerNumber, stroke);
                }
                if (stroke.charAt(0) == '.') {
                    myGroup = findByName(canvasNumber, layerNumber, myGroup, stroke)
                }
            }
        }
        if (map !== undefined)
            if (map.attrs !== undefined || map.fns !== undefined)
                return myGroup.find(map);
        if (myGroup.elements.length)return myGroup;
        return jCanvaScript.group();
    };
    /*@namespace*/
    jCanvaScript.Proto={};
	<include src="privateFunctions"/>
	<include src="serviceObjects"/>
window.jCanvaScript=window.jc=jCanvaScript;})(window, undefined);

<include src="publicFunctions"/>
<include src="shapes"/>
<include src="rasters"/>
<include src="lines"/>
<include src="gradientsAndPatterns"/>