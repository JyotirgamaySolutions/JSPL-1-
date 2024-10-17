// src/main.jsx
import Phaser from 'phaser';
import MatchingGameScene from './game/scenes/MatchingGameScene'; // Make sure this path is correct
import DetailsScene from './game/scenes/DetailsScene'; // Ensure this path is correct as well
import lvl2 from './game/scenes/lvl2'; 
import lvl4 from './game/scenes/lvl4';
import lvl5 from './game/scenes/lvl5';
import lvl6 from './game/scenes/lvl6';
import lvl7 from './game/scenes/lvl7';
import lvl8 from './game/scenes/lvl8';
import lvl9 from './game/scenes/lvl9';
import lvl10 from './game/scenes/lvl10';
import lvl1 from './game/scenes/lvl1';
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0ec3c9', // Set your desired blueish color here
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MatchingGameScene, DetailsScene, lvl2, lvl4, lvl5, lvl6, lvl7, lvl8, lvl9 , lvl10, lvl1]
};

const game = new Phaser.Game(config);


