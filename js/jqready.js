var path1 = "html/basics/"

var jqready = function () {

  var highlight = function() {
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});	  
  }
  
  function newHandler(func, str) {
	  func = function() {
		$.get(path1 + str + ".html", function( data ) {
		  $("#div9").html(data)
		
		  highlight() 
	    });	 	  
	  }
	
	  return func
  }
   
  var f; //handler function

  var routes = {
	'/overview': newHandler(f, "overview"),  
	'/import': newHandler(f, "import"),
	'/accessing': newHandler(f, "accessing"),
	'/retrieving': newHandler(f, "retrieving"),
	'/fetch': newHandler(f, "fetch"),
	'/scan': newHandler(f, "scan"),
	'/prepare': newHandler(f, "prepare"),
	'/singlerow': newHandler(f, "singlerow"),
	'/modifying': newHandler(f, "modifying"),
	'/txn': newHandler(f, "txn"),
	'/prepared': newHandler(f, "prepared"),
	'/errors': newHandler(f, "errors"),
	'/null': newHandler(f, "null"),
	'/varcols': newHandler(f, "varcols"),
	'/connectionpool': newHandler(f, "connectionpool"),
	'/surprise': newHandler(f, "surprise"),
	'/resources': newHandler(f, "resources")
  }
  
  var router = Router(routes);
  router.init();  
  
  divH = newHandler(f, "overview") //default href link
  divH() //call function to populate home page

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  
}