/**
*   作者：廖偲
*   日期：2013.12.9
*   描述：页面的后台处理事件
**/


function GoDetail() {
    var sectionId = $('section.active').attr('id');
    if (sectionId == 'InformationPlatform') {
        J.Router.turnTo("#GZ_Detail");
    }
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
     item +=  '<strong>' +"故障ID:"+ title + '</strong>';
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
        if (icon.indexOf("arrow-down") != -1) {
            icon = "arrow-up";
            search_info.faultSequence = "desc";
        }
        else {
            icon = "arrow-down";
            search_info.faultSequence = "asc";
        }
        $("#time_scheduling").children('i.icon').attr('class', 'icon ' + icon);
    }

    
}

////PageControl
//function PageControl(pageid) {
//    this.PageId = pageid;
//}

//PageControl.prototype = {
//    PageId: null,
//    DetaulPageId:null,
//    SectionId: null,
//    PageToolkit: {
//        time_scheduling_id:null,
//        fault_table_id:null,
//        second_title1_id:null,
//        second_title2_id: null,
//        select_type_id: null,
//        search_btn_id:null

//    },
//    PageInit: function () {
//        

//    }
//};

//页面切换
$('#section_container').on('articleshow', '#screen_info', function () {
    $("#secondary_title").attr("display", "none");
})
$('#section_container').on('articleshow', '#info_release_article', function () {
    $("#secondary_title").attr("display", "");
})

/**
*   信息发布台
*   页面后处理
*************************/
var info_list = null;
var search_info = null;


$('#section_container').on('pageinit', '#InformationPlatform', function () {

    setTimeout(function () {
        $('.refresh-icon').removeClass('arrow-down-2').addClass('spinner');
        $('.refresh-label').html("刷新中...");
    }, 0);

    J.settings.remotePage.GZ_Detail = "html/InfoDiffusion/GZ_Detail.html";
    info_list = new Detail_List("fault_table", "InformationPlatform", "GZ_Detail");
    info_list.add();
    //    $("#fault_table li[data-icon='next']").tap(GoDetail);

    //初始化事件绑定
    $("#time_scheduling").tap(ChangeTime);
    $("#title1").tap(changeActive1);
    $("#title2").tap(changeActive2);
    $('#select_type_id').tap(select_type_fun);
    $('#search_btn').tap(function () {
        $("#search_tab").removeClass();
        $("#time_scheduling").addClass("active");
        $("#fault_table").html("");
        var type = faultType.selectData.GetStr();
        var regionname = region.selectData.GetStr();
        var startTime = $("#start_time span").text();
        var endTime = $("#end_time span").text();
        var _QueryStr = "";
        if (type == "" && regionname == "" && (startTime == "开始时间" || endTime == "结束时间")) {
            server.isQuery = false;
        }
        else {
            server.isQuery = true;
            _QueryStr = 'key:type|val:' + type + '|key:region|val:' + regionname
                            + '|key:startTime|val:' + startTime + '|key:endTime|val:' + endTime;
        }

        server.QueryStr = _QueryStr;
        info_list.clear();
        setTimeout(function () {
            $('.refresh-icon').removeClass('arrow-down-2').addClass('spinner');
            $('.refresh-label').html("刷新中...");
        }, 0);
        info_list.add();
    });
    $('#select_region_id').tap(TurntoRegion);

    search_info.startTime_popup_fun("click_start_time", "popup_time_calendar", "start_time");
    search_info.endTime_popup_fun("click_end_time", "popup_end_calendar", "end_time");

    J.Refresh({
        selector: '#info_release_article',
        type: 'pullUp',
        pullText: '加载更多信息',
        releaseText: '松开加载信息！',
        callback: function () {
            var scroll = this;
            info_list.add(scroll);
        }
    });

});

//页面加载 section页面加载该页时绑定时间
$('#section_container').on('pageshow', '#GZ_Detail', function () {
    var id = $("#fault_id").attr("value");

    if (info_list != null && info_list._result != null) {
        $("#select_center").text(info_list._result[id].faulttypename);
        $('#Select_Region').text(info_list._result[id].regionname);
        $('#text_calendar').text(info_list._result[id].eventtime);
        if (info_list._result[id].ismajor == 1)
            $('#GZ_IsMajor').addClass("active");
        else
            $('#GZ_IsMajor').removeClass("active");
        if (info_list._result[id].isvoice == 1)
            $('#GZ_IsVoice').addClass("active");
        else
            $('#GZ_IsVoice').removeClass("active");

        var status = "";
        switch (info_list._result[id].ismajor) {
            case '0':
                status = "全部正在发送(初始状态)";
                break;
            case '1':
                status = "部分发送成功";
                break;
            case '2':
                status = "全部发送成功";
                break;
            case '3':
                status = "全部发送失败";
                break;
            default:
                break;
        }
        $('#SMS_Status').text(status);
        $('#GZ_Name').text(info_list._result[id].operateusername);
        $('#GZ_Info').text(info_list._result[id].messagecontent);
    }
    //    var dat = new Date();
    //    $("#text_calendar span").text(dat.getFullYear().toString() + '-' + (dat.getMonth() + 1) + '-' + dat.getDate());
    //    $('#select_center_id').tap(select_fun);
    //    calendar_popup_fun("btn_popup_calendar", "popup_calendar", "text_calendar");
});

