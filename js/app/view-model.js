'use strict';

/* ViewModel */

var ViewModel = function() {

	/* 'information' to extract paragraph from wikipedia page. */
	var information, callTimeOut,
		self = this;

	/* 'showMenu' is data-bound to the menu's visibility. Set it to true to show. It is initially hidden. */
	self.showMenu = ko.observable(false);

	/* 'noMoreContent' is data-bound to the visibility of the extra item (#menu > ul > none template li). */
	self.noMoreContent = ko.observable(false);

	/* 'searchString' used as the string to compare with the place names for filter function */
	self.searchString = ko.observable();

	self.listItems = ko.observableArray();
	PLACES.forEach(function(item){
		self.listItems.push(new Place(item));
	});

	/* Menu toggle */

	self.menuToggle = function() {

		self.showMenu(!self.showMenu());
	};


	/* Filter Method for searchstring */

	self.listFilter = function() {

		self.listItems().forEach(function(item, idx){
			if( item.pName().search(self.searchString()) === -1) {
				self.listItems()[idx].pShow(false); // Hide
				self.listItems()[idx].pMarker.setMap(null);
			} else {
				self.listItems()[idx].pShow(true); // Show
				self.listItems()[idx].pMarker.setMap(map);
			}
		});
	};


	/* Delete an entry method */

	self.erase = function(param) {

		var idx = self.listItems.indexOf(param);
		if (idx > -1) {
			self.listItems.splice(idx, 1); // delete an entry.
			param.pMarker.setMap(null); // remove the associated marker as well.
		}

		if (self.listItems().length === 0) {
			self.noMoreContent(true);
		}
	};
};


/* Ajax call function of each item.Get data and display info window */

ViewModel.prototype.ajaxCall = function(param) {

	/* Error handler for the Ajax call */
	this.callTimeOut = setTimeout(function(){
		alert("Data retrieval is taking too long. There might be something wrong.");
	}, 2000);
	param.ajaxCall(param.onReception);
	this.showMenu(false);
};


/* Marker animation function */

ViewModel.prototype.animateMarker = function(param) {

	param.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function(){param.setAnimation(null);}, 2800);
};
