// function _createUrlCommonTripleAll(array_neighbor, origin){
//     var query = "select ?x count(?prop) as ?count " +
//                 "where{ " + 
//                     "<" + origin + "> ?prop ?object . " + 
//                     " ?x ?prop ?object ." + 
//                     "filter ( ";

//      for(var i = 0; i < array_neighbor.length; i++){
//         if(i == 0){
//             query += "?x = <" + array_neighbor[i] + "> ";
//         }else{
//             query += " || ?x = <" + array_neighbor[i] + "> ";
//         }
//      }
//      query += ")}";
//      console.log(query);
//     var url = DBPEDIA_TEST_URL + encodeURIComponent(query) + RESULT_RETURN_TYPE;
//     return url;
// }

// function _createUrlCommonTriple(node, origin){
//     var query = "select count(?prop) as ?count " + 
//                 "where{ " +
//                     "<" + origin + "> ?prop ?object . " + 
//                     "<" + node + "> ?prop ?object . " +
//                 "}";
//     var url = DBPEDIA_TEST_URL + encodeURIComponent(query) + RESULT_RETURN_TYPE;
//     return url;
// }



 // for(var i = 0; i < array_neighbor.length; i++){
                        //     var sim_url = _createUrlCommonTriple(array_neighbor[i], g_origin);
                        //     $.ajax({
                        //         type:       "GET",
                        //         url:        sim_url,
                        //         dataType:   "json",
                        //         origin_node:       node,
                        //         neighbor_node:     array_neighbor[i],
                        //         success:    function(data){
                        //             if(data.results.bindings != undefined){
                        //                 //SIM VALUE
                        //                 var sim = data.results.bindings[0].count.value;

                        //                 var degree_url = _createUrlDegree(this.neighbor_node);
                        //                 $.ajax({
                        //                     type:           "GET",
                        //                     url:            degree_url,
                        //                     dataType:       "json",
                        //                     sim_value:      sim,
                        //                     origin_node:    this.origin_node,
                        //                     neighbor_node:  this.neighbor_node,
                        //                     success:        function(data){
                        //                         if(data.results.bindings != undefined){
                        //                             var degree = data.results.bindings[0].count.value;
                        //                             var act = g_activationHashMap[this.origin_node] * (1 + this.sim_value)/degree;
                        //                             console.log("ACTION = " + act);
                        //                         }
                        //                     },
                        //                     error:          function(message){
                        //                         console.log("Error degree: " + message);
                        //                     }
                        //                 });
                        //             }
                        //         },
                        //         error:      function(message){
                        //             console.log("Error CommonTriple: " + message);
                        //         }
                        //     });
                        //     //var sim = commontriple(array_neighbor[i], g_origin);
                        //     //var act = g_activationHashMap[node] * (1 + sim)/degree(node);
                        //     //TODO: tempMap.put(j, tempMap.get(j) + act)
                        // }