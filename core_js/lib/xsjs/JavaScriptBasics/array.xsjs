function arrayBasics () {

	var body = "";
	var colors;
	
	var array_one = ["Red","Green","Blue"];
	var array_two = ["Black", "White", "Orange", "Purple"];
	
	body = "Complete Array: " + array_one + "</p>";
	body += "First Element: " + array_one[0] + "</p>";
	body += "Number of Elements: " + array_one.length + "</p>";
	body += "Position of Blue: " + array_one.indexOf("Blue")  + "</p>";
	body += "Loop of Elements: ";
	
	for (var i = 0; i < array_one.length; i++){
		body += " " + array_one[i];              
	}
	
	body += "</p> Combined Array: " +array_one.concat(array_two) + "</p>";
	body += "Reverse Sort: " + array_one.concat(array_two).reverse()+ "</p>";
	body += "Sort Ascending: " + array_one.concat(array_two).sort("ascending")+ "</p>";
	
	colors = array_one.concat(array_two); 
	colors.pop();
	body += "Remove the last element: " + colors   + "</p>";
	colors.shift();
	body += "Remove the first element: " + colors   + "</p>";
	var sliced_colors = colors.slice(2,4); 
	body += "Slice out the 3rd and 4th element: " + sliced_colors   + "</p>";	
	colors.splice(2,2,"Malachite","Fallow"); 
	body += "Add two values at postion 3: " + colors   + "</p>";
	
	colors.unshift("Brown"); 
	body += "Add element to the beginning of the array: " + colors   + "</p>";

	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";	
	$.response.setBody(body);                       
}

arrayBasics();  