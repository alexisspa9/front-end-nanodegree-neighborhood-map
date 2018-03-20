'use strict';

/* Model contains all the necessary initial information about each location displayed on the map. */

var PLACES = [

	{
		pLat: 37.0850586,
		pLong: 25.1518654,
		pName: 'Panaya of Ekatontapiliani',
		pWiki: "prop=extracts&exintro=&explaintext=&titles=Panagia_Ekatontapiliani",
		pShow: true
	},

	{
		pLat: 37.0808337,
		pLong: 25.1436817,
		pName: 'Agia Anna',
		pWiki: "prop=extracts&exintro=&explaintext=&titles=Agia_Anna",
		pShow: true
	},

	{
		pLat: 37.08365394,
		pLong: 25.1476192,
		pName: 'Aegean Center for the Fine Arts',
		pWiki: "prop=extracts&exintro=&explaintext=&titles=Aegean_Center_for_the_Fine_Arts",
		pShow: true
	},
	{
		pLat: 37.02196186,
		pLong: 25.115603698,
		pName: 'New Paros Airport',
		pWiki: "prop=extracts&exintro=&explaintext=&titles=New_Paros_Airport",
		pShow: true
	},
	{
		pLat: 37.02193402,
		pLong: 25.11993546,
		pName: 'Old Paros National Airport',
		pWiki: "prop=extracts&exintro=&explaintext=&titles=Old_Paros_National_Airport",
		pShow: true
	}
];


/* Place constructor */

var Place = function(item) {

	var self = this;

	self.pLat = ko.observable(item.pLat);
	self.pLong = ko.observable(item.pLong);
	self.pName = ko.observable(item.pName);
	self.pWiki = item.pWiki;
	self.pShow = ko.observable(item.pShow);
	self.pIcon = ko.observable('&#128295;');
	self.pEditing = ko.observable(false);
	self.pNameOrigin = item.pName;

	/* Create a marker for the given location */
	self.pMarker = new google.maps.Marker({
		map: map,
		position: { lat: self.pLat(), lng: self.pLong() },
		title: self.pName()
	});

	/* When a marker is clicked by the user, make the Ajax call. */
	self.pMarker.addListener('click', function(){

		viewModel.callTimeOut = setTimeout(function(){
			alert("Data retrieval is taking a bit long... There might be something wrong.");
		}, 2000); // Set timeout to be 2 seconds.
		self.ajaxCall(self.onReception);
	});

	/* Ajax callback function animate marker */
	self.onReception = function(data) {

		for (var pageId in data.query.pages) {
			if (data.query.pages.hasOwnProperty(pageId)) {

				viewModel.information = '<div class=info>' + data.query.pages[pageId].extract + '</div>';
			}
		}

		infoWindow.setContent(viewModel.information);
		infoWindow.open(map, self.pMarker);

		viewModel.animateMarker(self.pMarker);

		clearTimeout(viewModel.callTimeOut);
	};
};


/* Ajax call function Wikipedia page information. */

Place.prototype.ajaxCall = function(onReception) {

	$.ajax({
		url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&' + this.pWiki,
		dataType: 'jsonp'
	})
	
	.done(onReception)
	
	.fail(function() {
		alert('Data retrieval was not successful and no additional data can be shown');
	});
};
