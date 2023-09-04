export class Input {
  static key_map;

  async loadKeyMap() {
    let jsonString = localStorage['InputMap'];
    this.key_map = JSON.parse(jsonString);
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
      },
      true,
    );
  }
}