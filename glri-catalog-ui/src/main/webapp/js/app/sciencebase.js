'use strict';


GLRICatalogApp.service('ScienceBase', 
['$http', 'Status', 'FocusAreaManager', '$rootScope',
function($http, Status, FocusAreaManager, $rootScope){

	var ctx = this;
	ctx.vocabs =  {
//		Water_Features: "https://www.sciencebase.gov/vocab/53d178fde4b0536257c34170/terms?format=json",
//		Focus_Areaa: "https://www.sciencebase.gov/vocab/53ab40fee4b0282c77bc73c7/terms?format=json",
//		Templates: "https://www.sciencebase.gov/vocab/53da7288e4b0fae13b6deb73/terms?format=json",
//		SiGL_Keywords: "https://www.sciencebase.gov/vocab/53b43ce9e4b03f6519cab96c/terms?format=json",
		
		water_features: "53d178fde4b0536257c34170",
		focus_areas   : "53ab40fee4b0282c77bc73c7",
		templates     : "53da7288e4b0fae13b6deb73",
		SiGL_keywords : "53b43ce9e4b03f6519cab96c",
	}
	
	
	//Called at the bottom of this JS file
	var init = function() {

		for (var vocab in ctx.vocabs) {
			//The array of funding templates to choose from.  Init as "Any", but async load from vocab server.
			Status[vocab] =  [ 
				{key: "xxx", display:"...loading list...", sort: 0},
			];
		}
		
		for (var vocab in ctx.vocabs) {
			ctx.doVocabLoad(vocab);
		}
	}
	
	
	//These are the Google Analytics custom metrics for each search param.
	//To log search usage, each search should register that a search was done
	//and what type of search it was (actual search values are not tracked).
	//location is split into either loc_type or name based on the value.
	ctx.modelAnalytics = {
		search: 1,
		text_query: 2,
		loc_type: 3,
		loc_name: 4,
		focus: 5,
		spatial: 6,
		template: 7
	};

	

	
	
	ctx.fetchData = function(resource, success) {
		$http.get( ctx.buildUrl(resource) )
		.success(function(data, status, headers, config) {
			success(data);
		})
		.error(function(data, status, headers, config) {
			alert("Unable to connect to ScienceBase.gov to find " +resource+ ".");
		});
	}
	
	
	ctx.loadProjectLists = function() {
		ctx.fetchData("Project", function(data){
			ctx.processProjectListResponse(data);
			Status.projectsLoadStatus = 'done';
		});
		ctx.fetchData("Publication", function(data){
			ctx.processPublicationResponse(data, Status.allPublications);
			Status.publicationsLoadStatus = 'done';
		});
	}

	ctx.processDatasetResponse = function(unfilteredJsonData, collection) {

		if (isDefined(unfilteredJsonData) 
		 && isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				var dataset = ctx.processDataset(items[i])
				if (dataset.resource === "data") {
					collection.push(dataset)
				}
			}
		}
		
		$rootScope.$broadcast('do-scopeApply');
	}
	
	ctx.processDataset = function(dataset) {
		dataset = ctx.processItem(dataset);
		return dataset
	}
	
	ctx.processPublicationResponse = function(unfilteredJsonData, collection) {

		if (isDefined(unfilteredJsonData) 
		 && isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				var pub = ctx.processPublication(items[i]);
				if (pub.resource === "publication") {
					collection.push(pub)
				}
			}
		}
		
		$rootScope.$broadcast('do-scopeApply');
	}
	
	
	ctx.processPublication = function(pub) {
		pub = ctx.processItem(pub);
		
		pub.item = pub // self link for publications
		
		var citation
		for (var f in pub.facets) {
			var facet = pub.facets[f]
			if (facet.facetName === "Citation") {
				citation = facet.note.replace(/;(\S)/g,"; $1")
			}
		}
		pub.citation = citation
		
		var year;
		var created;
		for (var d in pub.dates) {
			var date = pub.dates[d];
			if (date.type === "Publication") {
				year = date.dateString;
			} else if (date.type === "dateCreated") {
				created = date.dateString;
			}
		}
		pub.sortDate = year + "_" + created; 
		
		return pub
	}
	
	
	ctx.processProjectListResponse = function(unfilteredJsonData) {
		
		if (isDefined(unfilteredJsonData) 
		 && isDefined(unfilteredJsonData.items) ) {
			
			var items = unfilteredJsonData.items;

			for (var i = 0; i < items.length; i++) {
				
				var item = ctx.processItem(items[i]);
				var tags = item.tags;
				
				if (tags) {
					for (var j = 0; j < tags.length; j++) {
						var tag = tags[j];
						if (Status.CONST.FOCUS_AREA_SCHEME == tag.scheme) {
							FocusAreaManager.addProjectToFocusArea(item, tag.name);
						}
					}
				}
				
			}
		}
		
		$rootScope.$broadcast('do-scopeApply');
		return unfilteredJsonData.items;
	}	
	
	
	ctx.processItem = function(item) {

		//The system type is set of special items like 'folder's, which we don't want in the results
		var sysTypes = item.systemTypes ?item.systemTypes :[];
		var sysType  = sysTypes[0] ?sysTypes[0].toLowerCase() :'standard';
		
		//Resource type / browserCategory has its own faceted search
		item.resource = "unknown";
		if (item.browseCategories) {
			if (item.browseCategories.indexOf('Project') > -1) {
				item.resource = 'project';
			} else if (item.browseCategories.indexOf('Publication') > -1) {
				item.resource = 'publication';
			} else if (item.browseCategories.indexOf('Data') > -1) {
				item.resource = 'data';
			}
		}
		
		//don't include folders unless they are projects
		if (sysType != 'folder' || (sysType == 'folder' && item.resource == 'project')) {
		
			item.url         = item.link.url; // TODO should this find proper link?
			
			if (item.resource === 'project') {
				if (item.webLinks) {
					for (var linkIdx = 0; linkIdx < item.webLinks.length; linkIdx++ ) {
						if (item.webLinks[linkIdx].title === "Project Home Page") {
							item.mainLink = {url: item.webLinks[linkIdx].uri, title: item.webLinks[linkIdx].title};
						}
					}
				} else {
					console.warn("WARNING, webLinks not defined for item: " + item.id);
				}
			} else {
				item.mainLink    = ctx.findLink(item.webLinks, ["home", "html", "index page"], true);
			}
			
			item.browseImage = ctx.findBrowseImage(item);
		//		item.dateCreated = ctx.findDate(item.dates, "dateCreated")
		
			//Simplify the systemTypes
			item.systemType  = sysType;
			
			//Have we loaded child records yet?  (hint: no)
			item.childRecordState = "notloaded";
			item.publications     = 'loading'; // default to loading until we have the publications
		
			ctx.processContacts(item, true)
			
			// Add template info
			item.templates = [];
			
			var tags = item.tags;
			if (tags) {
				for (var j = 0; j < tags.length; j++) {
					var tag = tags[j];
					if (Status.CONST.TEMPLATE_SCHEME == tag.scheme) {
						item.templates.push(tag.name.replace('Template ', ''));
					}
				}
			}
		}
		
		//Add edit permissions to projects if the user is logged in
		if (item.resource == 'project' && userService.getUserName() != null) {
			var userName = userService.getUserName();
			
			if ( isDefined(item.contacts) ) {
				for (var j = 0; j < item.contacts.length; j++) {
					var contact = item.contacts[j];

					if ( isDefined(contact.email) ) {
						if (true) {
						//if (contact.email == userName) {
							item.userCanEdit = true;
							break;
						}
					}

				}
			}
		
		
		
			
		}
		
		item.summary = ctx.cleanSummary(item.summary);

		return item;
	}
	
	/*
	 * Strips header names, HTML tags, line breaks, and non-breaking spaces from the summary
	 */
	ctx.cleanSummary = function(summary) {

		if (summary) {
			summary = summary.replace("Description of Work", "");
			summary = summary.replace("Key Findings", "");
			summary = summary.replace("Relevance/Benefits", "");
			summary = summary.replace("Products", "");
			summary = summary.replace("Goals & Objectives", "");
			summary = summary.replace("Approach", "");
			summary = summary.replace("Key Outcomes", "");
			summary = summary.replace("Schedule", "");
			summary = summary.replace(/<.*?>/g, "");
			summary = summary.replace(/\n/g, "");
			summary = summary.replace(/&nbsp;/g, " ")
		}		

		return summary;
	}

	
	//build contactText
	ctx.processContacts = function(item, includeHTML, max) {
		var contacts = item.contacts;
		var contactText = "";	//combined contact text
		var contactHtml = "";	//combined contact text
		
		if ( isDefined(contacts) ) {
			if ( ! isDefined(max) ) {
				max = contacts.length;
			}
			var sep = "";
			for (var j = 0; j < contacts.length; j++) {
				if (j < max) {
					var contact = contacts[j];
					var type    = contact.type!==null ?contact.type :"??";
					if (type === 'Principle Investigator') {
						type    = "PI";
					}
					var name    = contact.name
					var mailto  = contact.name
					if ( isDefined(contact.email) ) {
						mailto  = '<a href="mailto:'+contact.email+'">' +contact.name+ '</a>'
					}
					contactText += sep + name   + (type!=null ?" (" + type + ") " :"");
					contactHtml += sep + mailto + (type!=null ?" (" + type + ") " :"");
					sep = ", ";
					
				} else if (j === max) {
					contactText+= "and others.  "
				} else {
					break;
				}
			}
		}

		if (contactText.length === 0) {
			contactText = "[No contact information listed]";
		}
		
		item.contactText = contactText;
		
		if (includeHTML) {
			item.contactHtml = contactHtml;
		}
	}
	
	
	ctx.findBrowseImage = function(item) {
		var webLinks = item.webLinks;
		if (webLinks) {
			for (var i = 0; i < webLinks.length; i++) {
				var link = webLinks[i];
				if (link.type == "browseImage") {
					return link.uri;
				}
			}
		}
		
		return undefined;
	}
	
	
	/**
	 * Finds a link from a list of ScienceBase webLinks based on a list
	 * of search keys, which are searched for in order against the
	 * 'rel' and 'title' fields of each link.
	 * 
	 * The GLRI project will mark the homepage link with 'rel' == 'home'.
	 * The current Pubs are pushed into ScienceBase w/ 'title' == 'html'
	 * for an (approximate) home page.
	 * 
	 * The return value is an associative array where the title can be used for display:
	 * {url, title}
	 * 
	 * If no matching link is found, undefined is returned.
	 * 
	 * @param {type} linkArray Array taken from ScienceBase search response webLinks.
	 * @param {type} searchArray List of link 'rel' or 'titles' to search for, in order.
	 * @param {type} defaultToFirst If nothing is found, return the first link if true.
	 * @returns {url, title} or undefined
	 */
	ctx.findLink = function(linkArray, searchArray, defaultToFirst) {

		if (linkArray && linkArray.length > 0) {

			var retVal = {url: linkArray[0].uri, title: "Home Page"};

			for (var searchIdx = 0; searchIdx < searchArray.length; searchIdx++) {
				var searchlKey = searchArray[searchIdx];
				for (var linkIdx = 0; linkIdx < linkArray.length; linkIdx++) {
					if (linkArray[linkIdx].rel == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = ctx.cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					} else if (linkArray[linkIdx].title == searchlKey) {
						retVal.url = linkArray[linkIdx].uri;
						retVal.title = ctx.cleanTitle(linkArray[linkIdx].title, "Home Page");
						return retVal;
					}
				}
			}

			if (defaultToFirst) {
				retVal.title = linkArray[0].title;
				return retVal;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}
	
	
	ctx.findDate = function(dates, type) {
		for (var d in dates) {
			var date = dates[d]
			if (date.type === type) {
				return date.dateString
			}
		}
		return "none"
	}
	

	ctx.loadChildItems = function(parentRecord) {
		if (parentRecord.childRecordState == "closed") {
			parentRecord.childRecordState = "complete";
		} else {
			parentRecord.childRecordState = "loading";
			
			var url = Status.CONST.BASE_QUERY_URL + "folder=" + parentRecord.id;

			$http.get(url).success(function(data) {
				ctx.processPublicationResponse(data, parentRecord.childItems=[]);

				parentRecord.publications = (parentRecord.childItems.length===0) ? undefined : parentRecord.childItems.slice();

				ctx.processDatasetResponse(data, parentRecord.childItems=[]);
				parentRecord.datasets = (parentRecord.childItems.length===0) ? undefined : parentRecord.childItems.slice();

				parentRecord.childRecordState = "complete";

			}).error(function(data, status, headers, config) {
				parentRecord.childRecordState = "failed";
				alert("Unable to connect to ScienceBase.gov to find child records.");
			});
		}
	}	
	
	
	/**
	 * Replaces boilerplate link titles from ScienceBase w/ a default one if the proposed one is generic.
	 * @param {type} proposedTitle
	 * @param {type} defaultTitle
	 * @returns The passed title or the default title.
	 */
	ctx.cleanTitle = function(proposedTitle, defaultTitle) {
		var p = proposedTitle;
		if (! (p) || p == "html" || p == "jpg" || p == "unspecified") {
			return defaultTitle;
		} else {
			return p;
		}
	}

	
	ctx.buildUrl = function(resource) {
		var url = Status.CONST.BASE_QUERY_URL+ "resource="+encodeURI(resource+"&")
			+"fields=" +encodeURI("url,summary,tags,title,contacts,hasChildren,webLinks,purpose,body,dateCreated,parentId,facets,dates,browseCategories");
		return url;
	}
	ctx.buildSearchUrl = function(model) {
		var url = Status.CONST.BASE_QUERY_URL;
		
		//Add a general entry for the search happening
		var gaMetrics = {metric1:1};
		
		var sep=""; // the first entry gets no separator (see below)
		$.each(model, function(key, value) {
			if (value === '' || value === 'Any') {
				return;
			}
				
			var actualKey = key;	//for some param we use different keys based on the value
			
			if (key === "location") {
				if (value.indexOf(":") > -1) {
					//this is a location name like "Lake:Lake Michigan'
					actualKey = "loc_name";
				} else {
					//this is a location type like "Lake"
					actualKey = "loc_type";
				}
			}
			
			if (ctx.modelAnalytics[actualKey]) {
				gaMetrics['metric' + ctx.modelAnalytics[actualKey]] = 1;
			}
			url += sep+ encodeURI(actualKey) +"="+ encodeURI(value);
			sep = "&"; // each additional will get this separator
		});

		//Reports to Google Analytics that a search was done on which set of
		//fields, but doesn't include what the search values were.
		ga('send', 'event', 'action', 'search', gaMetrics);
		
		return url;
	}


	
	//remove the 'loading' message at index 1
	var removeLoading = function(array,index) {
		array.splice(index, 1);
	}
	
	ctx.doVocabLoad = function(vocab) {
		
		$http({method: 'GET', url: 'ScienceBaseVocabService?format=json&parentId='+ctx.vocabs[vocab]})
		.success(function(data, status, headers, config) {
			removeLoading(Status[vocab],0);

			for (var i = 0; i < data.list.length; i++) {
				var o = {};
				o.key = data.list[i].name;
				o.display = o.key;
				
				//take all digits at the end, ignoring any trailing spaces.
				o.sort = Number(o.key.match(/(\d*)\s*$/)[1]);
				
				Status[vocab].push(o);
			}
		})
		.error(function(data, status, headers, config) {
			removeLoading(Status[vocab],0);
			//just put in a message in the pick-list - no alert.
			Status[vocab].push({
				key: "", display:"(!) Failed to load list", sort: 0
			});
		});
	}	

	
	init();
	
	
}])
