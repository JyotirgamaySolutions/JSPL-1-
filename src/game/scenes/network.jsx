import Phaser from 'phaser';

class StartPageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'network' });
    }

    preload() {
        // Load the network image
        this.load.image('network', 'assets/network.png');
        this.load.image('homeButton', 'assets/home_button.png'); // Assuming you have a home button image
    }
    
    create() {
        const { width, height } = this.sys.game.canvas;

        // Add the network image to the scene
        this.image = this.add.image(0, 0, 'network');
        this.image.setOrigin(0, 0); // Set origin to top-left corner

        // Scale the image to cover the full screen
        this.image.setDisplaySize(width, height);

        // Set the initial camera bounds to match the screen size
        this.cameras.main.setBounds(0, 0, this.image.displayWidth, this.image.displayHeight);
        const minZoom = 1; // Ensures it fills the screen exactly
        this.cameras.main.setZoom(minZoom);

        // Enable zooming with the mouse wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const zoomFactor = 0.05;  // Step for zooming
            let newZoom = this.cameras.main.zoom + (deltaY < 0 ? zoomFactor : -zoomFactor);

            // Clamp zoom level between minZoom (original size) and 3x
            newZoom = Phaser.Math.Clamp(newZoom, minZoom, 3);

            // Get the pointer's position relative to the world
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

            // Set the new zoom level
            this.cameras.main.setZoom(newZoom);

            // Adjust the camera to zoom towards the pointer location
            const newWorldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.cameras.main.scrollX += worldPoint.x - newWorldPoint.x;
            this.cameras.main.scrollY += worldPoint.y - newWorldPoint.y;

            // Update the camera bounds after zooming
            const zoomedWidth = this.image.displayWidth * newZoom;
            const zoomedHeight = this.image.displayHeight * newZoom;
            this.cameras.main.setBounds(0, 0, zoomedWidth, zoomedHeight);
        });

        // Enable drag/pan functionality to move around after zooming
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.cameras.main.scrollX -= pointer.movementX / this.cameras.main.zoom;
                this.cameras.main.scrollY -= pointer.movementY / this.cameras.main.zoom;
            }
        });

        // Optional: Add a Home button for navigation
        this.time.delayedCall(5000, this.showHomeButton, [], this);
    }

    showHomeButton() {
        const { width, height } = this.sys.game.canvas;

        // Add a Home button to navigate back
        const homeButton = this.add.image(width / 2, height - 50, 'homeButton')
            .setInteractive({ useHandCursor: true })
            .setScale(0.1);

        // Handle the Home button click
        homeButton.on('pointerdown', () => {
            this.scene.start('StartPageScene');
        });
    }

    update() {
        // Optional: Implement any other real-time updates needed
    }
}

export default StartPageScene;
