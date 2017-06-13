const THRESHOD = 0.01;
const MAX_PULSE = 1;
const LIMIT_IMPORT = 350;
const DBPEDIA_TEST_URL = "http://dbpedia-test.inria.fr/sparql?default-graph-uri=&query=";
const RESULT_RETURN_TYPE = "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
const ORIGIN_NEIGHBORHOOD = 1;
const NODE_NEIGHBORHOOD = 2;

var g_activationHashMap = [];
var g_arr_CPD = [];
var g_origin = "";
var g_map_neighborhood = [];
var g_result;

function EXSearch(){
	var uri = document.getElementById('txt_uri').value;
    g_result = document.getElementById("results");
    g_origin = uri;
	g_activationHashMap.push({
        uri:    g_origin,
        act:    1.0
    });
    g_result.innerHTML = "<div>Running...</div>"
	getClassPropagationDomain(g_origin);
}

function getClassPropagationDomain(origin){
    var url = _createUrlGetClassPropagation(origin);
    console.log("URL: " + url);
    $.ajax({
    	type: 		"GET",
    	url: 		url,
    	dataType: 	"json",
    	success: 	function(data){
            _parseClassPropagationDomain(data);
    	},
    	error: 		function(message){
    		console.log("Error getClassPropagationDomain: " + message);
    	}
    });
}

function _createUrlGetClassPropagation(origin){
    var query = "prefix dbpedia-owl: <http://dbpedia.org/ontology/> " +
                "select distinct ?t ( count (?t) as ?tcount ) where {" +
                    "{<" + origin + "> ?y ?z . ?z rdf:type ?t}" +
                    "UNION" +
                    "{?z ?y <" + origin +"> . ?z rdf:type ?t}" +
                    "filter ( regex (?t ,\"http://dbpedia.org/ontology\"))" +
                    "filter (?y != <dbpedia-owl:wikiPageRedirects>" +
                            "&& ?y != <dbpedia-owl:wikiPageDisambiguates>)" +
                "}" +
                "group by ?t ";
    console.log("Query get CPD");
    console.log(query);
    var url = DBPEDIA_TEST_URL + encodeURIComponent(query) + RESULT_RETURN_TYPE;
    return url;
}

function _parseClassPropagationDomain(data){
    var sum_type = 0;
    var map_type = [];
    var map_context = [
        "http://dbpedia.org/ontology/Song",
        "http://dbpedia.org/ontology/Film",
        "http://dbpedia.org/ontology/Band",
        "http://dbpedia.org/ontology/Album",
        "http://dbpedia.org/ontology/MusicalArtist",
        "http://dbpedia.org/ontology/MusicGenre",
        "http://dbpedia.org/ontology/Actor",
        "http://dbpedia.org/ontology/Person"
    ];

    if(data.results.bindings != undefined){
        var arr_types = data.results.bindings;
        for(var i = 0; i < arr_types.length; i++){
            var type = arr_types[i].t.value;
            var count = parseInt(arr_types[i].tcount.value);
            map_type[type] = count;
            sum_type += count;
        }
        for(var type in map_type){
            if(map_context.indexOf(type) != -1 && map_type[type]/sum_type >= THRESHOD){
                g_arr_CPD.push(type);
            }
        }
        console.log("CPD la: ");
        console.log(g_arr_CPD);

        //////////////////////////////
        g_arr_CPD = map_context;
        importNeighborhood(g_origin, ORIGIN_NEIGHBORHOOD);
    }
}

function importNeighborhood(node, status){
    var url = _createUrlGetNeighborhood(node);
    console.log("URL: " + url);
    $.ajax({
        type:       "GET",
        url:        url,
        dataType:   "json",
        node:       node,
        status:     status,
        success:    function(data){
            _parseImportNeighborhood(this.node, data, this.status);
        },
        error:      function(message){
            console.log("Error importNeighborhood: " + message);
        }
    });
}

