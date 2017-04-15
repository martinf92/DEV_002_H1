sap.ui.define([
	"sap/ui/core/mvc/Controller"
],	function (Controller) {
		"use strict";
		return Controller.extend("mfr.app002.controller.Page001", {
	      
		onInit: function(){
			this.getView().addStyleClass("sapUiSizeCompact"); 
			
			var urlStockData = "/node/google_queries_live";
			sap.ui.getCore().getModel().setProperty("/mPath", urlStockData);
			sap.ui.getCore().getModel().setProperty("/mEntity", "/modelData");
	    },
	      
	    onGetGoogleQueries: function () {
	    	
	    	var url = sap.ui.getCore().getModel().getProperty("/mPath");
	    	var iptGoogleQuery = sap.ui.getCore().byId("__xmlview0--App002").byId("iptGoogleQuery").getValue();

	    	url = url	+ "/" + iptGoogleQuery + "/";
	    	
	    	jQuery.ajax({
	    		type : "GET",
                contentType : "application/json",
                url : url,
                dataType : "json",
                success : this.getView().getController()._buildGoogleQueriesTable
	    	});   
	    },
	    
	    _buildGoogleQueriesTable: function (data) {
	        
	        var mEntity = sap.ui.getCore().getModel().getProperty("/mEntity");
	        
	        var oTable = sap.ui.getCore().byId("__xmlview0--App002").byId("tblGoogleQueries");
			oTable.removeAllColumns();
			oTable.removeAllItems();
			
			var columnList = new sap.m.ColumnListItem();
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({modelData: data.default.rankedList[0].rankedKeyword});
			
			var oMeta = Object.keys(JSON.parse(oModel.getJSON()).modelData[0]);
		
			if (!oMeta) {
				sap.m.MessageBox.show("Bad Service Definition ", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
			} else {
				//Table Column Definitions
				for (var i = 0; i < oMeta.length; i++) {
					var property = oMeta[i];
					
					oTable.addColumn(
						new sap.m.Column({
							header: new sap.m.Label({
								text: property
							})
						})
					);
					
					
					columnList.addCell(
						new sap.m.Text({
							text: {
								path: property
							},
							name: property
						})
					);
					
				}
				oTable.setModel(oModel);
			}	
			
			oTable.bindItems({
				path: mEntity,
				template: columnList
			});
		}
	    
   });
});