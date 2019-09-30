# gqlStringRebuilder
Graphql string rebuilder

This module is used to get the query string from a querr object obtained from graphql-tag

exemple: 

```
import gql from 'graphql-tag';
import stringRebuilder from 'gqlStringRebuilder';

const query = gql`{ Cars(brand: "Honda"} { id, name, price } }`;
const queryString = stringRebuilder(query);

console.log(queryString);
----> { Cars(brand: "Honda"} { id, name, price } }

```
