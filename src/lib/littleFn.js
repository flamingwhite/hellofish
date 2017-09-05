import R from 'ramda';


export const valueContains = (str, ob, ignoreCase = true) => {
	return Object.values(ob).filter(v => v != null)
		.filter(R.complement(R.is(Function)))
		.some(v => R.is(Object, v) ? valueContains(str, v) : String(ignoreCase? v.toLowerCase(): v).includes(ignoreCase? str.toLowerCase(): str));
};

export const propContains = R.curry((str, props, ob) => valueContains(str, R.pick(props, ob)));


export const toggleArrayItem = (arr, item, predicate = R.equals) => {
	if (item == undefined) return arr;
	return arr.find(predicate(item)) ? arr.filter(it => !predicate(item, it)) : [...arr, item]
};


