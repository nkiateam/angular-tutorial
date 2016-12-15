;(function($){
/**
 * ps-locale_en.js
 *
 * version <tt>$ Version: 1.0 $</tt> date:2014/05/25
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * $ps_locale.validators.passwordErrorMsg
**/
$ps_locale = {locale: 'en'};
$.extend($ps_locale,{
	ok: 'OK',
	confirm: 'Confirm',
	cancel: 'Cancel',
	finish: 'Finish',
	next: 'Next',
	prev: 'Previous',
	loading: 'Loading ...',
	apply: 'Apply',
	direct_select: 'direct selection',
	select: 'select',
	autoComplete: 'Search a word',
	sun: 'Sun.',
	mon: 'Mon.',
	tue: 'Tue.',
	wed: 'Wed.',
	thu: 'Thu.',
	fri: 'Fri.',
	sat: 'Sat.',
	jan: 'Jan.',
    feb: 'Feb.',
    mar: 'Mar.',
    apr: 'Apr.',
    may: 'May.',
    jun: 'Jun.',
    jul: 'Jul.',
    aug: 'Aug.',
    sep: 'Sep.',
    oct: 'Oct.',
    nov: 'Nov.r',
    dec: 'Dec.',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
	validators: {
		passwordErrorMsg: 'Enter at least 8 characters, numbers',
		ipErrorMsg: 'No records to view',
		loadtext: 'Loading...',
		pgtext: 'Page {0} of {1}',
		rowsPerPage: 'items per page'
	},
	grid: {
		recordtext: 'View {0} - {1} of {2}',
        emptyrecords: 'No records to view',
        loadtext: 'Loading...',
        pgtext : 'Page {0} of {1}'
	},
	wizard: {
		current: "current step:",
		pagination: "Pagination"
	}
});
})(jQuery);
