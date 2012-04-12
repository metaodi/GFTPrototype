$(document).ready(function() {
	loadPageInDiv('map','map',loadMap);
	
	$('a[data-toggle="tab"]').on('shown', function (e) {
		var activeTab = e.target // activated tab
		var divid = $(activeTab).attr('href').substr(1);

		loadPageInDiv(divid,divid);
	});
	
	$('a[data-toggle="page"]').on('click', function (e) {
		var activePage = e.target // activated page
		var divid = $(activePage).attr('href').substr(1);
		
		if (divid == '') {
			divid = 'index';
		}
		//remove active class from old page
		var previous = $('#main-nav').find('> .active');
		previous.removeClass('active');
		
		//add active class to new page
		$('#'+divid+'-nav').addClass('active');
		
		loadPageInDiv(divid,'box');
	});
});