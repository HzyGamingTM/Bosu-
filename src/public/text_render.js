import { BsTexture } from "./render";

export class BsTextRenderer {
    fontUrl;
    fontMap;
    gl

    constructor(fontUrl, gl) {
        this.gl = gl;
        this.fontUr = fontUrl;
        /*
        // Example: "a": {x: 0, y: 0, width: 8}

        fontMap = {
            "a": ,
            "b": ,
            "c": ,
            "d": ,
            "e": ,
            "f": ,
            "g": ,
            "h": ,
            "i": ,
            "j": ,
            "k": ,
            "l": ,
            "m": ,
            "n": ,
            "o": ,
            "p": ,
            "q": ,
            "r": ,
            "s": ,
            "t": ,
            "u": ,
            "v": ,
            "w": ,
            "x": ,
            "y": ,
            "z": ,

            "A" ,
            "B" ,
            "C" ,
            "D" ,
            "E" ,
            "F" ,
            "G" ,
            "H" ,
            "I" ,
            "J" ,
            "K" ,
            "L" ,
            "M" ,
            "N" ,
            "O" ,
            "P" ,
            "Q" ,
            "R" ,
            "S" ,
            "T" ,
            "U" ,
            "V" ,
            "W" ,
            "X" ,
            "Y" ,
            "Z" ,
        }
        */
    }

    render(text, x, y, width, height) {
        let characters = [];
        for (let i = 0; i < text.length; i++) {
            characters[i] = text.charAt(i);
        }



        


    }
}