function _createUrlGetNeighborhood(node){
    var filter = _createFilterClassDomain();
    var query = "select distinct ?x1 ?y1 ?k1 count(?prop) as ?count " + 
                "where { " + 
                    "?x1 ?p1 ?y1 . " + 
                    "filter (!isLiteral (?y1) && " + 
                    "?p1 != rdf:type && " + 
                    "?p1 != owl:sameAs && " + 
                    "?p1 != <dbpedia-owl:wikiPageInterLanguageLink> && " + 
                    "?p1 != <dbpedia-owl:wikiPageRedirects> && " + 
                    "?p1!= <dbpedia-owl:wikiPageDisambiguates>) " + 
                    "OPTIONAL {?y1 rdf:type ?k1} " + 
                    "filter ( ?x1 = <" + node + "> ) " + filter + 
                    " OPTIONAL { " + 
                        "?x ?prop ?object . " + 
                        "?y1 ?prop ?object . " + 
                        "filter ( ?x = <" + g_origin + "> ) " + 
                "}}";

    console.log("Query get importNeighborhood: \n" + query);
    var url = DBPEDIA_TEST_URL + encodeURIComponent(query) + RESULT_RETURN_TYPE;
    return url;
}

function _createFilterClassDomain(){
    var filter = "";
    if(g_arr_CPD.length == 0)
        return filter;

    filter = "filter (";
    for(var i = 0; i < g_arr_CPD.length; i++){
        if(i == 0){
            filter += "?k1 = <" + g_arr_CPD[i] + "> ";
        }else{
            filter += " || ?k1 = <" + g_arr_CPD[i] + "> ";
        }
    }
    filter += ")";
    return filter;
}

function _parseImportNeighborhood(node, data, status){
    console.log("Data neighbor");
    console.log(data);
    if(data.results.bindings != undefined){
        var array_result = data.results.bindings;
        var map_neighborhood = [];
        var array_object = [];
        for(var i = 0; i < array_result.length; i++){
            var x_uri = array_result[i].x1.value;
            var y1_uri = array_result[i].y1.value;
            var k1_uri = array_result[i].k1.value;
            var sim = array_result[i].count.value;
            if(array_object.indexOf(y1_uri) == -1){
                array_object.push(y1_uri);
                var element = {
                    x:      x_uri,
                    y1:     y1_uri,
                    sim:    sim,
                    k1:     k1_uri
                };
                map_neighborhood.push(element);
            }
        }
    }
    _getDegreeValue(node, map_neighborhood, status);
}

function _getDegreeValue(node, map_neighborhood, status){
    var url = _createUrlDegree(node);
    console.log("Url degree");
    console.log(url);
    $.ajax({
        type:       "GET",
        url:        url,
        dataType:   "json",
        status:     status,
        map_neighborhood: map_neighborhood,
        success:    function(data){
            _parseDegreeValue(data, this.map_neighborhood, this.status);
        },
        error:      function(message){

        }
    });
}

function _createUrlDegree(node){
    var filter = _createFilterClassDomain();
    var query = "select distinct ?x1 ?y1 ?k1 count(?prop) as ?count " +
                "where { " + 
                    "?x1 ?p1 ?y1 . " + 
                    "filter (!isLiteral (?y1) && " + 
                    "?p1 != rdf:type && " + 
                    "?p1 != owl:sameAs && " + 
                    "?p1 != <dbpedia-owl:wikiPageInterLanguageLink> && " + 
                    "?p1 != <dbpedia-owl:wikiPageRedirects> && " + 
                    "?p1!= <dbpedia-owl:wikiPageDisambiguates>) " + 
                "OPTIONAL {?y1 rdf:type ?k1} " +
                "filter ( ?x1 = <" + node + "> ) " + filter + 
                " OPTIONAL { " +
                    "?y1 <http://purl.org/dc/terms/subject> ?prop ." + 
                    "{<" + node + "> ?p ?y1 .} " + 
                    "UNION { ?y1 ?p <" + node + "> .}" + 
                "}}";
    console.log("Query urldegree");
    console.log(query);
    var url = DBPEDIA_TEST_URL + encodeURIComponent(query) + RESULT_RETURN_TYPE;
    return url;
}

