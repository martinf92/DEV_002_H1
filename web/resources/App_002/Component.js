sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";
 
	return UIComponent.extend("mfr.app002.Component", {
 
		metadata : {
			manifest: "json"
		},
 
		init : function () {
			
			var model = new JSONModel({});
			sap.ui.getCore().setModel(model);
		
			sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		}
	});
 
});