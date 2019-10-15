function getListValues(values) {
    let listValues = '';
    
    for (let i = 0; i < values.length; i += 1) {
	const separators = ['', ''];
	if (values[i].kind === 'StringValue') {
     	  separators[0] = '"';
      	  separators[1] = '"';
    	} else if (values[i].kind === 'ListValue') {
      	  listValues = `${listValues}[${getListValues(values[i].values)}]`;
    	} else if (values[i].kind === 'Variable') {
      	  listValues = `${listValues}$${values[i].value}`;
    	} else {
	  listValues = `${listValues}${separators[0]}${values[i].value}${separators[1]}`;
    	}
	if (i < values.length - 1) {
	    listValues = `${listValues},`;
	}
    }
    return listValues;
}

function parseSelection(selection, query) {
    let tmpQuery = query;

    if (selection.alias !== undefined) {
        tmpQuery += `${selection.alias.value}: `;
    }
    tmpQuery += selection.name.value;
    if (selection.arguments.length) {
	tmpQuery += '(';
	for (let k = 0; k < selection.arguments.length; k += 1) {
	    const argument = selection.arguments[k];
	    const separators = ['', ''];
	    
	    if (argument.value.kind === 'ListValue') {
		separators[0] = '[';
		separators[1] = ']';
		tmpQuery = `${tmpQuery}${argument.name.value}: [${getListValues(argument.value.values)}]`;
	    } else {
		if (argument.value.kind === 'StringValue') {
		    separators[0] = '"';
		    separators[1] = '"';
		}
		tmpQuery = `${tmpQuery}${argument.name.value}: ${separators[0]}${argument.value.value}${separators[1]}`;
	    }
	    if (k !== selection.arguments.length - 1) {
		tmpQuery += ', ';
	    }
	}
	tmpQuery += ') ';
    } else {
	tmpQuery += ' ';
    }
    return tmpQuery;
}

function filterQuery(selectionSet, queryString) {
    let tmpQuery = queryString;
    if (!selectionSet || selectionSet.selections.length === 0) {
	return tmpQuery;
    }
    const { selections } = selectionSet;
    tmpQuery += '{ ';

    for (let i = 0; i < selections.length; i += 1) {
	tmpQuery = parseSelection(selections[i], tmpQuery);
	tmpQuery = filterQuery(selections[i].selectionSet, tmpQuery);
	if (i === selectionSet.selections.length - 1) {
	    tmpQuery += '} ';
	}
    }
    return tmpQuery;
}


function rebuildQueryString(query) {
    let newQuery = '';
    for (let i = 0; i < query.definitions.length; i += 1) {
	newQuery = `${newQuery}${filterQuery(query.definitions[i].selectionSet, newQuery)}`;
    }
    return newQuery;
}

module.exports = rebuildQueryString;

