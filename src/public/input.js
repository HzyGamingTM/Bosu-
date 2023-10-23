export class BsInput {
	static default_keymap = {
		key_1: "z",
		key_2: "x",
		key_smoke: "c",
		key_pause: "Escape",
		retry: "`",
		hide_hud: "h",
		show_leaderboard: "Tab"
	}

	static key_map;
	
	async loadKeyMap() {
	    let jsonString = localStorage['InputMap'];
	    if (jsonString != undefined)
	        this.key_map = JSON.parse(jsonString);
		else {
			console.log("Keymap not found, reverting back to default keymap!");
			this.key_map = default_keymap;
			this.saveKeyMap(); 
		}
	}

	async saveKeyMap() {
		if (this.key_map != undefined)
	    	localStorage['InputMap'] = key_map;
	}	

	constructor(key_map) {
		window.addEventListener(
	    	"keydown",
	    	(event) => {
	      		if (event.defaultPrevented) {
	       			return; // Do nothing if the event was already processed
	      		}
			
	      		switch (event.key) {
	        		case key_map.key_1:
				
	        	    	break;
	        		case key_map.key_2:
				
	        	    	break;
	        		case key_map.key_smoke:
				
	        	    	break;
	        		case key_pause:
						
	        	  		break;
	      		}

	      		// Cancel the default action to avoid it being handled twice
	      		event.preventDefault();
	    	}, true,
		);
	}
}