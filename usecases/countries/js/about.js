$(document).ready(function() {
	$('a[data-toggle="about-section"]').on('click', function (e) {
		var activeSection = e.target // activated section
		var divid = $(activeSection).attr('href').substr(1);
		
		loadPageInDiv('about-sections/'+divid,'about-section');
	});
});