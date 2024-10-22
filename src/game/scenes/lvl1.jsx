import Phaser from 'phaser';
import gsap from 'gsap';

class MatchingGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'lvl1' });
        this.matchedCount = 0;
        this.totalPairs = 1;
        this.totalCircles = 9;
        this.popups = {};
        this.incorrectAttempts = 0;
        this.maxIncorrectAttempts = 6;
    }

    preload() {
        // Load images for the game
        this.load.image('rectangleCard1', 'assets/1.png');
        this.load.image('Wasp', 'assets/Wasp.jpg');
        this.load.image('Stingless_bees', 'assets/Stingless_bees.jpg');
        this.load.image('Solitary_bee', 'assets/Solitary_bee.jpg');
        this.load.image('Moth', 'assets/Moth.jpg');
        this.load.image('Honey_bee', 'assets/Honey_bee.jpg');
        this.load.image('Flies', 'assets/Flies.jpg');
        this.load.image('Butterfly', 'assets/Butterfly.jpg');
        this.load.image('Bumblebee', 'assets/Bumblebee.jpg');
        this.load.image('ANTS', 'assets/ANTS.jpg');
        this.load.image('background', 'assets/bg.png');
        this.load.image('rightArrow', 'assets/rightArrow.png');
        this.load.image('spark', 'assets/spark.png');  // Ensure this is in your preload method

    }

    create() {
        const { width, height } = this.sys.game.config;

        // Create background
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

        // Create rectangle and circle cards
        this.rectangleCards = this.createRectangleCard(width);
        this.circleCards = this.createCircleCards(width);

        // Set up interactivity
        this.setupCardInteractivity();

        // Add right arrow button for redirect to the next level
        this.addRightArrow(width, height);

        // Add quit and instruction buttons
        this.createControlButtons();
    }

    createControlButtons() {
        // Create Instruction button at the top-left
        const instructionButton = this.add.text(50, 50, 'Instructions', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setInteractive();

        // Instruction popup
        instructionButton.on('pointerdown', () => {
            this.displayPopup(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2,
                'Match the insects with the crop card by dragging. Drag the card in centre of the crop card for matching',
                
            );
        });

        // Create Quit Game button at the top-right
        const quitButton = this.add.text(this.sys.game.config.width - 180, 50, 'Quit Game', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setInteractive();

        // Quit game popup with options
        quitButton.on('pointerdown', () => {
            this.displayQuitPopup(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2
            );
        });
    }

    createRectangleCard(width) {
    const isLaptop = window.innerWidth <= 1366 && window.innerHeight <= 768; // Detect laptop screen

    // Adjust Y-position for laptop vs. other screens
    const rectangleY = isLaptop ? 180 : 300;

    // Create the rectangle card with adjusted Y position
    const card = this.add.image(width / 2, rectangleY, 'rectangleCard1')
        .setOrigin(0.5).setInteractive();
    card.setDisplaySize(width / 5, (width / 5) * 1.4);
    card.number = 5;

    // Draw golden border
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xFFD700);
    graphics.strokeRect(
        card.x - card.displayWidth / 2,
        card.y - card.displayHeight / 2,
        card.displayWidth,
        card.displayHeight
    );

    // Handle click event with a popup
    card.on('pointerdown', () => {
        this.displayPopup(
            card.x,
            card.y,
            'In fiscal year 2023, the volume of tamarind production in India is estimated to be 162 thousand metric tons.',
            
        );
    });

    return [card];
}

createCircleCards(width) {
    const isLaptop = window.innerWidth <= 1366 && window.innerHeight <= 768; // Detect laptop screen

    // Adjust vertical position, dimensions, and font size
    const verticalPosition = isLaptop ? 500 : 800;
    const cardWidth = isLaptop ? 100 : 110;
    const cardHeight = isLaptop ? 60 : 80;
    const fontSize = isLaptop ? '12px' : '20px';

    const cards = [];
    const cardNames = [
        'Wasp', 'Stingless_bees', 'Solitary_bee', 'Moth', 'Honey_bee',
        'Flies', 'Butterfly', 'Bumblebee', 'ANTS'
    ];

    const spacing = width / (this.totalCircles + 1); // Horizontal spacing

    for (let i = 0; i < this.totalCircles; i++) {
        const xPos = (i + 1) * spacing;
        
        const card = this.add.image(xPos, verticalPosition, cardNames[i])
            .setOrigin(0.5).setInteractive();
        card.number = i + 1;
        card.setDisplaySize(cardWidth, cardHeight);

        // Draw golden border
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xFFD700);
        graphics.strokeRect(
            card.x - card.displayWidth / 2,
            card.y - card.displayHeight / 2,
            card.displayWidth,
            card.displayHeight
        );

        // Add label with dynamic font size
        this.add.text(card.x, card.y + cardHeight / 2 + 30, cardNames[i].replace('_', ' '), {
            fontSize: fontSize,
            fill: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { left: 8, right: 8, top: 4, bottom: 4 },
            align: 'center'
        }).setOrigin(0.5);

        cards.push(card);
    }

    return cards;
}

    setupCardInteractivity() {
        this.circleCards.forEach((circleCard) => {
            this.input.setDraggable(circleCard);

            circleCard.on('dragstart', (pointer, dragX, dragY) => this.onDragStart(circleCard));
            circleCard.on('drag', (pointer, dragX, dragY) => this.onDrag(circleCard, dragX, dragY));
            circleCard.on('dragend', () => this.onDragEnd(circleCard));
        });
    }

    onDragStart(card) {
        gsap.to(card, { scale: 0.5, duration: 0.2 });
    }

    onDrag(card, dragX, dragY) {
        gsap.to(card, { x: dragX, y: dragY, ease: 'none', duration: 0.05 });
    }

    onDragEnd(card) {
        gsap.to(card, { scale: 0.1, duration: 0.2 });

        const matchedRectangleCard = this.rectangleCards.find((rectCard) =>
            this.isCloseEnough(card, rectCard) && rectCard.number === card.number
        );

        if (matchedRectangleCard) {
            gsap.to(card, { x: matchedRectangleCard.x, y: matchedRectangleCard.y, duration: 0.5 });
            this.handleMatch(card, matchedRectangleCard, true);
        } else {
            gsap.to(card, {
                x: card.input.dragStartX,
                y: card.input.dragStartY,
                scale: 0.1,
                duration: 0.5
            });
            this.incorrectAttempts++;
            this.checkIncorrectAttempts();
        }
    }

    handleMatch(circleCard, matchedRectangleCard, isCorrect) {
    if (isCorrect) {
        circleCard.setVisible(false);

        // Display the correct match popup
        this.displayPopup(matchedRectangleCard.x, matchedRectangleCard.y, 'Congratulations!!! You are correct! The answer is Honey Bee.');
        
        // Play the celebration star effect
        this.playCelebrationStarEffect();
    } else {
        this.displayPopup(circleCard.x, circleCard.y - 50, 'Incorrect');
    }
}





    checkIncorrectAttempts() {
        if (this.incorrectAttempts >= this.maxIncorrectAttempts) {
            this.displayPopup(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Sorry, The correct answer is Honey Bee.');
        }
    }

    isCloseEnough(circleCard, rectCard) {
        const threshold = 50;
        const distance = Phaser.Math.Distance.Between(circleCard.x, circleCard.y, rectCard.x, rectCard.y);
        return distance < threshold;
    }

    displayPopup(x, y, message, hasCloseButton = false) {
    // Create the popup background with rounded corners
    const popupBackground = this.add.graphics();
    popupBackground.fillStyle(0x000000, 0.7);  // Set background color and transparency
    popupBackground.fillRoundedRect(x - 220, y - 75, 440, 200, 40);  // Adjust size and position
    popupBackground.lineStyle(4, 0xFFD700);  // Add a golden border
    popupBackground.strokeRoundedRect(x - 220, y - 75, 440, 200, 40);  // Draw the border
    popupBackground.setDepth(10);  // Ensure it's drawn above other elements

    // Add the text within the popup
    const popupText = this.add.text(x, y, message, {
        fontSize: '24px',
        fill: '#ffffff',  // Text color
        wordWrap: { width: 450, useAdvancedWrap: true },  // Enable word wrapping for long text
        align: 'center',  // Center the text
    }).setOrigin(0.5).setDepth(11);  // Make sure the text is centered and above the background

    if (hasCloseButton) {
        const closeButton = this.add.text(x + 120, y - 50, 'X', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold',
            backgroundColor: '#ffffff',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
        }).setInteractive().setDepth(12);  // Add an interactive close button

        closeButton.on('pointerdown', () => {
            popupBackground.destroy();  // Remove the popup background
            popupText.destroy();  // Remove the popup text
            closeButton.destroy();  // Remove the close button
        });
    } else {
        // Auto-destroy the popup after 3 seconds if there's no close button
        this.time.delayedCall(5000, () => {
            popupBackground.destroy();
            popupText.destroy();
        });
    }
}


    displayQuitPopup(x, y) {
    // Create the popup background
    const popupBackground = this.add.graphics();
    popupBackground.fillStyle(0x000000, 0.7);
    popupBackground.fillRoundedRect(x - 150, y - 75, 300, 150, 15);
    popupBackground.setDepth(10);

    // Add popup message
    const popupText = this.add.text(x, y - 30, 'Do you want to quit the game?', {
        fontSize: '24px',
        fill: '#ffffff',
        wordWrap: { width: 250, useAdvancedWrap: true },
        align: 'center',
    }).setOrigin(0.5).setDepth(11);

    // Add "Yes" button inside the popup
    const yesButton = this.add.text(x - 120, y + 30, 'Yes', {
        fontSize: '22px',
        fill: '#ffffff',
        backgroundColor: '#00ff00',
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setInteractive().setDepth(11);

    // "Yes" button functionality
    yesButton.on('pointerdown', () => {
        popupBackground.destroy();
        popupText.destroy();
        yesButton.destroy();
        noButton.destroy();
        this.scene.stop('lvl1');
        this.scene.start('StartPageScene'); // Assuming GameOverScene exists.
    });

    // Add "No" button inside the popup
    const noButton = this.add.text(x + 70, y + 30, 'No', {
        fontSize: '22px',
        fill: '#ffffff',
        backgroundColor: '#ff0000',
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setInteractive().setDepth(11);

    // "No" button functionality
    noButton.on('pointerdown', () => {
        popupBackground.destroy();
        popupText.destroy();
        yesButton.destroy();
        noButton.destroy();
    });
}

playCelebrationStarEffect() {
    const { width, height } = this.sys.game.config;  // Get screen width and height

    // Function to draw a star shape
    const createStar = (x, y, points, innerRadius, outerRadius, color) => {
        const star = this.add.graphics().setDepth(30);  // Ensure stars are on top layer

        star.fillStyle(color, 1);
        star.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = i * (Math.PI * 2) / points;
            const radius = (i % 2 === 0) ? outerRadius : innerRadius;
            const starX = x + Math.cos(angle) * radius;
            const starY = y + Math.sin(angle) * radius;
            if (i === 0) {
                star.moveTo(starX, starY);
            } else {
                star.lineTo(starX, starY);
            }
        }
        star.closePath();
        star.fillPath();
        return star;
    };

    // Function to animate the star flying towards the center
    const launchStar = (star, startX, startY, centerX, centerY, duration) => {
        this.tweens.add({
            targets: star,
            x: { from: startX, to: centerX },
            y: { from: startY, to: centerY },
            alpha: { from: 1, to: 0 },  // Fade out the star as it reaches the center
            duration: duration,
            ease: 'Power1',
            onComplete: () => star.destroy()  // Remove star after animation
        });
    };

    // Coordinates of the center of the screen
    const centerX = width / 2;
    const centerY = height / 2;

    // Create and launch stars from each corner
    const cornerPositions = [
        { x: 0, y: 0 },             // Top-left corner
        { x: width, y: 0 },         // Top-right corner
        { x: 0, y: height },        // Bottom-left corner
        { x: width, y: height }     // Bottom-right corner
    ];

    // Create stars from each corner
    cornerPositions.forEach((corner) => {
        for (let i = 0; i < 10; i++) {  // Adjust the number of stars from each corner
            const star = createStar(corner.x, corner.y, 5, 10, 20, 0xFFFF00);  // Yellow stars
            const duration = Phaser.Math.Between(1000, 1500);  // Random duration for more natural effect
            launchStar(star, corner.x, corner.y, centerX, centerY, duration);
        }
    });
}

    addRightArrow(width, height) {
        const rightArrow = this.add.image(width - 50, height / 2, 'rightArrow').setInteractive();
        rightArrow.setDisplaySize(120, 100);

        rightArrow.on('pointerdown', () => {
            this.scene.start('lvl2');
        });
    }
}

export default MatchingGameScene;
