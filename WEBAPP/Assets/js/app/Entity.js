/**
*   作者：廖偲
*   日期：2013.1.24
*   描述：Entity实体描述
**/

function Entity() {
    this.toString = function () { return "this is Entity class"; }
}


function FaultBreifInfo(_id, _faultid, _faulttypeid, _regionid, _eventtime, _MESSAGECONTENT) {
    this.id = _id;
    this.faultid = _faultid;
    this.faulttypeid = _faulttypeid;
    this.regionid = _regionid;
    this.eventtime = _eventtime;
    this.messagecontent = _MESSAGECONTENT;
    this.Init = function (table) {
        this.id = table.id;
        this.faultid = table.faultid;
        this.faulttypeid = table.faulttypeid;
        this.regionid = table.regionid;
        this.eventtime = table.eventtime;
        this.messagecontent = table.messagecontent;
    }
}
FaultBreifInfo.prototype = new Entity();

function User() {
    this.id = null;
    this.name = null;
    this.password = null;
    this.lastname = null;
    this.firstname = null;
    this.sex = null;
    this.role_id = null;
    this.create_time = null;
    this.mail = null;
    this.phone = null;
    this.mobile = null;
    this.state = null;
    this.department = null;
    this.city_id = null;
    this.create_user_id = null;
    this.last_modified_time = null;
    this.is_available = null;
    this.region_id = null;
    this.depart_id = null;
    this.is_admin = null;

    this.Init = function (table) {
        this.id = table.id;
        this.name = table.name;
        this.password = table.password;
        this.lastname = table.lastname;
        this.firstname = table.firstname;
        this.sex = table.sex;
        this.role_id = table.role_id;
        this.create_time = table.create_time;
        this.mail = table.mail;
        this.phone = table.phone;
        this.mobile = table.mobile;
        this.state = table.state;
        this.department = table.department;
        this.city_id = table.city_id;
        this.create_user_id = table.create_user_id;
        this.last_modified_time = table.last_modified_time;
        this.is_available = table.is_available;
        this.region_id = table.region_id;
        this.depart_id = table.depart_id;
        this.is_admin = table.is_admin;
    }
}
User.prototype = new Entity();

function Role() {
    this.id = null;
    this.name = null;
    this.description = null;
    this.create_user_id = null;
    this.create_time = null;
    this.last_modified_time = null;
    this.is_available = null;
    this.parent_id = null;
    this.operations_id = null;
    this.Init = function () {
        this.id = id;
        this.name = name;
        this.description = description;
        this.create_user_id = create_user_id;
        this.create_time = create_time;
        this.last_modified_time = last_modified_time;
        this.is_available = is_available;
        this.parent_id = parent_id;
        this.operations_id = operations_id;
    }
}

