'use strict';

if ( ! window.baseURL) {
	window.baseURL = "https://www.sciencebase.gov";
}



//angular does not check for null
function isDefined(obj) {
	return angular.isDefined(obj) && obj !== null;
}


var GLRICatalogApp = angular.module('GLRICatalogApp', ['ui.bootstrap','ngSanitize', 'ui.select']);


GLRICatalogApp.value('Status', {
	
	//State of loading from ScienceBase.  Possible values: 'loading or 'done'
	projectsLoadStatus     : 'loading',
	
	//State of loading from ScienceBase.  Possible values: 'loading' or 'done'
	publicationsLoadStatus : 'loading',

	// the currently selected project
	currentItem      : undefined,
	
	// not sure if this is used any longer, it was used to prevent cyclical nav settings
	isCaptureHistory : true,
	
	currentFocusArea: undefined,
	
	//A filtered (or all) list of projects to be displayed on the browse tab
	currentProjectList : [],
	
	// all the publication for a all projects
	allPublications    : [],
	
	
	CONST : {
		FOCUS_AREA_SCHEME : baseURL+"/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRIFocusArea",
		TEMPLATE_SCHEME   : baseURL+"/vocab/category/Great%20Lakes%20Restoration%20Initiative/GLRITemplates",
		BASE_QUERY_URL    : "ScienceBaseService?",
	},	

});

