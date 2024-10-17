import Phaser from 'phaser';

class StartPageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartPageScene' });
    }

    preload() {
        // Load background image specific to this start page
        this.load.image('background1', 'assets/bg2.jpg');
        this.load.script('webglfilter', 'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.50.0/dist/phaser.js');
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Create background and apply blur
        const background = this.add.image(0, 1, 'background1').setOrigin(0).setDisplaySize(width, height);
        this.applyBlur(background);

        // Create buttons with black border
        this.createButtons(width, height);
    }

    createButtons(width, height) {
        // Create rounded rectangle Play button with border
        this.createRoundedButton(width / 2, height / 2 - 100, 'Play Game', () => this.scene.start('lvl1'));

        // Create rounded rectangle Instruction button with border
        this.createRoundedButton(width / 2, height / 2, 'Instruction', () => this.displayInstructionPopup(width, height));

        // Create rounded rectangle Hints button with border
        this.createRoundedButton(width / 2, height / 2 + 100, 'Hints', () => this.scene.start('HintsPage'));
    }

    createRoundedButton(x, y, text, onClick) {
        // Create rounded rectangle button with black border
        const button = this.add.graphics();
        const buttonWidth = 200;
        const buttonHeight = 50;
        const cornerRadius = 20;

        // Draw button background
        button.fillStyle(0x008080, 1); // Teal color
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

        // Add black border
        button.lineStyle(4, 0x000000, 1); // Black border
        button.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

        // Add text to the button
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Combine button graphics and text into a container
        const buttonContainer = this.add.container(x, y, [button, buttonText]);

        // Enable interaction with the button
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick)
            .on('pointerover', () => this.onHover(button))
            .on('pointerout', () => this.onOut(button));
    }

    onHover(button) {
        // Change button color on hover
        button.clear();
        button.fillStyle(0x00cccc, 1); // Lighter teal color
        button.fillRoundedRect(-100, -25, 200, 50, 20);

        // Add black border on hover
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-100, -25, 200, 50, 20);
    }

    onOut(button) {
        // Reset button color when not hovered
        button.clear();
        button.fillStyle(0x008080, 1); // Original teal color
        button.fillRoundedRect(-100, -25, 200, 50, 20);

        // Add black border when not hovered
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-100, -25, 200, 50, 20);
    }

    displayInstructionPopup(width, height) {
        // Create popup background
        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x000000, 0.7);
        popupBackground.fillRoundedRect(width / 2 - 200, height / 2 - 100, 400, 200, 15);
        popupBackground.setDepth(10);

        // Create popup text
        const instructionText = this.add.text(width / 2, height / 2, 'Instructions: Match the cards based on their type.', {
            fontSize: '20px',
            fill: '#ffffff',
            wordWrap: { width: 350, useAdvancedWrap: true },
            align: 'center',
        }).setOrigin(0.5).setDepth(11);

        // Close button
        const closeButton = this.add.text(width / 2 + 150, height / 2 - 70, 'X', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold',
            backgroundColor: '#ffffff',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
        }).setInteractive().setDepth(12);

        closeButton.on('pointerdown', () => {
            popupBackground.destroy();
            instructionText.destroy();
            closeButton.destroy();
        });
    }

    applyBlur(background) {
        // Apply a basic blur effect to the background
        const blurPipeline = this.game.renderer.pipelines.get('Blur');
        background.setPipeline(blurPipeline); // Phaser built-in pipeline for blur
    }
}

export default StartPageScene;
