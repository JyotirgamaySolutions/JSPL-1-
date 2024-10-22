import Phaser from 'phaser';

class StartPageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartPageScene' });
    }

    preload() {
        // Preload assets with absolute paths
        this.load.image('background1', '/assets/bg2.jpg');
        this.load.audio('birdSound', '/assets/bird.mp3'); // Use absolute path for Vercel

        console.log('Assets preloaded successfully.');
    }

    create() {
        this.updateLayout();

        // Wait for user interaction to play the sound (for autoplay policy)
        this.input.once('pointerdown', () => {
            console.log('Pointer down event detected.');
            this.playBackgroundSound();
        });

        window.addEventListener('resize', () => this.updateLayout());
    }

    playBackgroundSound() {
        if (!this.sound.get('birdSound')) {
            this.birdSound = this.sound.add('birdSound', { loop: true, volume: 0.5 });

            this.birdSound.play().then(() => {
                console.log('Bird sound is playing.');
            }).catch((err) => {
                console.error('Failed to play sound:', err);
            });
        }
    }

    updateLayout() {
        const { width, height } = this.sys.game.canvas;
        this.children.removeAll(); // Clear all previous elements

        const background = this.add.image(0, 0, 'background1')
            .setOrigin(0)
            .setDisplaySize(width, height);

        this.createButtons(width, height);
    }

    createButtons(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;

        this.createRoundedButton(centerX, centerY - 150, 'Play Game', () => this.scene.start('lvl1'));
        this.createRoundedButton(centerX, centerY - 50, 'Instruction', () => this.displayInstructionPopup(width, height));
        this.createRoundedButton(centerX, centerY + 50, 'Hints', () => this.displayHintsPopup(width, height));
        this.createRoundedButton(centerX, centerY + 150, 'Quit', this.quitGame);
    }

    createRoundedButton(x, y, text, onClick) {
        const button = this.add.graphics();
        const buttonWidth = Math.min(this.sys.game.canvas.width * 0.25, 200);
        const buttonHeight = Math.min(this.sys.game.canvas.height * 0.08, 50);

        button.fillStyle(0x008080, 1);
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 20);
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 20);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${buttonHeight / 2}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);

        const buttonContainer = this.add.container(x, y, [button, buttonText])
            .setSize(buttonWidth, buttonHeight)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick);
    }

    quitGame() {
        window.open('https://rrbcea.vercel.app', '_blank'); // Opens in a new tab
    }

    displayInstructionPopup(width, height) {
        const popup = this.createPopup(width, height, 'Instructions: Match the cards based on their type.');
        this.addCloseButton(popup);
    }

    displayHintsPopup(width, height) {
        const popup = this.createPopup(width, height, 
            'Hints:\n- Click the crop image to learn facts.\n- Drag the insect card to the crop image center.'
        );
        this.addCloseButton(popup);
    }

    createPopup(width, height, text) {
        const popupWidth = Math.min(width * 0.4, 400);
        const popupHeight = Math.min(height * 0.3, 250);
        const popupX = (width - popupWidth) / 2;
        const popupY = (height - popupHeight) / 2;

        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x1a1a1a, 0.9);
        popupBackground.fillRoundedRect(popupX, popupY, popupWidth, popupHeight, 15);

        this.add.text(popupX + popupWidth / 2, popupY + popupHeight / 2, text, {
            fontSize: '18px',
            fill: '#ffffff',
            wordWrap: { width: popupWidth - 40 },
            align: 'center'
        }).setOrigin(0.5);
        
        return popupBackground;
    }

    addCloseButton(popupBackground) {
        const closeButton = this.add.text(popupBackground.x + popupBackground.width - 35, popupBackground.y + 10, '✕', {
            fontSize: '22px',
            fill: '#ff4d4d',
            fontStyle: 'bold',
        }).setInteractive();

        closeButton.on('pointerdown', () => {
            popupBackground.destroy();
            closeButton.destroy();
        });
    }
}

export default StartPageScene;
