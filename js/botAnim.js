
var OTHER = 0;
var CHROME = 1;
var FIREFOX = 2;
var MSIE = 3;
var OPERA = 4;

var botAnim = {
	bot: null
	,pos: [-150,0]
	,rot: 0
	,repeatCount: 0 // Nr times run.
	,maxRepeats: 6 // Max nr times to move. Multiple of Queue length.
	,browser: OTHER
	,queueData: []
	,init: function() {
		this.bot = document.querySelector("#bot");
		if(navigator.userAgent.match("Chrome")){
			this.browser = CHROME;
		} else if(navigator.userAgent.match("Firefox")){
			this.browser = FIREFOX;
		} else if(navigator.userAgent.match("MSIE")){
			this.browser = MSIE;
		} else if(navigator.userAgent.match("Opera")){
			this.browser = OPERA;
		}
		this.pushToQueue(1400, 100);
		this.pushToQueue( 500, 600);
		this.pushToQueue(-200,  20);
		this.pushToQueue( 300, 300);
		this.pushToQueue( 500,  10);
		this.pushToQueue(-150,   0);
		//this.drive(200, 400);
		return this;
	}
	,start: function() {
		console.log("this.repeatCount" + this.repeatCount);
		this.repeatCount = 0;
		this.drive(0, 0);
	}
	,pushToQueue: function(iX, iY) {
		this.queueData.push([iX,iY]);
	}
	,popFromQueue: function(iX, iY) {
		if (this.queueData.length == 0) {
			return null;
		}
		var aiOut = [this.queueData[0][0], this.queueData[0][1]];
		this.queueData.shift();
		this.queueData.push(aiOut);
		return aiOut;
	}
	,drive: function(iX, iY) {
		var iNewRot = computeRotation(iX, iY, this.pos[0], this.pos[1]);
		iNewRot = this.getMinimumRotation(this.rot, iNewRot);
		this.rot = iNewRot;
		this.pos = [iX,iY];
		this.bot.style.left = (iX + "px");
		this.bot.style.top =  (iY + "px");

		var sSetting = "rotate(" + this.rot + "deg)";
		if(this.browser == CHROME){
			this.bot.style.WebkitTransform = sSetting;
		} else if(this.browser == FIREFOX){
			this.bot.style.MozTransform = sSetting;
		} else if(this.browser == MSIE){
			this.bot.style.msTransform = sSetting;
		} else if(this.browser == OPERA){
			this.bot.style.OTransform = sSetting;
		} else {
			this.bot.style.transform = sSetting;
		}
		if (this.repeatCount >= this.maxRepeats) {
			return;
		}
		this.repeatCount++;
		this.getNextLegReady();
	}
	,getMinimumRotation: function(iRotCurr, iRotNew) {
		// Avoid obtuse turns,
		//		eg not from -270 to  +45
		//		but    from -270 to -315
		//c onsole.error("---------------- " + iRotCurr + " " + iRotNew + " diff ::: " + (iRotCurr - iRotNew));
		if (
			((iRotCurr >= 0) == (iRotNew >= 0))
			||
			((iRotCurr <  0) == (iRotNew <  0))
		) {
			// Same sign, both pos or both neg.
			if (iRotCurr - iRotNew < -180) {
				//c onsole.error("---------------- " + iRotCurr + " " + iRotNew + " diff ::: " + (iRotCurr - iRotNew));
				//c onsole.log(" try " + (iRotNew + 360));
				return -360 + iRotNew;
			}
			/*
			if (iRotCurr - iRotNew > 180) {
				c onsole.error("---------------- " + iRotCurr + " " + iRotNew + " diff ::: " + (iRotCurr - iRotNew));
				c onsole.log(" try " + (iRotNew + 360));
				//return -360 + iRotNew;
			}
			*/
			// -315 to -90
			return iRotNew;
		}
		var iRotSimplified = iRotNew - 360;
		//var sDebugNegOrPos = "neg";
		// -586.974934010882 45
		if (iRotCurr >= 0) {
			// Curr is pos. Represent New as pos.
			sDebugNegOrPos = "pos";
			if (iRotCurr - iRotNew < 180) {
				//c onsole.log("less than 180")
				return iRotNew;
			}
			var iRotSimplified = 360 + iRotNew;
		} else {
			if (iRotCurr + iRotNew < -180) {
				// EG -227 N:45 ---- NICE:-315
				//c onsole.error("NEG less than -180 ---------------- " + iRotSimplified);
				//c onsole.error("iRotCurr is " + sDebugNegOrPos + " C:" + iRotCurr + " N:" + iRotNew + " ---- NICE:" + iRotSimplified);
				//TODO: Perhaps this still needs to be altered.
				//return iRotSimplified;
			}
		}
		//c onsole.error("---------------- " + iRotSimplified);
		//c onsole.error("iRotCurr is " + sDebugNegOrPos + " C:" + iRotCurr + " N:" + iRotNew + " ---- NICE:" + iRotSimplified);
		if (iRotSimplified > 360 || iRotSimplified < -360) {
			//c onsole.error("---------------- " + iRotCurr + " " + iRotNew + " diff ::: " + (iRotCurr - iRotNew));
			iRotSimplified = iRotSimplified % 360;
		}
		return iRotSimplified;
	}
	,getNextLegReady: function() {
		var aiNextLeg = this.popFromQueue();
		if (aiNextLeg == null) {
			return;
		}
		setTimeout(function(){botAnim.drive(aiNextLeg[0],aiNextLeg[1])}, 2500);
	}
}

function computeRotation(iOriginX, iOriginY, iDestX, iDestY){
	var iDistX = Math.abs(iOriginX - iDestX);
	var iDistY = Math.abs(iOriginY - iDestY);
	var iDist = Math.round(Math.sqrt(iDistX*iDistX+iDistY*iDistY));
	var iDiffX = (iDestX - iOriginX);
	var iDiffY = (iDestY - iOriginY);
	var iAngle = Math.atan2(iDiffY, iDiffX);
	iAngle = (iAngle * 180) / Math.PI;
	//c onsole.log("from:[" + iOriginX + ":" + iOriginY + " to:[" + iDestX + ":" + iDestY + "] == " + iAngle + "");
	return iAngle - 90; // * -1;
}
