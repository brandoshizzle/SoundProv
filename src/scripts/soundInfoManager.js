/*jshint esversion: 6 */
const sounds = require("./sounds");
var defaultSoundInfo = sounds.defaultSoundInfo();

/**
 *	@desc:	Takes a path and (optional) id and returns a default soundInfo object
 *	@param:	path: the complete path to the sound file
 						id: (optional) The id for the sound. Defaults to default name
 */
function createSoundInfoFromPath(path, id) {
	var tempObj = util.cloneObj(defaultSoundInfo);
	storage.checkAgainstDefault(tempObj, 'soundInfo');
	// Write known info
	tempObj.name = util.cleanName(path);
	tempObj.id = id || util.prepareForId(tempObj.name);
	tempObj.path = path;
	// Define which section it is part of
	if(id === undefined){
		tempObj.infoObj = "playlist";
		// Create a unique id for the playlist item (to allow multiple of same!)
		var count = 0;
		var duplicate, tempId;
		do {
			duplicate = false;
			tempId = (count > 0) ? tempObj.id + count : tempObj.id;
			for (var item in playlistInfo) {
				if(playlistInfo[item].id == tempId){
					duplicate = true;
					count++;
					break;
				}
			}
		} while (duplicate);
		tempObj.id = (count > 0) ? tempId : tempObj.id;
	}	else {
		tempObj.infoObj = "key";
	}
	sounds.register(tempObj);
	// INSTANCE IS CREATED AND END TIME IS CALCULATED WHEN SONG PRELOADS - SEE SOUNDS.JS
	return tempObj;
}

/**
 *	@desc: Ensures that all loaded keys have the properties they need
 *				Called when loading stored keyInfo and when a song is dragged onto a key
 *	@param: key: The letter (or character) of the key to check (string)
 */
function checkSoundInfo(id, infoObj) {
	if (infoObj[id] === undefined) { // If that key isn't part of the keyInfo array yet...
		infoObj[id] = JSON.parse(JSON.stringify(defaultSoundInfo));
	} else { // If key was already defined...
		// Check that the key has all properties - set default if it doesn't have it.
		Object.keys(defaultSoundInfo).map(function(prop, index) {
			if (!infoObj[id].hasOwnProperty(prop)) {
				infoObj[id][prop] = defaultSoundInfo[prop];
			}
		});

		// Check that the key does not have depreciated properties (and delete them)
		Object.keys(infoObj[id]).map(function(prop, index) {
			if (!defaultSoundInfo.hasOwnProperty(prop)) {
				delete infoObj[id][prop];
			}
		});

	}
}

module.exports = {
	createSoundInfoFromPath: createSoundInfoFromPath,
	checkSoundInfo: checkSoundInfo
};
