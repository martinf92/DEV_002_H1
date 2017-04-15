
function objectsBasics(){

	var body  = "";
	
	body += '<b> Colors </b> </p>';
	
	var colors = {
		red:"#FF0000", 
		green:"#00FF00", 
		blue:"#0000FF",
		
		favoriteColor : function(){
			var now = new Date();
			if(now.getDay() === 1){
				return this.blue;
			}else{
				return this.red;
			}
		}
	};
	
	body += '<span style="color:'+ colors.red +'">Red</span></p>';
	body += '<span style="color:'+ colors.green +'">Green</span></p>';
	body += '<span style="color:'+ colors.blue +'">Blue</span></p>';
	body += '<span style="color:'+ colors.favoriteColor() +'">Favorite Color</span></p>';

	var value1 = 'First Value';
	var value2 = value1;
	value1 = 'New Value';
	
	body += 'Value 1: ' + value1 + '</p>';
	body += 'Value 2: ' + value2 + '</p>';
	
	var value3 = {val: 'First Value'};
	var value4 = value3;
	value3.val = 'New Value';
	
	body += 'Value 3: ' + value3.val  + '</p>';
	body += 'Value 4: ' + value4.val + '</p>';

	function purchaseOrder(purchaseOrderID){
		var query;
		var pstmt;
		var rs;
		var conn = $.db.getConnection();
		
		query = 'SELECT * FROM "PO.Header" WHERE PURCHASEORDERID = ?';
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, purchaseOrderID);
		
		rs = pstmt.executeQuery();
		
		while (rs.next()) {
			this.purchaseOrderID = rs.getString(1);
			this.grossAmount = rs.getDecimal(9);
		}
		
		rs.close();
		pstmt.close();
		
		this.discount = function(){
			return (this.grossAmount - this.grossAmount * '.10');
		};
		
	}
	
	var po = new purchaseOrder('300000000');
	body +=  'Purchase Order: ' + po.purchaseOrderID + ' Gross Amount: '+ po.grossAmount + ' Discount Amount: '+ po.discount() +'</p>';
	
	po = new purchaseOrder('300000001');
	body +=  'Purchase Order: ' + po.purchaseOrderID + ' Gross Amount: '+ po.grossAmount + ' Discount Amount: '+ po.discount() +'</p>';
	
	

	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";	
	$.response.setBody(body);   
	
}

objectsBasics();  

                     