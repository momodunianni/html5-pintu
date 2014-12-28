/*重要备注：

imgOrigArr 和 imgRanfArr这两个数组分别存放正确顺序排列和乱序排列的碎片信息
数组结构：arr[碎片节点下标] = 碎片显示位置

 */

/**
 * [puzzleGame 向puzzleGame对象中添加属性]
 * @param  {[json格式]} param [图片 路径+名称]
 * @return       [无]
 */
var clickend = false;
var huan_end = true;
var t_end = true;
var puzzleGame = function(param) {
	/************* 参数处理 ******************/
	this.img = param.img || ''; //待操作的图片

	/************* 节点 ******************/
	this.btnStart = $('#wrap #left ul #start span'); //开始游戏按钮
	this.btnLevel = $('#wrap #left ul #level span'); //难度选择按钮
	this.imgArea = $('#wrap #right #imgArea'); //图片显示区域

	this.imgCells = ''; //用于记录碎片节点的变量

	/************* 变量 ******************/
	this.imgOrigArr = []; //图片拆分后，存储正确排序的数组
	this.imgRandArr = []; //图片打乱顺序后，存储当前排序的数组

	this.levelArr = [
		[5, 4]
	]; //存储难度等级的数组
	this.levelNow = 0; //表示当前难度等级的变量，与难度数组结合使用

	//图片整体的宽高
	this.imgWidth = parseInt(380);
	this.imgHeight = parseInt(475);
	//拆分为碎片后，每一块碎片的宽高
	this.cellWidth = 95;
	this.cellHeight = 95;

	this.hasStart = 0; //记录有是否开始的变量，默认fasle，未开始
	this.moveTime = 500; //记录animate动画的运动时间，默认400毫秒
	this.clickDoms1 = null;
	this.clickDoms2 = null;
	this.clickend = false;
	this.huan_end = true;
	//调用初始化函数，拆分图片,绑定按钮功能
	this.init();
}


/**
 * [prototype 在puzzleGame对象中添加方法，用json格式表示]
 * @type {Object}
 */
