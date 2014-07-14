/**
*   作者：廖偲
*   日期：2013.12.9
*   描述：InformationPlatform页面的后台处理事件
**/
function add(ParentElement) {
    for (var i = 0; i < 15; i++) {
        CreateLi(ParentElement);
    }
    $("#fault_table li[data-icon='next']").tap(GoDetail);
}

function GoDetail() {
    var sectionId = $('section.active').attr('id');
    if (sectionId == 'InformationPlatform') {
        J.Router.turnTo("#GZ_Detail");
    }
}
 
function CreateLi(ParentElement) {

    var cre_li = document.createElement("li"); //创建ul
    cre_li.style.cssText = "width:100%;"; //设置style
    cre_li.setAttribute("data-icon", "next");
    cre_li.setAttribute("data-selected", "selected");
    var items = "";
    items += '<i class="icon next"></i>' + GetListItemStr("青羊区故障分布", "2013-07-22", 'administrator', '成都、绵阳', '弱覆盖');
    cre_li.innerHTML = items;
    ParentElement.appendChild(cre_li);
}

function GetListItemStr(title,time,usr,location,type){
    if(time==null) time="";
    if(usr==null) usr="";
    if(location==null) location="";
    if (type == null) type = "";
    if (title == null) title = "";
    var item="";
    item +='<div class="tag">'+time+'</div>';
     item +='<div class="right-bottom-tag">'+usr+'</div>';
     item += '<strong>' + title + '</strong>';
     item += '<p><span class="type">' + type + '</span>';
    item += '<p> <span class="label">' + location + '</span></p>';

    return item;
}

function CreateA(ParentElement) {
    var cre_a = document.createElement("a"); //生成li
    cre_a.href = "#";
    //cre_li.setAttribute("data-target", "section");
    //cre_a.style.cssText = "width: 700px;border-radius: 1;"; //设置style
    cre_a.innerText = 'XXX';
    ParentElement.appendChild(cre_a);
}

function changeActive1() {
    var classAttr = $("#title2").attr("class");
    if (classAttr!=null&&classAttr.indexOf("active") != -1) {
        $("#title2").removeClass("active");
        $("#title1").addClass("active");
    }
}

function changeActive2() {
    var classAttr = $("#title1").attr("class");
    if (classAttr!=null&& classAttr.indexOf("active") != -1) {
        $("#title1").removeClass("active");
        $("#title2").addClass("active");
    }
}

function ChangeTime() {
    var classAttr = $("#time_scheduling").attr("class");
    if (classAttr.indexOf("active") != -1) {
        var icon = $("#time_scheduling").children('i.icon').attr("class");
        if (icon.indexOf("arrow-down") != -1)
            icon = "arrow-up";
        else
            icon = "arrow-down";
        $("#time_scheduling").children('i.icon').attr('class','icon '+icon);
    }
}

//页面切换
$('#section_container').on('articleshow', '#screen_info', function () {
    $("#secondary_title").attr("display", "none");
})
$('#section_container').on('articleshow', '#info_release_article', function () {
    $("#secondary_title").attr("display", "");
})

$('#section_container').on('pageinit', '#InformationPlatform', function () {
    var table = document.getElementById("fault_table");
    add(table);

    J.settings.remotePage.GZ_Detail = "html/InfoDiffusion/GZ_Detail.html";
    //初始化事件绑定
    $("#time_scheduling").tap(ChangeTime);
    $("#title1").tap(changeActive1);
    $("#title2").tap(changeActive2);
    $('#select_type_id').tap(select_type_fun);
    $('#search_btn').tap(search_btn_click);
    calendar_popup_fun("click_start_time", "popup_time_calendar", "start_time");
    calendar_popup_fun("click_end_time", "popup_end_calendar", "end_time");

    J.Refresh({
        selector: '#info_release_article',
        type: 'pullUp',
        pullText: '加载更多信息',
        releaseText: '松开加载信息！',
        callback: function () {
            var scroll = this;
            setTimeout(function () {
                //var html = '';  
                var cre_ul = document.createElement("div"); //创建ul
                add(cre_ul);
                $('#info_release_table ul.list').append(cre_ul.innerHTML.toString());
                scroll.refresh();
                $("#fault_table li[data-icon='next']").tap(GoDetail);
                J.showToast('加载成功', 'success');
            }, 2000);
        }
    });
});



var _init_icon = function (el) {
    var $el = $(el), $icon = $el.children('i.icon'), icon = $el.data('icon');
    if ($icon.length > 0) {//已经初始化，就更新icon
        $icon.attr('class', 'icon ' + icon);
    } else {
        $el.prepend('<i class="icon ' + icon + '"></i>');
    }

}

function type_info() {
    return [{
        text: '公告',
        handler: function () {
            change_type_item("公告");
        }
    }, {
        text: '弱覆盖',
        handler: function () {
            change_type_item("弱覆盖");
        }
    }, {
        text: '2G/3G',
        handler: function () {
            change_type_item("2G/3G");
        }
    }
        ];
}

function change_type_item(text) {

    $("#select_type").text(text);
    $(".selected").removeClass();
    $("button[name$='" + text + "']").addClass("selected");
    J.Popup.close();
}

function search_btn_click() {
    $("#search_tab").removeClass();
    $("#time_scheduling").addClass("active");
}

function select_type_fun() {
    var buttons = type_info();
    var markup = '<div class="blue-select" style="padding:0;">';
    $.each(buttons, function (i, n) {
        var type = "";
        if (n.text == $("#select_type").text())
            type = 'class="selected"';
        markup += '<button ' + type + ' name="' + n.text + '">' + n.text + '</button>';
    });
    markup += '</div>';
    J.popup({
        html: markup,
        showCloseBtn: false,
        pos: 'center',
        onShow: function () {
            $(this).find('button').each(function (i, button) {
                $(button).on('tap', function () {
                    if (buttons[i] && buttons[i].handler) {
                        buttons[i].handler.call(button);
                    }
                    hide();
                });
            });
        }
    })
}

//$('#section_container').on('articleshow', '#info_release_article', function () {
//    J.Scroll('#info_release_table', { hScroll: true, hScrollbar: false
//        //                    ,onScrollMove: function () {
//        //                        var header = document.getElementById("fault_table_header");
//        //                        var article = document.getElementById("info_release_article");
//        //                        var top = this.scroller.top;
//        //                        J.showToast("scroller:" + this.scroller.top, "info");
//        //                        header.style.top = top;
//        //                    }
//    });
//})

