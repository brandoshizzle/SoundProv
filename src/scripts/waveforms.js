var waveformedInstance;
var waveformTracking = false;
var lastLoadedPath;

function loadWavesurfer(soundInfo) {
	var path = soundInfo.path;
	if (path != lastLoadedPath) {
		wavesurfer.load(path);
		lastLoadedPath = path;
	}
}

function setWaveformTracking(soundInfo) {
	loadWavesurfer(soundInfo);
	try {
		waveformedInstance = soundInfo.soundInstance;
		var playState = waveformedInstance.playState;
		clearInterval(sI);
		if (playState == 'playSucceeded') {
			sI = setInterval(trackOnWaveform, 50);
		}
	} catch (err) {
		blog("Track is not playing. Waveform will not be tracked.");
	}
}

function trackOnWaveform() {
	var sound = waveformedInstance;
	var percentComplete = sound.position / wavesurfer.getDuration() / 1000;
	wavesurfer.seekTo(percentComplete);
}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking
};