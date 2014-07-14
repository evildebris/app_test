/**
*   作者：廖偲
*   日期：2013.12.16
*   描述：server处理后台与服务调用js程序
**/

function Server(IP) {
    if(IP!=null)
        this.ip = IP;
    this.ajaxFuncName = "";
}

Server.prototype = {
    ip: "http://192.168.0.20:4503/DataService/",
    ajaxFuncName: null,
    _data: null,
    _type: "post",
    isQuery: false,
    QueryStr: null,
    successFunc: function (data) {
        if (data) {
            if (data.d)
                J.showToast(eval(data.d), 'success');

            else
                J.showToast(data, 'success');
        }
        else J.showToast("没有更多的数据！", 'success');
    },
    errorFunc: function (msg) {
        J.showToast("err:" + msg.responseText, 'error');
    },
    _queryFaultBriefInfo: function (skip, size) {
        if (!this.isQuery) {
            this._data = '{"sqlId":"GetFaultBriefInfo","paraStr":"key:skip|val:' + skip + '|key:size|val:' + size + '"}';
        }
        else {
            this._data = '{"sqlId":"QueryFaultBriefInfo","paraStr":"key:skip|val:' + skip + '|key:size|val:' + size + '|' + this.QueryStr + '"}';
        }
        this.ajaxRequest("GetJsonData");
    },
    _queryFaultType: function () {
        this._data = '{"sqlId":"GetMainFaultTypeResource"}';
        this.ajaxRequest('GetJsonData2');
    },
    _queryRegion: function () {
        this._data = '{"sqlId":"GetFaultRegionResource"}';
        this.ajaxRequest('GetJsonData2');
    },
    addData: function (data) {
        this._data = data;
    },
    clearData: function () {
        this._data = null;
    },
    ajaxRequest: function (funcName) {
        this.ajaxFuncName = null;
        if (funcName != null && funcName != "")
            this.ajaxFuncName = funcName;
        else
            return;

        $.ajax({
            url: this.ip + this.ajaxFuncName,
            dataType: 'json',
            timeout: 10000,
            contentType: 'text/json',
            data: this._data,
            type: this._type, //注意是Get方式，服务端对应着WebGet（）                
            success: this.successFunc,
            error: this.errorFunc
        });
    }
};

var server = new Server(null);