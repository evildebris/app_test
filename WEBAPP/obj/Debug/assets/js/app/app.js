/**
*   作者：廖偲
*   日期：2013.11
*   描述：公共函数或类
**/
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady(){
    navigator.splashscreen.hide();
    //注册后退按钮
    document.addEventListener("backbutton", function (e) {
        if(J.hasMenuOpen){
            J.Menu.hide();
        }else if(J.hasPopupOpen){
            J.closePopup();
        }else{
            var sectionId = $('section.active').attr('id');
            if(sectionId == 'index_section'){
                J.confirm('提示','是否退出程序？',function(){
                    navigator.app.exitApp();
                });
            }else{
                J.Router.back();
            }
        }
    }, false);
}

$('#btn_show_welcome').on('tap', J.showWelcome);
$('#section_container').on('pageinit','#refresh_section',function(){
    J.Refresh({
        selector : '#down_refresh_article',
        type : 'pullDown',
        pullText : '你敢往下拉么...',
        releaseText : '快松开的你的咸猪手！！',
        refreshTip : '使劲往下拽吧，亲',
        callback : function(){
            var scroll = this;
            setTimeout(function () {
                $('#down_refresh_article ul.list li').text('擦，我被更新了');
                scroll.refresh();
                J.showToast('更新成功','success');
            }, 2000);
        }
    });
//    最简约的调用方式
    J.Refresh( '#up_refresh_article','pullUp', function(){
        var scroll = this;
        setTimeout(function () {
            var html = '';
            for(var i=0;i<10;i++){
                html += '<li style="color:#E74C3C">我是被拉出来的...</li>'
            }
            $('#up_refresh_article ul.list').append(html);
            scroll.refresh();
            J.showToast('加载成功','success');
        }, 2000);
    })

});


$('#section_container').on('articleshow','#h_scroll_article',function(){
    J.Scroll('#h_scroll_demo',{hScroll:true,hScrollbar : false});
})
$('#section_container').on('pageload','#menu_section',function(){
    var asides = J.Page.loadContent('html/custom_aside.html');
    var $asides = $(asides);
    $('#aside_container').append($asides);
});
$('#btn_scan_barcode').on('tap',function(){
    window.plugins.barcodeScanner.scan('all',function(result) {
            if(!result.cancelled){
                J.alert('扫描结果：','结果：'+result.text+'<br>格式：'+result.format);
            }
        }, function(error) {
            J.showToast("扫描失败: " + error,'error');
        }
    );
})
$(function () {
    Jingle.launch({
        showPageLoading : true
    });
})



/**
*   组件绑定封装
*
*************************/

function Search_Control() { 
    

}

Search_Control.prototype = {
    startTime: null,
    endTime: null,
    region: null,
    faultType: null,
    _timeCompare: function () {
        if (this.startTime != null && this.endTime != null) {
            if ((Date.parse(this.startTime) - Date.parse(this.endTime)) <= 0)
                return true;
            else
                return false;
        }
        else if (this.startTime != null || this.endTime != null) {
            return true;
        }
        else {
            return false;
        }
    },
    startTime_popup_fun: function (click_tag, popup_tag, text_tag) {
        var info = this;
        $('#' + click_tag).tap(function () {
            J.popup({
                html: '<div id="' + popup_tag + '"></div>',
                pos: 'center',
                backgroundOpacity: 0.4,
                showCloseBtn: false,
                onShow: function () {
                    new J.Calendar('#' + popup_tag, {
                        date: new Date(),
                        onSelect: function (date) {
                            info.startTime = date;
                            if (info._timeCompare()) {
                                $('#' + text_tag + ' span').text(date);
                            }
                            J.closePopup();
                        }
                    });
                }
            });
        });
    },
    endTime_popup_fun: function (click_tag, popup_tag, text_tag) {
        var info = this;
        $('#' + click_tag).tap(function () {
            J.popup({
                html: '<div id="' + popup_tag + '"></div>',
                pos: 'center',
                backgroundOpacity: 0.4,
                showCloseBtn: false,
                onShow: function () {
                    new J.Calendar('#' + popup_tag, {
                        date: new Date(),
                        onSelect: function (date) {
                            J.showToast("1", 'success');
                            info.endTime = date;
                            var t = info._timeCompare();
                            J.showToast("compare:"+t, 'success');
                            if (info._timeCompare()) {
                                $('#' + text_tag + ' span').text(date);
                            }
                            J.closePopup();
                        }
                    });
                }
            });
        });
    }
};

