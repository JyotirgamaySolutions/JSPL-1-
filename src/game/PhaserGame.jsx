import Phaser from 'phaser';
import MatchingGameScene from './MatchingGameScene';
import MatchingGameScene2 from './lvl2';  // Import the second scene

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MatchingGameScene, lvl2]  // Register both scenes
};

const game = new Phaser.Game(config);
