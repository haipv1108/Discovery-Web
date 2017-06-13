SELECT ?x WHERE {
SERVICE <sparqlendpointurl > {
SELECT DISTINCT ?x ?degree WHERE {
	<dbpedia:The_Beatles>(<dbpedia-owl:wikiPageWikiLink> |
	^(<dbpedia-owl:wikiPageWikiLink>)) + ?x
	{?x <dbpedia-owl:wikiPageWikiLink> <dbpedia:Ken_Loach> }
	UNION
		{<dbpedia:Ken_Loach>
		<dbpedia-owl:wikiPageWikiLink> ?x }
		FILTER (!isLiteral(?x)) }
	}
}
PRAGMA {kg:path kg:expand 2}


INSERT {?y <http://purl.org/dc/terms/subject> ?prop }
WHERE { <sparqlendpointurl> {
SELECT DISTINCT ?y ?prop WHERE {
	?y <http://purl.org/dc/terms/subject> ?prop
	FILTER (?prop = <dbpedia:Category:Impressionists>
		|| ?prop = <dbpedia:Category:People_from_Paris>
		|| ?prop = <dbpedia:Category:French_Painters>
		....)
	{?x ?p ?y
	FILTER ( ?x = <dbpedia:Gustave_Caillebotte>
		|| ?x = <dbpedia:Blanche_Hoschede_Monet>
		|| ?x = <dbpedia:Alfred_Sisley>
		|| ?x = <dbpedia:Pierre-Auguste_Renoir> )
	}
	UNION {
		{?y ?p ?x
		FILTER ( ?x = <dbpedia:Gustave_Caillebotte>
				|| ?x = <dbpedia:Blanche_Hoschede_Monet>
				|| ?x = <dbpedia : Alfred_Sisley >
				|| ?x = <dbpedia:Pierre-Auguste_Renoir> )
 }}}}}


INSERT {?x ?p1 ?y1 .
?y1 rdf:type ?k1 }
WHERE { SERVICE <sparqlendpointurl > {
SELECT ?x ?p1 ?k1 ?y1 WHERE {
	?x ?p1 ?y1
	FILTER (!isLiteral (?y1) && ?p1 != rdf:type
			&& ?p1 != owl: sameAs
			&& ?p1!= <dbpedia-owl:wikiPageInterLanguageLink>
			&& ?p1!= <dbpedia-owl:wikiPageRedirects>
			&& ?p1!= <dbpedia-owl:wikiPageDisambiguates>)
	OPTIONAL {?y1 rdf:type ?k1}
	FILTER ( ?x = <dbpedia:Claude_Monet> )
	FILTER ( ?k1 = <dbpedia-owl:Museum>
			|| ?k1= <dbpedia-owl:Writer > || ... )
}}}


SELECT * WHERE {
	SERVICE <sparqlendpointurl > {
SELECT DISTINCT ?t ( COUNT(?t) as ? tcount ) WHERE {
	{?x ?y ?z . ?z rdf:type ?t}
	UNION
	{?z ?y ?x . ?z rdf:type ?t}
	FILTER (?x = <dbpedia:Claude_Monet>)
	FILTER (regex (?t, "http://dbpedia.org/ontology "))
	FILTER (?y! = <dbpedia-owl:wikiPageRedirects>
		&& ?y! = <dbpedia-owl:wikiPageDisambiguates>)
}
GROUP BY ?t }
}