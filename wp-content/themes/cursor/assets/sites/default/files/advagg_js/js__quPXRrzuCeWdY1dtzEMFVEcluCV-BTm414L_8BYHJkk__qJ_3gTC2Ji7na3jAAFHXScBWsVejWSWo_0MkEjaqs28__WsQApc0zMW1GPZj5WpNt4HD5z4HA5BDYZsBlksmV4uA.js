/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/misc/textarea.js. */
(function($){Drupal.behaviors.textarea={attach:function(context,settings){$('.form-textarea-wrapper.resizable',context).once('textarea',function(){var staticOffset=null,textarea=$(this).addClass('resizable-textarea').find('textarea'),grippie=$('<div class="grippie"></div>').mousedown(startDrag);grippie.insertAfter(textarea)
function startDrag(e){staticOffset=textarea.height()-e.pageY;textarea.css('opacity',0.25);$(document).mousemove(performDrag).mouseup(endDrag);return false}
function performDrag(e){textarea.height(Math.max(32,staticOffset+e.pageY)+'px');return false}
function endDrag(e){$(document).unbind('mousemove',performDrag).unbind('mouseup',endDrag);textarea.css('opacity',1)}})}}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/misc/textarea.js. */
;/*})'"*/
/* Source and licensing information for the line(s) below can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/webform/js/webform.js. */
(function($){Drupal.behaviors.webform=Drupal.behaviors.webform||{};Drupal.behaviors.webform.attach=function(context){Drupal.webform.datepicker(context)};Drupal.webform=Drupal.webform||{};Drupal.webform.datepicker=function(context){$('div.webform-datepicker').each(function(){var $webformDatepicker=$(this),$calendar=$webformDatepicker.find('input.webform-calendar');if($calendar.length==0)return;var startDate=$calendar[0].className.replace(/.*webform-calendar-start-(\d{4}-\d{2}-\d{2}).*/,'$1').split('-'),endDate=$calendar[0].className.replace(/.*webform-calendar-end-(\d{4}-\d{2}-\d{2}).*/,'$1').split('-'),firstDay=$calendar[0].className.replace(/.*webform-calendar-day-(\d).*/,'$1');startDate=new Date(startDate[0],startDate[1]-1,startDate[2]);endDate=new Date(endDate[0],endDate[1]-1,endDate[2]);if(startDate>endDate){var laterDate=startDate;startDate=endDate;endDate=laterDate};var startYear=startDate.getFullYear(),endYear=endDate.getFullYear();$calendar.datepicker({dateFormat:'yy-mm-dd',yearRange:startYear+':'+endYear,firstDay:parseInt(firstDay),minDate:startDate,maxDate:endDate,onSelect:function(dateText,inst){var date=dateText.split('-');$webformDatepicker.find('select.year, input.year').val(+date[0]).trigger('change');$webformDatepicker.find('select.month').val(+date[1]).trigger('change');$webformDatepicker.find('select.day').val(+date[2]).trigger('change')},beforeShow:function(input,inst){var year=$webformDatepicker.find('select.year, input.year').val(),month=$webformDatepicker.find('select.month').val(),day=$webformDatepicker.find('select.day').val(),today=new Date();year=year?year:today.getFullYear();month=month?month:today.getMonth()+1;day=day?day:today.getDate();year=(year<startYear||year>endYear)?startYear:year;$(input).val(year+'-'+month+'-'+day)}});$calendar.click(function(event){$(this).focus();event.preventDefault()})})}})(jQuery);;
/* Source and licensing information for the above line(s) can be found at https://www.choicenotchance.org.nz/sites/all/modules/contrib/webform/js/webform.js. */
;/*})'"*/