/**
*日历
* @param click_tag绑定触发日历控件id
* @param popup_tag弹出日历控件名称
* @param text_tag日期显示的控件
**/
function calendar_popup_fun(click_tag, popup_tag, text_tag) {
    $('#' + click_tag).tap(function () {
        J.popup({
            html: '<div id="'+popup_tag+'"></div>',
            pos: 'center',
            backgroundOpacity: 0.4,
            showCloseBtn: false,
            onShow: function () {
                new J.Calendar('#' + popup_tag, {
                    date: new Date(),
                    onSelect: function (date) {
                        $('#' + text_tag + ' span').text(date);
                        J.closePopup();
                    }
                });
            }
        });
    });
}

/**
*
*
*
**/





/**
*   详细页面公共程序
*
*************************/

/**
*添加详情列表
* @param table_id 添加详情列表id
* @param section_id 当前详细页面的section id
* @param detail_page_id 绑定跳转页面section id(调用之前一定设置跳转路径)
**/

function Detail_List(table_id,section_id,detail_page_id) {
    this._table = table_id;
    this._section = section_id;
    this._detail_page_id = detail_page_id;
}

Detail_List.prototype = {
    _table: null,
    _section: null,
    _detail_page_id: null,
    _page: 0, //下滑刷新页数
    _size: 4, //添加更新数
    _result: null,
    CreateLi: function (ParentElement, itemStr, i) {
        var cre_li = document.createElement("li"); //创建ul
        cre_li.style.cssText = "width:100%;"; //设置style
        cre_li.setAttribute("data-icon", "next");
        cre_li.setAttribute("data-selected", "selected");

        var len = (this._result == null) ? 0 : this._result.length;
        len = len + i;
        cre_li.setAttribute("index", len);
        var items = "";
        items += '<i class="icon next"></i>' + itemStr;
        cre_li.innerHTML = items;
        ParentElement.appendChild(cre_li);
    },
    jump: function () {
        if (this._section != null && this._detail_page_id != null) {
            var sectionId = $('section.active').attr('id');
            if (sectionId == this._section) {
                J.Router.turnTo("#" + this._detail_page_id);
            }
        }
    },
    add: function (Scroll) {
        if (this._table != null && this.jump != null) {
            var ParentElement = document.getElementById(this._table);
            if (server) {
                var results = null;
                var table = this;

                if (!Scroll) {
                    $('.refresh-icon').removeClass('arrow-down-2').addClass('spinner');
                    $('.refresh-label').html("刷新中...");
                }

                server._scrollObject = this;

                server.successFunc = function (data) {
                    if (data == null && Scroll) { J.showToast("没有更多的信息！", 'success', 1000); Scroll.refresh(); table._page = table._page - 1; }
                    if (data) {
                        results = eval('(' + data + ')');
                        results = results.Table;

                        //创建数据
                        var len = results.length;
                        for (var i = 0; i < len; i++) {
                            table.CreateLi(ParentElement, GetListItemStr(results[i].id, results[i].eventtime, results[i].name, results[i].regionname, results[i].faulttypename), i);
                        }

                        //储存搜索结果
                        if (table._result === null)
                            table._result = results;
                        else {
                            for (var i = 0; i < len; i++) {
                                table._result.push(results[i]);
                            }
                        }

                        if (Scroll) {
                            Scroll.refresh();
                        }
                        else {
                            setTimeout(function () {
                                $('.refresh-icon').removeClass('spinner').addClass('arrow-down-2');
                                $('.refresh-label').html('加载更多信息');
                            }, 100);
                        }

                        $("#" + table._table + " li[data-icon='next']").tap(function () {
                            if (table._section != null && table._detail_page_id != null) {
                                var sectionId = $('section.active').attr('id');
                                var li = this;
                                $("#fault_id").attr("value", li.getAttribute("index"));
                                if (sectionId == table._section) {
                                    J.Router.turnTo("#" + table._detail_page_id);
                                }
                            }
                        });
                    }
                };
                server.errorFunc = function (msg) {
                    table._page = table._page - 1;
                    if (Scroll) {
                        Scroll.refresh();
                    }
                    else {
                        $('.refresh-icon').removeClass('spinner').addClass('arrow-down-2');
                        $('.refresh-label').html('加载更多信息');
                    }
                    J.showToast("网络连接失败！", 'error', 1000);

                };
                if (this._page == null || this._page < 0)
                    this._page = 0;
                if (this._size == null || this._size < 0)
                    this._size = 4;
                server._queryFaultBriefInfo(this._page * this._size, this._size);
                this._page = this._page + 1;

                //                for (var i = 0; i < 15; i++) {
                //                    this.CreateLi(ParentElement);
                //                }

                //                var section = this._section;
                //                var page = this._detail_page_id;
                //                $("#" + this._table + " li[data-icon='next']").tap(function () {
                //                    if (section != null && page != null) {
                //                        J.showToast("page:" + page, 'success', 1000);
                //                        var sectionId = $('section.active').attr('id');
                //                        if (sectionId == section) {
                //                            J.Router.turnTo("#" + page);
                //                        }
                //                    }
                //                });
            }
        }
    }
};
