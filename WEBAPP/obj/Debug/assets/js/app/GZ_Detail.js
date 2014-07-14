/**
*   作者：廖偲
*   日期：2013.12.16
*   描述：GZ_Detail页面的后台处理事件
**/

function button_info() {
    return [{
        text: '公告',
        handler: function () {
            change_item("公告");
        }
    }, {
        text: '弱覆盖',
        handler: function () {
            change_item("弱覆盖");
        }
    }, {
        text: '2G/3G',
        handler: function () {
            change_item("2G/3G");
        }
    }
        ];
}

function change_item(text) {

    $("#select_center").text(text);
    $(".selected").removeClass();
    $("button[name$='" + text + "']").addClass("selected");
    setTimeout(function () { J.Popup.close(); }, 100);
}

function select_fun() {
    var buttons = button_info();
    var markup = '<div class="blue-select" style="padding:0;">';
    $.each(buttons, function (i, n) {
        var type = "";
        if (n.text == $("#select_center").text())
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


