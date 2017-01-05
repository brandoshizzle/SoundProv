var waveformedInstance;
var waveformTracking = false;
var lastLoadedPath;
var startTime;
var duration;
var prevTarget = "Q"; // Key clicked previous to the current one - for removing active-key class

function loadWavesurfer(soundInfo) {
	var path = soundInfo.path;
	if (path != lastLoadedPath) {
		wavesurfer.load(path);
		lastLoadedPath = path;
		$('#waveform-progress').show();
	}
	$('#' + prevTarget).removeClass('waveformed-key');
	$('#' + soundInfo.id).addClass('waveformed-key');
	prevTarget = soundInfo.id;
}

function setWaveformTracking(soundInfo) {
	loadWavesurfer(soundInfo);
	try {
		waveformedInstance = soundInfo.soundInstance;
		var playState = waveformedInstance.playState;
		clearInterval(sI);
		if (playState == 'playSucceeded') {
			startTime = soundInfo.startTime * 1000;
			sI = setInterval(trackOnWaveform, 50);
		}
	} catch (err) {
		blog("Track is not playing. Waveform will not be tracked.");
	}
}

function trackOnWaveform() {
	var sound = waveformedInstance;
	blog(startTime);
	var percentComplete = (sound.position + startTime) / wavesurfer.getDuration() / 1000;
	wavesurfer.seekTo(percentComplete);
}

module.exports = {
	load: loadWavesurfer,
	track: setWaveformTracking
};
