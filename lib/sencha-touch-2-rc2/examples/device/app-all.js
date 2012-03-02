/*
Copyright(c) 2011 Company Name
*/
Ext.application({name:"Device",requires:["Ext.device.*"],stores:["Images"],views:["Main","Camera","Connection","Notification","Orientation"],controllers:["Application","Camera","Notification","Connection"],launch:function(){Ext.create("Device.view.Main")}});