puzzleGame.prototype = {
	/**
	 * [init 初始化特效设置]
	 * @return [无]
	 */
	init: function() {
		this.imgSplit();
		this.levelSelect();
		this.gameState();
		var self = this;

		//启动开始游戏
		setTimeout(function() {

			self.hasStart = 1;

			//打乱图片
			self.randomArr();
			self.cellOrder(self.imgRandArr);

			//图片事件
			self.imgCells.on("tap", function() {
				/*此处是图片移动*/

				if (huan_end) {
					var cellIndex = $(this).index();
					if (!clickend) {
						self.clickDoms1 = cellIndex;
						clickend = true;
						$(this).css('border-color', 'rgba(0, 252, 255, 0.8)');
						$(this).css('border-width', '5px');
						// alert(Number( $(this).css('top').substr(0,$(this).css('top').length-2)-4)+"px" +Number( $(this).css('left').substr(0,$(this).css('left').length-3)-4)+"px")


						$(this).css('top', Number($(this).css('top').substr(0, $(this).css('top').length - 2) - 4) + "px");
						$(this).css('left', Number($(this).css('left').substr(0, $(this).css('left').length - 2) - 4) + "px");
						$(this).css('z-index', '20');
						t_end = false;
						setTimeout(function() {
							t_end = true;
						}, 1000);
					} else {


						self.clickDoms2 = cellIndex;
						var cellIndex_1 = self.clickDoms1;
						var cellIndex_2 = self.clickDoms2;
						if (cellIndex_1 == cellIndex_2) {
							if (t_end) {
								clickend = false;
								self.cellReturn(cellIndex_1);

							}


						} else {
							huan_end = false;
							clickend = false;
							$(this).css('border-color', 'rgba(0, 252, 255, 0.8)');
							$(this).css('border-width', '5px');
							$(this).css('z-index', '20');
							$(this).css('top', Number($(this).css('top').substr(0, $(this).css('top').length - 2) - 4) + "px");
							$(this).css('left', Number($(this).css('left').substr(0, $(this).css('left').length - 2) - 4) + "px");
							self.cellExchange(cellIndex_1, cellIndex_2);
						}

					}
				}
			})

		}, 3000);


	},

	/**
	 * [imgSplit 将图片拆分为碎片]
	 * @param  obj    [图片,路径+名称]
	 * @param  cellW  [碎片宽度]
	 * @param  cellH  [碎片高度]
	 * @return        [记录正确排序的数组]
	 */
	imgSplit: function() {
		this.imgOrigArr = []; //清空正确排序的数组

		//必须清空图片区域的碎片代码，否则每一次拆分图片是与之前拆分的累积
		//例如第一次拆分3x3,插入了9个div，但没有清空，第二次拆分4x4，此时是在前9个div之后再插入14个div，共9+16个div
		this.imgArea.html("");

		var cell = ''; //记录单个图片碎片的变量
		for (var i = 0; i < this.levelArr[this.levelNow][0]; i++) {
			for (var j = 0; j < this.levelArr[this.levelNow][1]; j++) {
				//将碎片所属div的下标存入数组，用于最终校验是否排序完成
				this.imgOrigArr.push(i * this.levelArr[this.levelNow][1] + j);

				cell = document.createElement("div");
				cell.className = "imgCell";
				$(cell).css({
					'width': (this.cellWidth - 2) + 'px',
					'height': (this.cellHeight - 2) + 'px',
					'left': j * this.cellWidth + 'px',
					'top': i * this.cellHeight + 'px',
					"background": "url('" + this.img + "')",
					'backgroundPosition': (-j) * this.cellWidth + 'px ' + (-i) * this.cellHeight + 'px'
				});
				$(cell).attr("option", i + "_" + j);
				this.imgArea.append(cell);
			}
		}
		this.imgCells = $('#wrap #right #imgArea div.imgCell'); //碎片节点
	},

	levelSelect: function() {
		var len = this.levelArr.length;
		var self = this;
		this.btnLevel.bind('mousedown', function() {
			$(this).addClass('mouseOn');
		}).bind('mouseup', function() {
			$(this).removeClass('mouseOn');
		}).bind('click', function() {
			//判断是否在游戏中
			if (hasStart) {
				if (!confirm('您已经在游戏中，确定要改变游戏难度么？')) {
					return false;
				} else {
					self.hasStart = false;
					self.btnStart.text('开始');
				}
			}
			//内容改变
			self.levelNow++;
			if (self.levelNow >= len) {
				self.levelNow = 0;
			}
			//显示的难度改变
			$(this).text(self.levelArr[self.levelNow][0] + 'x' + self.levelArr[self.levelNow][1]);
			//图片重新拆分(先重新计算宽高)
			self.cellWidth = self.imgWidth / self.levelArr[self.levelNow][1];
			self.cellHeight = self.imgHeight / self.levelArr[self.levelNow][0];
			self.imgSplit();
		});
	},

	/**
	 * [gameStart 开始/回复 游戏的函数]
	 * @return [无]
	 */
	gameState: function() {
		var self = this;

		this.btnStart.bind('mousedown', function() {
			$(this).addClass('mouseOn');
		}).bind('mouseup', function() {
			$(this).removeClass('mouseOn');
		}).bind('click', function() {
			if (self.hasStart == 0) { //不在游戏中
				//开始游戏后部分值、样式设置
				$(this).text('复原');
				self.hasStart = 1;

				//打乱图片
				self.randomArr();
				self.cellOrder(self.imgRandArr);

				//图片事件
				self.imgCells.css({
					//	'cursor':'pointer'

					//				}).bind('mouseover',function(){
					//					$(this).addClass('hover');
					//				}).bind('mouseout',function(){
					//					$(this).removeClass('hover');


				}).bind('click', function(e) {
					/*此处是图片移动*/
					$(this).css('cursor', 'move');
					var cellIndex = $(this).index();
					if (!clickend) {
						self.clickDoms1 = cellIndex;
						clickend = true;
					} else {
						clickend = false;;
						self.clickDoms2 = cellIndex;
						var cellIndex_1 = self.clickDoms1;
						var cellIndex_2 = self.clickDoms2;
						// alert(cellIndex_1+","+cellIndex_2);
						if (cellIndex_1 == cellIndex_2) {
							self.cellReturn(cellIndex_1);
						} else {
							self.cellExchange(cellIndex_1, cellIndex_2);
						}

					}

				}).bind('touchend', function() {
					$(this).css('cursor', 'pointer');
				});

			} else if (self.hasStart == 1) {
				if (!confirm('已经在游戏中，确定要回复原图？')) {
					return false;
				}
				//样式恢复
				$(this).text('开始');
				self.hasStart = 0;

				//复原图片
				self.cellOrder(self.imgOrigArr);

				//取消事件绑定
				self.imgCells.css('cursor', 'default').unbind('mouseover').unbind('mouseout').unbind('touchstart');
			}
		});
	},

	/**
	 * [randomArr 生成不重复的随机数组的函数]
	 * @return [无]
	 */
	randomArr: function() {
		//清空数组
		this.imgRandArr = [];

		var order; //记录随机数，记录图片放置在什么位置
		for (var i = 0, len = this.imgOrigArr.length; i < len; i++) {
			order = Math.floor(Math.random() * len);
			if (this.imgRandArr.length > 0) {
				while (jQuery.inArray(order, this.imgRandArr) > -1) {
					order = Math.floor(Math.random() * len);
				}
			}
			this.imgRandArr.push(order);
		}
		return;
	},

	/**
	 * [cellOrder 根据数组给图片排序的函数]
	 * @param  arr [用于排序的数组，可以是正序或乱序]
	 * @return     [无]
	 */
	cellOrder: function(arr) {
		for (var i = 0, len = arr.length; i < len; i++) {
			//   alert(this.levelArr[this.levelNow][0] +","+this.levelArr[this.levelNow][1]+","+arr[i]);

			this.imgCells.eq(i).animate({
				'left': arr[i] % this.levelArr[this.levelNow][1] * this.cellWidth + 'px',
				'top': Math.floor(arr[i] / this.levelArr[this.levelNow][1]) * this.cellHeight + 'px'
			}, this.moveTime);
		}
	},

	/**
	 * [cellChangeIndex 通过坐标，计算被交换的碎片下标]
	 * @param  x    [鼠标x坐标]
	 * @param  y    [鼠标y坐标]
	 * @param  orig [被拖动的碎片下标，防止不符合碎片交换条件时，原碎片返回]
	 * @return      [被交换节点在节点列表中的下标]
	 */
	cellChangeIndex: function(x, y, orig) {
		//鼠标拖动碎片移至大图片外
		if (x < 0 || x > this.imgWidth || y < 0 || y > this.imgHeight) {
			return orig;
		}
		//鼠标拖动碎片在大图范围内移动
		var row = Math.floor(y / this.cellHeight),
			col = Math.floor(x / this.cellWidth),
			location = row * this.levelArr[this.levelNow][1] + col;
		var i = 0,
			len = this.imgRandArr.length;
		while ((i < len) && (this.imgRandArr[i] != location)) {
			i++;
		}
		return i;
	},

	/**
	 * [cellExchange 两块图片碎片进行交换]
	 * @param  from [被拖动的碎片]
	 * @param  to   [被交换的碎片]
	 * @return      [交换结果，成功为true,失败为false]
	 */
	cellExchange: function(from, to) {
		var self = this;
		//被拖动图片、被交换图片所在行、

		var f_f = this.imgRandArr[from];
		var t_t = this.imgRandArr[to];

		var rowFrom = Math.floor(f_f / this.levelArr[this.levelNow][1]);
		var colFrom = f_f % this.levelArr[this.levelNow][1];
		var rowTo = Math.floor(t_t / this.levelArr[this.levelNow][1]);
		var colTo = t_t % this.levelArr[this.levelNow][1];

		// alert("f"+rowFrom+"_"+ colFrom+"t"+ rowTo+"_"+colTo );

		var temp = this.imgRandArr[from]; //被拖动图片下标，临时存储

		//被拖动图片变换位置
		this.imgCells.eq(from).animate({
			'top': rowTo * this.cellHeight + 'px',
			'left': colTo * this.cellWidth + 'px'
		}, this.moveTime, function() {
			$(this).css('z-index', '10');
			$(this).css('border-color', '#fff');
			$(this).css('border-width', '1px');
		});
		//表交换图片变换位置
		this.imgCells.eq(to).css('z-index', '30').animate({
			'top': rowFrom * this.cellHeight + 'px',
			'left': colFrom * this.cellWidth + 'px'
		}, this.moveTime, function() {
			$(this).css('z-index', '10');
			$(this).css('border-color', '#fff');
			$(this).css('border-width', '1px');
			huan_end = true;

			//两块图片交换存储数据
			self.imgRandArr[from] = self.imgRandArr[to];
			self.imgRandArr[to] = temp;

			//判断是否完成全部移动，可以结束游戏
			if (self.checkPass(self.imgOrigArr, self.imgRandArr)) {
				self.success();
			}
		});
	},

	/**
	 * [cellReturn 被拖动图片返回原位置的函数]
	 * @param  index [被拖动图片的下标]
	 * @return       [无]
	 */
	cellReturn: function(index) {
		var row = Math.floor(this.imgRandArr[index] / this.levelArr[this.levelNow][1]);
		var col = this.imgRandArr[index] % this.levelArr[this.levelNow][1];



		this.imgCells.eq(index).animate({
			'top': row * this.cellHeight + 'px',
			'left': col * this.cellWidth + 'px'
		}, 0, function() {
			$(this).css('z-index', '10');
			$(this).css('border-color', '#fff');
			$(this).css('border-width', '1px');

		});
	},

	/**
	 * [checkPass 判断游戏是否成功的函数]
	 * @param  rightArr  [正确排序的数组]
	 * @param  puzzleArr [拼图移动的数组]
	 * @return           [是否完成游戏的标记，是返回true，否返回false]
	 */
	checkPass: function(rightArr, puzzleArr) {
		if (rightArr.toString() == puzzleArr.toString()) {
			return true;
		}
		return false;
	},

	/**
	 * [success 成功完成游戏后的处理函数]
	 * @return [description]
	 */
	success: function() {
		this.hasStart = 0;
		//
		window.location.href = "http://www.webenergy.com.cn/demo/hna2014/weixin_61_demo/xuezhongfei/invitation.php?inid=201412181404052792&uid=18821188869"
	}
}
var id = Math.random();
/* 加入图片，运行代码 */
$(function() {



	if (id < 0.33) {
		var pg = new puzzleGame({
			'img': 'images/qq.jpg'
		});
		$(".q_img").attr('src', 'images/qq.jpg');

	} else if (id < 0.66) {
		var pg = new puzzleGame({
			'img': 'images/qq1.jpg'
		});
		$(".q_img").attr('src', 'images/qq1.jpg');

	} else {
		var pg = new puzzleGame({
			'img': 'images/qq2.jpg'
		});
		$(".q_img").attr('src', 'images/qq2.jpg');


	}



	$(".btn").click(function(e) {
		$(".q_img").show();
		setTimeout(function() {
			$(".q_img").hide();
		}, 2000)

	})
});