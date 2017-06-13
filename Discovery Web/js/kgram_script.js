var g_result;

function KGramSearch(){
	var uri1 = document.getElementById('txt_uri_1').value;
	var uri2 = document.getElementById('txt_uri_2').value;

	console.log("URI1");
	console.log(uri1);
	console.log("URI2");
	console.log(uri2);

	uri1 = "http://dbpedia.org/resource/Leonardo_DiCaprio";
	uri2 = "http://dbpedia.org/resource/Tom_Hanks";

	var query = _createQueryGetPath(uri1, uri2);
	console.log("Query get Path");
	console.log(query);

	g_result = document.getElementById("results");

	g_result.innerHTML = "<div>Running...</div>"

	getDataPath(uri1, uri2);
}


function _createQueryGetPath(uri1, uri2){
	var query = 
		"SELECT DISTINCT ?x ?degree WHERE {\
			<" + uri2 + ">(<dbpedia-owl:wikiPageWikiLink> |^(<dbpedia-owl:wikiPageWikiLink>)) + ?x \
			{?x <dbpedia-owl:wikiPageWikiLink> <" + uri1 +"> } \
			UNION \
				{ <" + uri1 + "> \
				<dbpedia-owl:wikiPageWikiLink> ?x } \
			FILTER (!isLiteral(?x)) } \
			PRAGMA {kg:path kg:expand 2}";
	return query;
}

function getDataPath(uri1, uri2){

	var data = $.param({ 'nodes[]': [uri1, uri2] }, true);
	console.log(data);


	$.ajax({
		type:       "POST",
        url:        "http://semreco.inria.fr/hub/search/graph",
        dataType:   "json",
        data: 		data,
        success:    function(data){
            console.log(data);
            showDataToView(data);
        },
        error:      function(message){
            console.log("Error importNeighborhood: " + message);
        }
	});
}

function showDataToView(data){
	g_result.innerHTML += "<div><br>DONE</div>";
	g_result.innerHTML += '<br><br>';

	g_result.innerHTML += "<table class='table table-hover'> \
						    <thead> \
						      <tr> \
						        <th>x</th> \
						        <th>y</th> \
						        <th>z</th> \
						      </tr> \
						    </thead> \
						    <tbody> \
						      <tr> \
						        <td> John</td> \
						        <td>Doe</td> \
						        <td>john@example.com</td> \
						      </tr> \
						      <tr> \
						        <td>Mary</td> \
						        <td>Moe</td> \
						        <td>mary@example.com</td> \
						      </tr> \
						      <tr> \
						        <td>July</td> \
						        <td>Dooley</td> \
						        <td>july@example.com</td> \
						      </tr> \
						    </tbody> \
						  </table>";

	for(var i = 0; i < data.length; i++){
		if( i == 0){
			g_result.innerHTML += "<table class='table table-hover'>";
			g_result.innerHTML += 	"<thead> \
							      		<tr> \
							        		<th>x</th> \
							        		<th>y</th> \
							        		<th>z</th> \
							      		</tr> \
							    	</thead>";
			g_result.innerHTML += "<tbody>";
		}
		g_result.innerHTML += "<tr> \
						        <td> " + data[i].x.value + "</td> \
						        <td> " + data[i].y.value + "</td> \
						        <td> " + data[i].z.value + "</td> \
						      </tr>";

		if(i + 1 == data.length){
			g_result.innerHTML += "</tbody>";
			g_result.innerHTML += "</table>";
		}
	}
}