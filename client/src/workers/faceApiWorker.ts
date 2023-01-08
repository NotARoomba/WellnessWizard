import * as faceapi from 'face-api.js';

faceapi.loadTinyFaceDetectorModel('../models/tiny_face_detector_model-shard1');

async function test() {
	await sleep(2000);

	return 'yes';
}

async function detectFace() {
	const video = document.getElementById('stream-element');
	if (video === null) Error('No Video Element');

	// @ts-ignore: ts(2345)
	return (await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()));
}

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {
	test,
	detectFace
}