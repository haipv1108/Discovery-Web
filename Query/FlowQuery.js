1. Lay toan bo nut lan can quanh nut goc: Claude_Monet

PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
SELECT DISTINCT ?t ( count (?t) as ?tcount ) 
WHERE {
	{<http://dbpedia.org/resource/Claude_Monet> ?y ?z . ?z rdf:type ?t}
	UNION {
		?z ?y <http://dbpedia.org/resource/Claude_Monet> . ?z rdf:type ?t}
		FILTER ( REGEX(?t ,"http://dbpedia.org/ontology"))
		FILTER (?y != <dbpedia-owl:wikiPageRedirects> && ?y != <dbpedia-owl:wikiPageDisambiguates>)
	}
GROUP BY ?t 


2. Kiem tra cac nut lan can quanh nut goc & cac lop cua chung

SELECT ?x ?p1 ?k1 ?y1 
WHERE {
     ?x ?p1 ?y1
     FILTER (  !isLiteral (?y1) && ?p1 != rdf:type && 
     		   ?p1 != owl:sameAs && 
     		   ?p1 != <dbpedia-owl:wikiPageInterLanguageLink> && 
     		   ?p1 != <dbpedia-owl:wikiPageRedirects> && 
     		   ?p1!= <dbpedia-owl:wikiPageDisambiguates>)
     OPTIONAL{ ?y1 rdf:type ?k1}
     FILTER (  ?x = <http://dbpedia.org/resource/Claude_Monet> )
     FILTER (  ?k1= dbpedia-owl:Agent || ?k1 = dbpedia-owl:Person || 
               ?k1 = dbpedia-owl:Place || ?k1 = dbpedia-owl:Image ||
               ?k1 = dbpedia-owl:Writer || ?k1 = dbpedia-owl:Work ||
               ?k1 = dbpedia-owl:Artist || ?k1 = dbpedia-owl:PopulatedPlace ||
               ?k1 = dbpedia-owl:Settlement || ?k1 = dbpedia-owl:Location || 
               ?k1 = dbpedia-owl:Artwork )
}


3. Truy van su dung de tinh toan tuong tu 

SELECT DISTINCT ?y ?prop 
WHERE {
    ?y <http://purl.org/dc/terms/subject> ?prop
    FILTER (?prop = <http://dbpedia.org/resource/Category:Impressionists>
            || ?prop = <http://dbpedia.org/resource/Category:People_from_Paris>
            || ?prop = <http://dbpedia.org/resource/Category:French_Painters>)
    {?x ?p ?y
    FILTER ( ?x = <http://dbpedia.org/resource/Gustave_Caillebotte>
            || ?x = <http://dbpedia.org/resource/Blanche_Hoschede_Monet>
            || ?x = <http://dbpedia.org/resource/Alfred_Sisley>
            || ?x = <http://dbpedia.org/resource/Pierre-Auguste_Renoir> )
     }
    UNION {
          {?y ?p ?x
          FILTER ( ?x = <http://dbpedia.org/resource/Gustave_Caillebotte>
               || ?x = <http://dbpedia.org/resource/Blanche_Hoschede_Monet>
               || ?x = <http://dbpedia.org/resource/Alfred_Sisley>
               || ?x = <http://dbpedia.org/resource/Pierre-Auguste_Renoir> )
         }
    }
}



1 -> 2 -> 3 tich hop query

1. 

PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> 
SELECT DISTINCT ?t ( count (?t) as ?tcount ) 
WHERE {
	{ <http://dbpedia.org/resource/Leonardo_DiCaprio> ?y ?z . ?z rdf:type ?t}
	UNION{
		?z ?y <http://dbpedia.org/resource/Leonardo_DiCaprio> . 
		?z rdf:type ?t}
	FILTER ( regex (?t ,"http://dbpedia.org/ontology"))
	FILTER (?y != <dbpedia-owl:wikiPageRedirects> && ?y != <dbpedia-owl:wikiPageDisambiguates>)
}
GROUP BY ?t 

2. 

SELECT DISTINCT ?x1 ?y1 ?k1 count(?prop) as ?count 
WHERE { 
	?x1 ?p1 ?y1 . 
	FILTER (!isLiteral (?y1) && 
			?p1 != rdf:type && 
			?p1 != owl:sameAs && 
			?p1 != <dbpedia-owl:wikiPageInterLanguageLink> && 
			?p1 != <dbpedia-owl:wikiPageRedirects> && 
			?p1!= <dbpedia-owl:wikiPageDisambiguates>) 
	OPTIONAL {?y1 rdf:type ?k1} 
	FILTER ( ?x1 = <http://dbpedia.org/resource/Leonardo_DiCaprio> ) 
	FILTER (?k1 = <http://dbpedia.org/ontology/Song>  || 
			?k1 = <http://dbpedia.org/ontology/Film>  || 
			?k1 = <http://dbpedia.org/ontology/Band>  || 
			?k1 = <http://dbpedia.org/ontology/Album>  || 
			?k1 = <http://dbpedia.org/ontology/MusicalArtist>  || 
			?k1 = <http://dbpedia.org/ontology/MusicGenre>  || 
			?k1 = <http://dbpedia.org/ontology/Actor>  || 
			?k1 = <http://dbpedia.org/ontology/Person> ) 
	OPTIONAL{ ?x ?prop ?object . 
			   ?y1 ?prop ?object . 
			   FILTER ( ?x = <http://dbpedia.org/resource/Leonardo_DiCaprio> ) 
			}
}

3.

SELECT DISTINCT ?x1 ?y1 ?k1 count(?prop) as ?count 
WHERE { 
	?x1 ?p1 ?y1 . 
	FILTER (!isLiteral (?y1) && 
			?p1 != rdf:type && 
			?p1 != owl:sameAs && 
			?p1 != <dbpedia-owl:wikiPageInterLanguageLink> && 
			?p1 != <dbpedia-owl:wikiPageRedirects> && 
			?p1!= <dbpedia-owl:wikiPageDisambiguates>) 
	OPTIONAL {?y1 rdf:type ?k1} 
	FILTER ( ?x1 = <http://dbpedia.org/resource/Leonardo_DiCaprio> ) 
	FILTER (?k1 = <http://dbpedia.org/ontology/Song>  || 
			?k1 = <http://dbpedia.org/ontology/Film>  || 
			?k1 = <http://dbpedia.org/ontology/Band>  || 
			?k1 = <http://dbpedia.org/ontology/Album>  || 
			?k1 = <http://dbpedia.org/ontology/MusicalArtist>  || 
			?k1 = <http://dbpedia.org/ontology/MusicGenre>  || 
			?k1 = <http://dbpedia.org/ontology/Actor>  || 
			?k1 = <http://dbpedia.org/ontology/Person> ) 
	OPTIONAL { ?y1 <http://purl.org/dc/terms/subject> ?prop .
				{<http://dbpedia.org/resource/Leonardo_DiCaprio> ?p ?y1 .} 
			UNION { ?y1 ?p <http://dbpedia.org/resource/Leonardo_DiCaprio> .}
			}
}