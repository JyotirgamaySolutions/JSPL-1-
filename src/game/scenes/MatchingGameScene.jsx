import Phaser from 'phaser';

class StartPageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartPageScene' });
    }

    preload() {
        this.load.image('background1', 'assets/bg2.jpg');
        this.load.audio('birdSound', 'assets/bird.mp3'); // Preload bird sound
    }

    create() {
        this.updateLayout();

        // Ensure the sound plays only after the first user interaction
        this.input.once('pointerdown', () => this.playBackgroundSound());

        // Throttle the resize event to optimize performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.updateLayout(), 100);
        });
    }

    playBackgroundSound() {
        if (!this.sound.get('birdSound')) {
            console.log('Playing bird sound...');
            this.birdSound = this.sound.add('birdSound', { loop: true, volume: 0.5 });
            this.birdSound.play();
        }
    }

    updateLayout() {
        const { width, height } = this.sys.game.canvas;
        this.children.removeAll(); // Clear previous elements

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
        const buttonWidth = Math.min(this.sys.game.canvas.width * 0.25, 200);
        const buttonHeight = Math.min(this.sys.game.canvas.height * 0.08, 50);
        const cornerRadius = 20;

        const button = this.add.graphics();
        button.fillStyle(0x008080, 1);
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${buttonHeight / 2}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);

        const buttonContainer = this.add.container(x, y, [button, buttonText]);
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick)
            .on('pointerover', () => this.onHover(button))
            .on('pointerout', () => this.onOut(button));
    }

    quitGame() {
        window.open('https://rrbcea.vercel.app', '_blank'); // Opens in a new tab
    }

    onHover(button) {
        button.setFillStyle(0x00cccc); // Change color on hover
    }

    onOut(button) {
        button.setFillStyle(0x008080); // Revert color on hover out
    }

    displayInstructionPopup(width, height) {
        this.displayPopup(
            width, height,
            'Instructions: Match the cards based on their type.'
        );
    }

    displayHintsPopup(width, height) {
        this.displayPopup(
            width, height,
            'Hints: You can see facts by clicking on the crop image.\nDrag the insect card to the center of the crop image.'
        );
    }

    displayPopup(width, height, message) {
        const popupWidth = Math.min(width * 0.4, 400);
        const popupHeight = Math.min(height * 0.3, 250);
        const isLargeScreen = width >= 1920;

        const popupX = isLargeScreen ? width * 0.6 : width / 2 - popupWidth / 2;
        const popupY = height / 2 - popupHeight / 2;

        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x1a1a1a, 0.9);
        popupBackground.fillRoundedRect(popupX, popupY, popupWidth, popupHeight, 15);
        popupBackground.lineStyle(3, 0xffffff);
        popupBackground.strokeRoundedRect(popupX, popupY, popupWidth, popupHeight, 15);
        popupBackground.setDepth(10);

        const popupText = this.add.text(
            popupX + popupWidth / 2,
            popupY + popupHeight / 2 - 20,
            message,
            {
                fontSize: '18px',
                fill: '#ffffff',
                wordWrap: { width: popupWidth - 40, useAdvancedWrap: true },
                align: 'center',
            }
        ).setOrigin(0.5).setDepth(11);

        const closeButton = this.add.text(
            popupX + popupWidth - 35, popupY + 10,
            '✕', {
                fontSize: '22px',
                fill: '#ff4d4d',
                fontStyle: 'bold',
                backgroundColor: '#2e2e2e',
                padding: { left: 5, right: 5, top: 2, bottom: 2 },
            }
        ).setInteractive().setDepth(12);

        closeButton.on('pointerdown', () => {
            popupBackground.destroy();
            popupText.destroy();
            closeButton.destroy();
        });
    }
}

export default StartPageScene;
