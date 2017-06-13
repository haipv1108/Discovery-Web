1. Truy van: Film of Leonardo Dicaprio

SELECT ?s1 as ?c1, 
      (bif:search_excerpt (bif:vector ('DICAPRIO', 'LEONARDO', 'OF', 'FILM'), ?o1)) as ?c2, 
      ?sc, ?rank, ?g 
WHERE {
  {
    { 
      SELECT ?s1, 
            (?sc * 3e-1) as ?sc, 
            ?o1, (sql:rnk_scale (<LONG::IRI_RANK> (?s1))) as ?rank, ?g 
      WHERE
        { 
          quad map virtrdf:DefaultQuadMap 
            { 
              graph ?g 
                { 
                  ?s1 ?s1textp ?o1 .
                  ?o1 bif:contains  '(DICAPRIO AND LEONARDO AND OF AND FILM)'  option (score ?sc)  .        
                }
            }    
        }
      order by desc (?sc * 3e-1 + sql:rnk_scale (<LONG::IRI_RANK> (?s1)))  
      limit 20  
      offset 0 
    }
  }
}

2. Truy van: Leonardo Dicaprio

SELECT ?s1 as ?c1, 
      (bif:search_excerpt (bif:vector ('DICAPRIO', 'LEONARDO'), ?o1)) as ?c2, 
      ?sc, ?rank, ?g 
WHERE {
  {
    { 
      SELECT ?s1, 
            (?sc * 3e-1) as ?sc, 
            ?o1, (sql:rnk_scale (<LONG::IRI_RANK> (?s1))) as ?rank, ?g 
      WHERE
        { 
          quad map virtrdf:DefaultQuadMap 
            { 
              graph ?g 
                { 
                  ?s1 ?s1textp ?o1 .
                  ?o1 bif:contains  '(DICAPRIO AND LEONARDO)'  option (score ?sc)  .        
                }
            }    
        }
      order by desc (?sc * 3e-1 + sql:rnk_scale (<LONG::IRI_RANK> (?s1)))  
      limit 20  
      offset 0 
    }
  }
}

3. Truy van: Leonardo Dicaprio and Tom Hanks

SELECT ?s1 as ?c1, 
      (bif:search_excerpt (bif:vector ('TOM', 'DICAPRIO', 'LEONARDO', 'HANKS'), ?o1)) as ?c2, 
      ?sc, ?rank, ?g 
WHERE {
  {
    { 
      SELECT ?s1, 
            (?sc * 3e-1) as ?sc, 
            ?o1, (sql:rnk_scale (<LONG::IRI_RANK> (?s1))) as ?rank, ?g 
      WHERE
        { 
          quad map virtrdf:DefaultQuadMap 
            { 
              graph ?g 
                { 
                  ?s1 ?s1textp ?o1 .
                  ?o1 bif:contains  '(TOM AND DICAPRIO AND LEONARDO AND HANKS)'  option (score ?sc)  .        
                }
            }    
        }
      order by desc (?sc * 3e-1 + sql:rnk_scale (<LONG::IRI_RANK> (?s1)))  
      limit 20  
      offset 0 
    }
  }
}