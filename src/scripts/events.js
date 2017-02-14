/* EVENTS.JS
 * These functions handle all events - mouse clicks, key presses, etc
 * Functions:
 *		setKeyEvents
 */
/*jshint esversion: 6 */

// Required js scripts
const soundInfoManager = require("./soundInfoManager");

var settingsInfoObj; // Either keyInfo or playlistInfo, whichever has the sound being changed in settings
var specialKeys = ['MINUS', 'EQUALS', 'OPEN_BRACKET', 'CLOSE_BRACKET', 'SEMICOLON', 'QUOTE', 'BACK_SLASH', 'BESIDE_Z', 'COMMA', 'PERIOD', 'SLASH'];

/**
 *	@desc:	Sets all the events related to the keyboard keys
 *	@param:	keys: An array of all the key objects
 */
function setKeyEvents() {

	// Handles when a file is dropped on a key
	keys.on('drop', function(e) {
		e.originalEvent.preventDefault(); // Prevent default action
		try{
			for (let f of e.originalEvent.dataTransfer.files) {
				// grab the id of the target key
				var id = e.target.id;
				// Create a new sound info object
				var newSoundInfo = soundInfoManager.createSoundInfoFromPath(f.path, id);
				// Store the new sound info object in the keyInfo object
				keyInfo[id] = newSoundInfo;
				$(e.target).find('.audioName').text(newSoundInfo.name);
				pages.ensurePageExists(currentPage);
				pagesInfo['page' + currentPage].keyInfo = keyInfo;
				storage.storeObj("pagesInfo", pagesInfo);
				waveforms.load(newSoundInfo);
			}
		}
		catch(err){}

		return false;
	});

	keys.on('dragover', function(e) {
		//$('#' + e.target.id).css("box-shadow", "0px 0px 4px 4px rgba(255,247,99,1)");
		return false;
	});
	keys.on('dragleave', function(e) {
		//$('#' + e.target.id).css("box-shadow", "0px 0px");
		return false;
	});

	// File is dropped onto playlist box - register and add info
	$('.playlistBox').on('drop', function(e) {
		console.log('drop');
		e.originalEvent.preventDefault(); // Prevent default action
		for (let f of e.originalEvent.dataTransfer.files) {
			// Create new soundInfo object
			var newSoundInfo = soundInfoManager.createSoundInfoFromPath(f.path);
			playlistInfo[newSoundInfo.id] = newSoundInfo;
			view.createPlaylistItem(newSoundInfo); // Create a new li in the playlist
			storage.storeObj("playlistInfo", playlistInfo);
			waveforms.load(newSoundInfo);
		}
		updatePlaylistClickFunctions(); // Ensure new songs react properly to clicking
		return false;
	});

	// Click on keyboard key
	$('.btn-key').on('click', function(e) {
		clickSound(e, keyInfo);
	});

	// apply clicked-key class and show waveform
	function clickSound(e, infoObj) {
		var id = e.target.id;
		if (infoObj.hasOwnProperty(id)) {
			waveforms.track(infoObj[id]);
		}
	}

	// Right click to bring up settings and populate them
	keys.on('contextmenu', function(e) {
		var key = e.target.id;
		settingsInfoObj = keyInfo;
		if(keyInfo.hasOwnProperty(key)){
			view.openSoundSettings(keyInfo[key]);
			waveforms.load(keyInfo[key]);
		}
	});

	// Set functions when clicking on playlist sounds
	function updatePlaylistClickFunctions() {
		// Click on playlist sound -> load waveform
		$('.playlistSound').on('click', function(e) {
			clickSound(e, playlistInfo);
		});
		// Right-click on playlist sound -> open sound settings
		$('#playlist-songs li').on('contextmenu', function(e) {
			var id = e.target.id;
			settingsInfoObj = playlistInfo;
			view.openSoundSettings(playlistInfo[id]);
			waveforms.load(playlistInfo[id]);
		});
	}
	updatePlaylistClickFunctions();

	// Handles pressing a real key anywhere on the page
	$(document).keydown(function(e) {
		var key = keyboardMap[e.which];
		var code = e.which;

		if(key === 'CONTROL'){
			ctrl = true;
			$('#waveform').css('pointer-events', 'none');
		}

		if (!$(e.target).is('input')) {
			// If keys A-Z or 0-9 have been pressed, or a special key
			if ((code > 64 && code < 91) || (code > 47 && code < 58) || ($.inArray(key, specialKeys) > -1)) {
				// Check if the sound was loaded or not, and if it even exists
				key = 'page' + currentPage + '_' + key;
				if(keyInfo.hasOwnProperty(key)){
					if (!$("#" + key).parent().hasClass('soundNotLoaded')) {
						sounds.playSound(keyInfo[key]);
					} else { // User tries to play a not-loaded sound
						Materialize.toast(keyInfo[key].name + " was not loaded.", 1500);
					}
				}
				// User presses the delete key
			} else if (key === 'DELETE') {
				id = $('.waveformed-key').attr('id');
				// If the deleted sound was in the keys
				if (keyInfo.hasOwnProperty(id)) {
					delete keyInfo[id];
					pagesInfo['page' + currentPage].keyInfo = keyInfo;
					storage.storeObj("pagesInfo", pagesInfo);
					$("#" + id).find('.audioName').text("");
					$("#" + id).removeClass('waveformed-key');
					$("#" + id).css('background-color', 'var(--pM)');
				} else {
					// The deleted sound was in the playlist
					delete playlistInfo[id];
					$("#" + id).remove();
					storage.storeObj("playlistInfo", playlistInfo);
				}
				waveforms.reset();
			} else if (key === 'SPACE') {
				// Play the first visible sound of the playlist
					var firstPlaylistSound = playlist.getFirstPlaylistItem();
					//if(firstPlaylistSound !== 'no sounds!')
					sounds.playSound(playlistInfo[firstPlaylistSound]);
			}

			}
			if(key === 'ESCAPE'){
				createjs.Sound.stop();
				// TO DO: Remove all played formatting.
				$('.btn-key, .playlistSound').removeClass('playing-sound');
			}
			return false;
		});

		$(document).keyup(function(e) {
			var key = keyboardMap[e.which];
			var code = e.which;

			if(key === 'CONTROL'){
				ctrl = false;
				$('#waveform').css('pointer-events', 'inherit');
			}
		});

	// Close/save sound settings when save key is pressed.
	$('#sound-settings-save').click(function(e) {
		var tempSoundInfo = view.saveSoundSettings();
		var itIsKeyInfo = (settingsInfoObj === keyInfo);
		settingsInfoObj[tempSoundInfo.id] = tempSoundInfo;
		if (itIsKeyInfo) {
			$('#' + tempSoundInfo.id).find('.audioName').text(tempSoundInfo.name);
			pagesInfo['page' + currentPage].keyInfo = keyInfo;
			storage.storeObj("pagesInfo", pagesInfo);
		} else {
			$('#' + tempSoundInfo.id).text(tempSoundInfo.name);
			storage.storeObj("playlistInfo", settingsInfoObj);
		}

	});

	// Close/save sound settings when save key is pressed.
	$('#start-time-reset').click(function(e) {
		view.resetStartTime();
	});

	// Close/save sound settings when save key is pressed.
	$('#end-time-reset').click(function(e) {
		view.resetEndTime();
	});

	// Prevent firing sounds when editing input fields
	$('#sound-settings, .input-field').keydown(function(e) {
		e.stopPropagation();
	});

	// Open dialog box when browse button is pressed.
	$('#browse-button').click(function(e) {
		util.openBrowse();
	});

	$("#sound-settings-color-container").click(function(e) {
		view.openColorPicker();
	});

	$(".color-picker-color").click(function(e) {
		colors.setPickedColor(e.target.id);
		$("#color-picker").fadeOut();
	});

	// Prevent Dragging files onto main window
	$(document).on('drop', function(e) {
		e.preventDefault();
		return false;
	});
	$(document).on('dragover', function(e) {
		e.preventDefault();
		return false;
	});

	$('.search').on('keyup',function(){
		var first = true;
		$('#playlist-songs li').each(function(){
			if($(this).is(":visible") === true){
				if(first === true){
					$(this).css('background-color', 'var(--aM)');
					first = false;
				} else {
					$(this).css('background-color', 'var(--bgL)');
				}
			}
		});
	});
}

module.exports = {
	setKeyEvents: setKeyEvents
};
