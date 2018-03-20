'use strict';

/* Global variables */
var map, infoWindow, viewModel;

/* Google Maps API callback */
function initialize() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.085644, lng: 25.148832}, // Map to Paros.
		zoom: 12 // Zoom into Paros.
	});

	/* infowindow */
	infoWindow = new google.maps.InfoWindow({
		maxWidth: 200
	});

	/* Create the main viewModel and make Knockout binding, when google maps API is loaded. */
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
}


/* Google Maps API error handling */
function mapLoadErr() {

	alert("Google Maps API is not responding. Application cannot complete execution.");
}



/* The following binding is necessary to give unique ID to template elements. */

var counter = 0;
ko.bindingHandlers.uniqueID = {

	init: function(element, valueAccessor) {
		var prefix = valueAccessor();
		element.id = prefix + counter++;
	}
};


/* custom binding */

ko.bindingHandlers.editName = {

	init: function(element, valueAccessor) {

		var nameField = element.parentElement.children[1]; 

		element.addEventListener('click', function() {

			if (valueAccessor().pEditing()) {
				valueAccessor().pIcon('&#128295;');
				valueAccessor().pName(nameField.value);
				valueAccessor().pEditing(false);  
			} else {
				valueAccessor().pIcon('&#10004;'); 
				valueAccessor().pEditing(true); 
			}
		});
	}
};


/* 'item-template' component register */

ko.components.register('item-template', {

	template:
		'<div>\
			<p data-bind="uniqueID: \'unique-id-\', visible: !item.pEditing(), html: item.pName, click: function() { $parents[1].ajaxCall(item) }"></p>\
			<input data-bind="visible: item.pEditing, value: item.pName"></input>\
			<button data-bind="uniqueID: \'unique-id-\', editName: item, html: item.pIcon"></button>\
			<button data-bind="click: function() { $parents[1].erase(item) }">&#x2716;</button>\
		</div>'
});


/* Event listener to close menu */

document.addEventListener('click', function(event) {

	if ( !($(event.target).closest('#menu').length ||
		   $(event.target).is('#menu-button') ||
		   $(event.target).is('#address') ) ) {

		if (viewModel.showMenu() === true){
			viewModel.showMenu(false);
		}
	}
});
