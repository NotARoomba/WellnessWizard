import * as faceapi from 'face-api.js';

// we put the face detection in a web worker so that it wouldn't block the main thread
// leading to the app appearing to lag

export const loadModal = async () => faceapi.loadTinyFaceDetectorModel('./models/tiny_face_detector_model-shard1');

async function test() {
	await sleep(2000);

	return 'yes';
}

async function detectFace() {
	const video = document.getElementById('stream-element');
	if (video === null) return;
	
	try {
		// @ts-ignore: ts(2345)
		return (await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()));
	} catch {
		return;
	}
}

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {
	test,
	detectFace
}