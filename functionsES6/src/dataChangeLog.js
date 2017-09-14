import {admin, functions} from './fireConfig';
import {objectDifference} from './littleFn';
import R from 'ramda';

const logDateChange = params => {
	if (!params.scheme ) {
		console.warn('LOG DATE CHANGE FAILED, no scheme or no data');
		return;
	}

	let { data, prev, ...rest } = params;
	[data, prev] = objectDifference(data, prev, (v1, v2) => {
		const flat = v => v == null || v == {} || v == '' ? null : v;
		return R.equals(flat(v1), flat(v2));
	});

	const now = new Date();
	return admin.database().ref('/eventLogs').push({
		...rest,
		data,
		prev,
		time: now.getTime(),
		timeStr: now.toString()
	});
}


const logWithTable = R.curry((scheme, event,type, id) => {
	const data = event.data.val();
	const prev = event.data.previous.val();

	return logDateChange({
		id,
		scheme,
		type,
		data,
		prev
	})

});

const contactLog = logWithTable('contacts')

export const contactCreateLog = functions.database.ref('/contacts/{cid}').onCreate(event => {
	const id = event.params.cid;
	return contactLog(event, 'CREATE', id);
});

export const contactUpdateLog = functions.database.ref('/contacts/{cid}').onUpdate(event => {
	const id = event.params.cid;
	return contactLog(event, 'UPDATE', id);
});

export const contactDeleteLog = functions.database.ref('/contacts/{cid}').onDelete(event => {
	const id = event.params.cid;
	return contactLog(event, 'DELETE', id);
});


const tagLog = logWithTable('contactTags');

export const tagCreateLog = functions.database.ref('/contactTags/{cid}').onCreate(event => {
	const id = event.params.cid;
	return tagLog(event, 'CREATE', id);
});

export const tagUpdateLog = functions.database.ref('/contactsTags/{cid}').onUpdate(event => {
	const id = event.params.cid;
	return tagLog(event, 'UPDATE', id);
});

export const tagDeleteLog = functions.database.ref('/contactTags/{cid}').onDelete(event => {
	const id = event.params.cid;
	return tagLog(event, 'DELETE', id);
});


