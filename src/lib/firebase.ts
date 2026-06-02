import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyBNr67_1H_lnzyswCml2s6ix3ade6n4q-I',
	authDomain: 'capcom-d876d.firebaseapp.com',
	projectId: 'capcom-d876d',
	storageBucket: 'capcom-d876d.firebasestorage.app',
	messagingSenderId: '1034521260193',
	appId: '1:1034521260193:web:cd4c0e9c83cc2bb71200e0',
	measurementId: 'G-Z5FEGR9MK6',
};

let appInstance: FirebaseApp | null = null;

export async function initFirebase(): Promise<{
	app: FirebaseApp;
	analytics: Analytics | null;
}> {
	if (appInstance) {
		return { app: appInstance, analytics: null };
	}

	appInstance = initializeApp(firebaseConfig);
	let analytics: Analytics | null = null;

	if (typeof window !== 'undefined' && (await isSupported())) {
		analytics = getAnalytics(appInstance);
	}

	return { app: appInstance, analytics };
}