function _parseDegreeValue(data, map_neighborhood, status){
    console.log("Data degree");
    console.log(data);
    if(data.results.bindings != undefined){
        var array_result = data.results.bindings;
        for(var i = 0; i < array_result.length; i++){
            var x_uri = array_result[i].x1.value;
            var y1_uri = array_result[i].y1.value;
            var k1_uri = array_result[i].k1.value;
            var degree = array_result[i].count.value;

            var element = {
                x:      x_uri,
                y1:     y1_uri,
                degree:    degree,
                k1:     k1_uri
            }

            _insertMapNeighborhood(map_neighborhood, element);
        }

        for(var i = 0; i < map_neighborhood.length; i++){
            if(map_neighborhood[i].degree != undefined){
                g_map_neighborhood.push(map_neighborhood[i]);
            }
        }
        console.log(g_map_neighborhood);
        _importNeighborhoodCallback(status);
    }
}

function _insertMapNeighborhood(map_neighborhood, element){
    for(var i = 0; i < map_neighborhood.length; i++){
        if(map_neighborhood[i].x == element.x && map_neighborhood[i].y1 == element.y1){
            map_neighborhood[i]['degree'] = element.degree;
        }
    }
}

function _importNeighborhoodCallback(status){
    switch(status){
        case ORIGIN_NEIGHBORHOOD:
            var index = 0;
            var index1= -1;
            // while(index != index1 && index < MAX_PULSE){
                {
                alert("INDEX:" + (index + 1))
                for(var i = 0; i < g_activationHashMap.length; i++){
                    if(g_activationHashMap[i].act > 0){
                        var array_neighbor = _getNeighborOfNode(g_activationHashMap[i].uri);
                        var tempMap = [];
                        for(var j = 0; j < array_neighbor.length; j++){
                            var sim = array_neighbor[j].sim;
                            var degree = array_neighbor[j].degree;
                            var act = sim/degree;
                            var element = {
                                uri:    array_neighbor[j].y1,
                                act:    act,
                                sim:    array_neighbor[j].sim,
                                degree: array_neighbor[j].degree,
                                k1:     array_neighbor[j].k1
                            };
                            tempMap.push(element);
                        }
                        tempMap.sort(function(a,b){return (a.act < b.act) ? 1 : ((b.act < a.act) ? -1 : 0)});
                        console.log(tempMap);
                        g_activationHashMap = tempMap;
                        var m = 0;
                        var waiting = true;
                        alert("ActivationMap: " + g_activationHashMap.length);
                        alert("LIMIT_IMPORT: " + LIMIT_IMPORT);
                        if(g_activationHashMap.length == 0){
                            showResults();
                            return;
                        }
                        while(waiting){
                            var url_loop = _createUrlGetNeighborhood(g_activationHashMap[m].uri);
                            console.log("URL Loop: " + url_loop);
                            $.ajax({
                                type:       "GET",
                                url:        url_loop,
                                async: false,
                                dataType:   "json",
                                node:       g_activationHashMap[m].uri,
                                success:    function(data){
                                    if(data.results.bindings != undefined){
                                        var array_result_loop = data.results.bindings;
                                        var map_neighborhood_loop = [];
                                        var array_object_loop = [];
                                        for(var i = 0; i < array_result_loop.length; i++){
                                            var x_uri_loop = array_result_loop[i].x1.value;
                                            var y1_uri_loop = array_result_loop[i].y1.value;
                                            var k1_uri_loop = array_result_loop[i].k1.value;
                                            var sim_loop = array_result_loop[i].count.value;
                                            if(array_object_loop.indexOf(y1_uri_loop) == -1){
                                                array_object_loop.push(y1_uri_loop);
                                                var element_loop = {
                                                    x:      x_uri_loop,
                                                    y1:     y1_uri_loop,
                                                    sim:    sim_loop,
                                                    k1: k1_uri_loop
                                                };
                                                map_neighborhood_loop.push(element_loop);
                                            }
                                        }
                                    }
                                    var url_degree = _createUrlDegree(this.node);
                                    console.log("Url degree");
                                    console.log(url_degree);
                                    $.ajax({
                                        type:       "GET",
                                        url:        url_degree,
                                        async: false,
                                        dataType:   "json",
                                        map_neighborhood: map_neighborhood_loop,
                                        success:    function(data){
                                            console.log("Data degree");
                                            console.log(data);
                                            if(data.results.bindings != undefined){
                                                var array_result_degree = data.results.bindings;
                                                for(var i_degree = 0; i_degree < array_result_degree.length; i_degree++){
                                                    var x_uri_degree = array_result_degree[i_degree].x1.value;
                                                    var y1_uri_degree = array_result_degree[i_degree].y1.value;
                                                    var k1_uri_degree = array_result_degree[i_degree].k1.value;
                                                    var degree_degree = array_result_degree[i_degree].count.value;

                                                    var element_degree = {
                                                        x:      x_uri_degree,
                                                        y1:     y1_uri_degree,
                                                        degree:    degree_degree,
                                                        k1:         k1_uri_degree
                                                    }

                                                    _insertMapNeighborhood(this.map_neighborhood, element_degree);
                                                }

                                                for(var i_degree1 = 0; i_degree1 < this.map_neighborhood.length; i_degree1++){
                                                    if(this.map_neighborhood[i_degree1].degree != undefined){
                                                        g_map_neighborhood.push(this.map_neighborhood[i_degree1]);
                                                    }
                                                }
                                                //++++++++++++++++++++++++++++++++++++
                                                console.log("UPDATE: " + g_map_neighborhood.length);
                                                if(m < g_activationHashMap.length && g_map_neighborhood.length < LIMIT_IMPORT){
                                                    console.log("LOOP: " + m);
                                                    m++;
                                                }else{
                                                    if(g_map_neighborhood.length >= LIMIT_IMPORT){
                                                        alert("Qua LIMIT_IMPORT");
                                                    }else{
                                                        alert("Qua lenght");
                                                    }
                                                    waiting = false;
                                                }
                                                // if(m >= g_activationHashMap.length || g_map_neighborhood.length >= LIMIT_IMPORT){
                                                //     index1 = index;
                                                //     index++;
                                                // }
                                            }
                                        },
                                        error:      function(message){

                                        }
                                    });
                                },
                                error:      function(message){
                                    console.log("Error importNeighborhood: " + message);
                                }
                            });
                        }
                    
                    }
                }
            }
            break;
        case NODE_NEIGHBORHOOD:
            break;
    }
}


