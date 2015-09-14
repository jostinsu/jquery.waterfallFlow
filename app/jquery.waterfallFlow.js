/**
 * Created by sujianxin on 2015/7/27 0027.
 */
(function($) {
	$.fn.waterfallFlow = function(options) {
		var that = this;
		var defaults = {
			cellWidth : 200,
			cellTopSpace : 10,
			cellLeftSpace : 10,
			minCells:3,
			maxCells:8,
			loadingSelector : 'undefined',
			loadingTime:1000,
			animateTime:1000,
			triggerDistance:150,
			dataUrl:'undefined',
			type:"get",
			dataType:"json",
			pageSize:10,
			createList:function(data,parent){}
		};
		options = $.extend(defaults, options || {});
		var  cells = 0,
			 cellOuterWidth = options.cellWidth+options.cellLeftSpace,
			 positionTop = [],
			 positionLeft  = [],
			 flag = true,
			 count = 0,
			 page = 0;

		var setCell = function() {
			cells = Math.floor($(window).width() / cellOuterWidth);
			if (cells < options.minCells) {
				cells = options.minCells;
			} else if (cells > options.maxCells) {
				cells = options.maxCells;
			}
			$(that).css('width', (cells * cellOuterWidth- options.cellLeftSpace));
		}

		var getData = function () {
			if (!flag) {
				return;
			}
			flag = false;
			page++;
			if(options.loadingSelector) $(options.loadingSelector).show();
			$.ajax({
					type:options.type,
					url:options.dataUrl,
					data:{"page":page,"pageSize":options.pageSize},
					dataType:options.dataType,
					success:function(data){
						if(data.length){
							options.createList(data,that);
							setPosition(data.length);
						}
					}
				}
			);
			if(options.loadingSelector){
				setTimeout(function () {
					$(options.loadingSelector).hide();
				}, options.loadingTime);
			}
		}

		var setPosition = function(length){
            var index = 0,
			    aObj = $(that).children(),
			    obj = null;
			for(var i=0;i<length;i++){
				index = $.inArray(Math.min.apply(null,positionTop),positionTop);
				obj = aObj.eq(count);
				obj.css({
					position:'absolute',
					top: positionTop[index],
					left: positionLeft[index]
				});
				positionTop[index] += obj.outerHeight() + options.cellTopSpace;
				count++;
			}
			$(that).height(Math.max.apply(null,positionTop));
			flag = true;
		}

		var init = function(){
			var containerPositionType = $(that).css('position');
			if(containerPositionType!="absolute"&&containerPositionType!="fixed"){
				$(that).css('position','relative');
			}
			$(that).css('margin','0 auto');
			setCell();
			for (var i = 0; i < cells; i++) {
				positionTop[i] = 0;
				positionLeft[i] = cellOuterWidth * i;
			}
			getData();
		}
		init();

		$(window).on('scroll', function () {
			if ($(document).height() <= $(window).scrollTop() + $(window).height()+options.triggerDistance){
				getData();
			}
		});

		$(window).on('resize', function () {
			var preCells = cells;
			setCell();
			if (preCells == cells) {
				return;
			}
			positionLeft.length = positionTop.length = 0;
			for (var i = 0; i < cells; i++) {
				positionTop[i] = 0;
				positionLeft[i] = cellOuterWidth * i;
			}

			$(that).children().each(function () {
				var index = $.inArray(Math.min.apply(null,positionTop),positionTop);
				$(this).animate({
					left: positionLeft[index],
					top: positionTop[index]
				}, options.animateTime);
				positionTop[index] += $(this).outerHeight() + options.cellTopSpace;
			});
			$(that).height(Math.max.apply(null,positionTop));
		})
	}
})(jQuery);