// 查询故障类型加载
$('#section_container').on('pageinit', '#TypeList', function () {
    faultType.text = "select_type";
    if (faultType.faultTypeTable == null) {
        faultType.QueryType();
    }
    faultType.ListId = "type_list";
    if (!faultType.SetTypeList()) {
        J.showMask('正在加载');
    }
});

$('#section_container').on('pageshow', '#TypeList', function () {


});

// 查询地区加载
$('#section_container').on('pageinit', '#RegionList', function () {
    region.text = "info_region";
    if (region.regionTable == null) {
        region.QueryRegion();
    }
    region.ListId = "region_list";
    if (!region.SetRegionList()) {       
        J.showMask('正在加载');
    }
});

$('#section_container').on('pageshow', '#RegionList', function () {


});
var _init_icon = function (el) {
    var $el = $(el), $icon = $el.children('i.icon'), icon = $el.data('icon');
    if ($icon.length > 0) {//已经初始化，就更新icon
        $icon.attr('class', 'icon ' + icon);
    } else {
        $el.prepend('<i class="icon ' + icon + '"></i>');
    }

}

function TurntoRegion() {
    J.Router.turnTo("#RegionList");
}

function type_info() {
    var temp = null;

    if (faultType == null || faultType.faultTypeTable == null) {
        if (!faultType) {
            temp = new FaultType();
            faultType = temp;
        }
        else {
            temp = faultType;
            temp.QueryType();
        }
    }
    else
        temp = faultType;

    if (temp.faultTypeTable == null)
        return [{
            text: '公告'
        }, {
            text: '弱覆盖'
        }, {
            text: '2G/3G'
        }
        ];
    else
        return temp.GetStringArray();
}

function change_type_item(text) {
    $("#select_type").text(text);
    $(".selected").attr('class', 'button');
    $("button[name$='" + text + "']").attr('class', 'button selected');
    J.Popup.close();

}

function search_btn_click() {
    $("#search_tab").removeClass();
    $("#time_scheduling").addClass("active");
    $("#fault_table").html("");
    J.showToast("1","info");
    var type = $("#select_type").text();
    var region = $("#info_region").text();
    var startTime = $("#start_time span").text();
    var endTime = $("#end_time span").text();
    var _QueryStr =""
    if(type=="无"&&region=="无"&&(startTime=="开始时间"||endTime==结束时间)){
        server.isQuery = false;
    }
    else{
        var isfirst = true;
        _QueryStr ="where ";
        if(type!="无"){
            if(isfirst){
                isfirst = false;
            }
            _QueryStr+='faulttypename in("'+type+'") ';
        }
        if(region!="无"){
            if(isfirst){
                isfirst = false;
                _QueryStr+='regionname in("'+region+'") ';
            }
            else
                _QueryStr+='and regionname in("'+region+'") ';
        }
        if(startTime!="开始时间"&&endTime!=结束时间){
            if(isfirst){
                isfirst = false;
                _QueryStr+='eventtime between "'+startTime+'" and "'+endTime+'"';
            }
            else
                 _QueryStr+='and eventtime between "'+startTime+'" and "'+endTime+'"';
        }
    }
    server.isQuery = true;
    server.QueryStr = _QueryStr;
    server._queryFaultBriefInfo();
}

function select_type_fun() {
//    var buttons = type_info();
//    if (!buttons)
//        return;
//    var markup = '<div id="select_type" class="blue-select active" data-scroll="true" style="padding:0;">';
//    $.each(buttons, function (i, n) {
//        var type = 'class="button"';
//        if (n.text == $("#select_type").text())
//            type = 'class="bytton selected"';
//        markup += '<a ' + type + ' name="' + n.text + '">' + n.text + '</a>';
//    });
//    markup += '</div>';
    J.Router.turnTo("#TypeList");
//    setTimeout(function () {
//        J.popup({
//            html: markup,
//            showCloseBtn: false,
//            pos: 'center',
//            animation: true,
//            onShow: function () {

//                $(this).find('a').each(function (i, button) {
//                    $(button).on('tap', function () {
//                        //                                        if (buttons[i] && buttons[i].handler) {
//                        //                                            buttons[i].handler.call(button);
//                        //                                        }
//                        change_type_item(buttons[i].text);
//                        hide();
//                    });
//                });
//            }
//        });
//    }, 0);
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

/**
*   历史记录页面初始化
**/

$('#section_container').on('pageinit', '#History_Record', function () {
    J.settings.remotePage.History_Detail = "html/HistoryRecord/History_Record.html";
    var info_list = new Detail_List("fault_table_record", "History_Record", "History_Detail");
    info_list.add();
    //    $("#fault_table li[data-icon='next']").tap(GoDetail);

    //初始化事件绑定
    $("#time_scheduling_record").tap(ChangeTime, "time_scheduling_record");
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
                info_list.add();
                scroll.refresh();
                J.showToast('加载成功', 'success');
            }, 2000);
        }
    });
});