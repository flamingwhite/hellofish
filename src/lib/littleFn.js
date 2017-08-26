import R from 'ramda';


export const valueContains = R.curry((str, ob) => {
	return Object.values(ob).filter(v => v != null)
		.filter(R.complement(R.is(Function)))
		.some(v => R.is(Object, v) ? valueContains(str, v) : String(v).includes(str));
});

export const propContains = R.curry((str, props, ob) => valueContains(str, R.pick(props, ob)));
