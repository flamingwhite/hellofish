import {admin, functions} from './fireConfig';


const logDateChange = params => {
	if (!params.scheme ) {
		console.warn('LOG DATE CHANGE FAILED, no scheme or no data');
		return;
	}
	return admin.database().ref('/eventLogs').push(params)
}


export const contactChangeLog = functions.database.ref('/contacts/{cid}').onWrite(event => {

	const data = event.data.val();
	const prev = event.data.previous.val();
	console.log('current contact', data, 'prev,', prev);

	return logDateChange({
		scheme: 'contacts',
		data,
		prev
	});
});

export const tagChangeLog = functions.database.ref('/contactTags/{tid}').onWrite(event => {

	const data = event.data.val();
	const prev = event.data.previous.val();
	console.log('current tag', data, 'prev,', prev);

	return logDateChange({
		scheme: 'contactTags',
		data,
		prev
	});
});

