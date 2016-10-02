var triggerBtnDocsPanel = document.querySelector('.js-trigger-docs-panel');
var docsPanel = document.querySelector('.docs-panel');
var docsPanelClose = docsPanel.querySelector('.docs-panel__close');

docsPanel.classList.add('docs-panel--closed');

function togglePanel(event) {
    event.preventDefault();
    if (docsPanel.classList.contains('docs-panel--closed')) {
        docsPanel.classList.remove('docs-panel--closed');
        docsPanel.classList.add('docs-panel--opened');
    } else {
        docsPanel.classList.remove('docs-panel--opened');
        docsPanel.classList.add('docs-panel--closed');
    }
}

triggerBtnDocsPanel.addEventListener('click', togglePanel);
docsPanelClose.addEventListener('click', togglePanel);



/*=================================================
=            Translating magnificPopup            =
=================================================*/

// Add it after jquery.magnific-popup.js and before first initialization code
$.extend(true, $.magnificPopup.defaults, {
    tClose: 'Закрыть (Esc)', // Alt text on close button
    tLoading: 'Загрузка...', // Text that is displayed during loading. Can contain %curr% and %total% keys
    gallery: {
        tPrev: 'Назад (Left arrow key)', // Alt text on left arrow
        tNext: 'Вперед (Right arrow key)', // Alt text on right arrow
        tCounter: '%curr% из %total%' // Markup for "1 of 7" counter
    },
    image: {
        tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded
    },
    ajax: {
        tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed
    }
});

/*=====  End of Translating magnificPopup  ======*/


$(document).ready(function() {

    //	Inline popup
    var $triggerInlinePopup = $('.js-trigger-inline-popup');

    $triggerInlinePopup.each(function() {
        $(this).magnificPopup({
            mainClass: 'popup-fade',
            closeOnBgClick: false,
            autoFocusLast: false,
            removalDelay: 300,
            callbacks: {
                open: function() {
                    var callbackTargetEmail = encodeURIComponent($(this.currItem.el).data('contact-manager-target-email'));
                    document.forms['form-contact-manager']['contact-manager-target-email'].value = callbackTargetEmail;
                    document.forms['form-contact-manager']['contact-manager-target-name'].value = outputTargetName(this.currItem.el);
                    console.log(outputTargetName(this.currItem.el));
                }
            }
        });
    });

    function outputTargetName(targetElement) {
        var $targetContainer = $(targetElement).closest('.contacts_page__blocks__block__one_block__directors__item');
        var targetFirstName = $.trim($targetContainer.find('.contacts_page__blocks__block__one_block__directors__item__family').text());
        var targetSecondName = $.trim($targetContainer.find('.contacts_page__blocks__block__one_block__directors__item__name').text());
        return (targetFirstName + ' ' + targetSecondName);
    }

    document.forms['form-order']['order-message'].value = outputOrderMessageFlat(12, 3, 34);

    //	Phone inputmask
    $('input[type="tel"]').inputmask("+7 (999) 999 99 99", {
        clearMaskOnLostFocus: false,
        // jitMasking: true
    });







		function outputOrderMessageFlat(area, houseNum, sectionNum, floorNum) {
				var markupText = 'Меня интересует квартира площадью ' + area + ' м² в доме ' + houseNum + ', секция ' + sectionNum + ' на ' + floorNum + ' этаже.';
				return markupText;
		}


		function outputOrderMessageHouse(area, houseNum, levelNum) {
				var markupText = 'Меня интересует ' + levelNum + '-этажный дом типа ' + houseNum + ' с общей площадью ' + area + '.';
				return markupText;
		}



		function openPopupOrder() {
			$.magnificPopup.open({
					items: {
							src: '#popup-order'
					}
			}, 0);
		}

    // Order popup
    $('.flat_plan__right__order__button').on('click', function(event) {
        event.preventDefault();
				openPopupOrder();
				var area = parseFloat($('flat_plan__right__area-value').text());
				var houseNum = $('.flat_plan__right__house-value').text();
				var sectionNum = $('.flat_plan__right__section-value').text();
				var floorNum = $('.flat_plan__left__floor__number').text();
				console.log(area, houseNum, sectionNum, floorNum);
				document.forms['form-order']['order-message'].value = outputOrderMessageFlat(area, houseNum, sectionNum, floorNum);
    });

		openPopupOrder();









});
