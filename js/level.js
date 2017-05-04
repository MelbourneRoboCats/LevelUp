

var iNrOfLevelsToShow = 2;
var iLevelNr = getLevelNr();

function initPage() {
	document.title = "Level " + iLevelNr + " RoboCats LevelUp";
}

function initNavigator() {
	var sOut = "";
	sOut += "<div><a href=\"../index.htm\">Home</a>";
	sOut += "</div>";
	sOut += "<div id=\"navPrev\">";
	if (iLevelNr == 1) {
		sOut += "<span>&lt; Previous</span>";
	} else {
		sOut += "<a href=\"level" + (iLevelNr - 1) + ".htm\">&lt; Previous Level</a>";
	}
	sOut += "</div>";
	sOut += "<div id=\"navNext\">";
	if (iLevelNr == iNrOfLevelsToShow) {
		sOut += "<span>Next &gt;</span>";
	} else {
		sOut += "<a href=\"level" + (iLevelNr + 1) + ".htm\">Next Level &gt;</a>";
	}
	sOut += "</div>";
	sOut += "";
	elAll("#navigator", sOut);
}
function getLevelNr() {
	var sOut = document.location.href;
	var asOut = sOut.split("htm/level").join(" ").split(".htm").join(" ").split(" ");
	return parseInt(asOut[1]);
}
var wiki = {
	format: function() {
		var divWikiContent = el("wikiFormat");
		var asWikiContent = divWikiContent.innerHTML.split("\n");
		var sOut = "";
		for (var iLine = 0; iLine < asWikiContent.length; iLine++) {
			var sLine = asWikiContent[iLine];
			var sStart = "";
			var sEnd = "";
			if (sLine.indexOf("## ") == 0) {
				sLine = sLine.substring(3);
				sStart = "<h3>";
				sEnd = "</h3>";
			} else if (sLine.indexOf("# ") == 0) {
				sLine = sLine.substring(2);
				sStart = "<h1>";
				sEnd = "</h1>";
			} else if (sLine.indexOf("* ") == 0) {
				sLine = "&bull; " + sLine.substring(2);
				//sStart = "<h1>";
				//sEnd = "</h1>";
			}
			sOut += sStart + sLine + sEnd + "\n";
		}
		divWikiContent.innerHTML = sOut;
	}
}
function initFooter() {
	var sOut = "<p class=\"site-credits\">Official Sponsors</p>";
	sOut += "<div id=\"sponsorLogosWrapper\">";
	sOut += "<img src=\"../img/logoSwinburnMedium.png\" />";
	sOut += "<img src=\"../img/logoBaeSystemsMedium.png\" />";
	sOut += "<img src=\"../img/logoFordMedium.png\" />";
	sOut += "<img src=\"../img/logoInvetechMedium.png\" />";
	sOut += "<img src=\"../img/logoBoengMedium.png\" />";
	sOut += "<img src=\"../img/logoSalesForceMedium.png\" />";
	sOut += "<img src=\"../img/logoRockwellAutomationMedium.png\" />";
	sOut += "</div>";
	var oFooter = el("#footer div.contentSectionWrapper", sOut);
}
function elAll(sXpath, sContent) {
	var aoOut = document.querySelectorAll(sXpath);
	for (var iEl = 0; iEl < aoOut.length; iEl++) {
		if (typeof sContent != "undefined") {
			aoOut[iEl].innerHTML = sContent;
		}
	}
	return aoOut;
}
function el(sXpath, sContent) {
	var oOut = document.querySelector(sXpath);
	if (typeof sContent != "undefined") {
		oOut.innerHTML = sContent;
	}
	return oOut;
}
function doOnLoad() {
	// Set up navigator.
	initPage();
	initNavigator();
	initFooter();
	wiki.format();
}
