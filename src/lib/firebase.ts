import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyDoZOyo2YTyHBrwQyJPFJlSNSiZn9TlbfA',
	authDomain: 'me-port-3013b.firebaseapp.com',
	projectId: 'me-port-3013b',
	storageBucket: 'me-port-3013b.firebasestorage.app',
	messagingSenderId: '756947945491',
	appId: '1:756947945491:web:b0485031a705a186cb97e6',
	measurementId: 'G-D4PXC2064L',
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
