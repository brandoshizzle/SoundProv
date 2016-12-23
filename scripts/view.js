/* VIEW.JS
*  Handles generation of elements that are dynamically loaded.
*  Functions:
			buildKeyboard
			buildTransList
			buildWaveform
*/

var settingsKey;

// Create keyboard buttons
function buildKeyboard() {
	var rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', "["],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ]
	];
	for (var i = 0; i < rows.length; i++) {
		var rowNum = i + 1;
		for (var j = 0; j < rows[i].length; j++) {
			$('#row' + rowNum).append("<div class='btn btn-key z-depth-4 waves-effect waves-light'><div class='keyLetter'>" + rows[i][j] + "</div><div id='" + rows[i][j] + "' class='audioName'></div></div>");
		}
	}
	keys = $('.audioName'); // set keys to be an array of the audioName divs
};

function buildTransList() {
	var el = document.getElementById('transition-songs');
	var sortable = Sortable.create(el, {
		animation: 150
	});
}

function buildWaveform() {
	// Create wavesurfer instance
	wavesurfer = WaveSurfer.create({
		container: '#waveform',
		waveColor: '#ffeb3b',
		progressColor: '#ffd600',
	});
	wavesurfer.empty();
}

function openSoundSettings(key) {
	var idStart = "#sound-settings-";
	var soundProps = keyInfo[key];
	if (soundProps.name == "") {
		soundProps.name = "Enter a name"
	};
	$(idStart + "name").text(soundProps.name);
	$(idStart + "path").val(soundProps.path);
	$(idStart + "loop").prop("checked", soundProps.loop);
	$(idStart + "start-time").val(soundProps.startTime);
	if (soundProps.endTime != null) {
		$(idStart + "end-time").val(soundProps.endTime);
	} else {
		$(idStart + "end-time").val(sounds.getDuration(key));
	}
	settingsKey = key;
	$('#sound-settings').modal('open');
}

/**
 *	@desc: Gets the settings from the sound settings box and save them
 *	@param: settingsKey (global): the key to apply changes to
 */
function closeSoundSettings() {
	var keyArray = keyInfo[settingsKey];
	keyArray.name = $('#sound-settings-name').text();
	$('#' + settingsKey).text(keyArray.name);
	keyArray.color = $('#sound-settings-color').val();
	keyArray.loop = $('#sound-settings-loop').is(':checked');
	keyArray.startTime = $('#sound-settings-start-time').val();
	keyArray.endTime = $('#sound-settings-end-time').val();
	keyInfo[settingsKey] = keyArray;
	util.storeObj("keyInfo", keyInfo);
}

module.exports = {
	buildKeyboard: buildKeyboard,
	buildTransitionsList: buildTransList,
	buildWaveform: buildWaveform,
	openSoundSettings: openSoundSettings,
	closeSoundSettings: closeSoundSettings
};