function _getNeighborOfNode(node){
    var array_neighbor = [];
    for(var i = 0; i < g_map_neighborhood.length; i++){
        if(g_map_neighborhood[i].x == node){
            array_neighbor.push(g_map_neighborhood[i]);
        }
    }
    return array_neighbor;
}

function getLabelFromUri(uri){
    var split = uri.split("/");
    return split[split.length - 1];
}

function showResults(){
    for(var i = 0; i < g_map_neighborhood.length; i++){
        var sim = g_map_neighborhood[i].sim;
        var degree = g_map_neighborhood[i].degree;
        var act = sim/degree;
        g_map_neighborhood[i].act = act;
    }
    g_map_neighborhood.sort(function(a,b){return (a.act < b.act) ? 1 : ((b.act < a.act) ? -1 : 0)});
    console.log("KET QUA");
    console.log(g_map_neighborhood);
    g_result.innerHTML += "<div><br>DONE</div>"
    g_result.innerHTML += "<div>100 ket qua dau tien la:</div>"
    g_result.innerHTML += '<br><br>';
    
    var map_result = [];
    for(var i = 0; i < (g_map_neighborhood.length > 100 ? 100 : g_map_neighborhood.length); i++){
        if(map_result.length == 0){
            map_result.push({
                class: g_map_neighborhood[i].k1,
                uris: [g_map_neighborhood[i].y1]
            });
        }else{
            var imported = false;
            for(var j = 0; j < map_result.length; j++){
                if(map_result[j].class == g_map_neighborhood[i].k1){
                    map_result[j].uris.push(g_map_neighborhood[i].y1);
                    imported = true;
                }
            }
            if(!imported){
                map_result.push({
                    class: g_map_neighborhood[i].k1,
                    uris: [g_map_neighborhood[i].y1]
                });
            }
        }
    }
    for(var i = 0; i < map_result.length; i++){
        g_result.innerHTML += '<div>============Class: ' + getLabelFromUri(map_result[i].class) + '==========</div>'
        for(var j = 0; j < map_result[i].uris.length; j++){
            g_result.innerHTML += '<div>==URI: ' + getLabelFromUri(map_result[i].uris[j]) + '</div>'
        }
        g_result.innerHTML += '<br><br>';
    }

    //g_result.innerHTML += '<div>Class: ' + getLabelFromUri(g_map_neighborhood[i].k1) + ': ' + getLabelFromUri(g_map_neighborhood[i].y1) + '</div>';
}