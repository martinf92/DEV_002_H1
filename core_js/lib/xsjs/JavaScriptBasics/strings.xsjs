function stringsBasic(){
	var body = '';
	var string1 = 'SAP HANA Extended Application Services';
	
	body = string1 + " </p>";
	body = body + "The first character in the string: " + string1[0] + "</p>"; 
	body = body + "The length of the string: " + string1.length + "</p>";
	body = body + "The last character in the string: " + string1[(string1.length - 1)] + "</p>"; 
	body = body + "Upper: " + string1.toUpperCase() + "</p>";
	body = body + "Lower: " + string1.toLowerCase() + "</p>";
	body = body + "Find HANA: " + string1.search("HANA") + "</p>";
	body = body + "Find Last occurance of the letter A: " + string1.lastIndexOf("A") + "</p>";
	body = body + "Replace with XS: " + string1.replace("Extended Application Services" , "XS");
	
	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";
	$.response.setBody(body);
}

stringsBasic();