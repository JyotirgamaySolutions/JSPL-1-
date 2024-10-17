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
                'Match the circle with the rectangle by dragging.\nClick on the rectangle to see an interesting fact!',
                true
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
    const card = this.add.image(width / 2, 190, 'rectangleCard1').setOrigin(0.5).setInteractive();
    card.setDisplaySize(width / 5, (width / 5) * 1.4);
    card.number = 5;

    // Set golden border
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xFFD700); // 0xFFD700 is the golden color
    graphics.strokeRect(
        card.x - card.displayWidth / 2, 
        card.y - card.displayHeight / 2, 
        card.displayWidth, 
        card.displayHeight
    );

    card.on('pointerdown', () => {
        this.displayPopup(card.x, card.y, 'Interesting fact about crops: They benefit greatly from honey bee pollination.', true);
    });

    return [card];
}

createCircleCards(width) {
    const cards = [];
    const cardNames = [
        'Wasp', 'Stingless_bees', 'Solitary_bee', 'Moth', 'Honey_bee',
        'Flies', 'Butterfly', 'Bumblebee', 'ANTS'
    ];

    const spacing = width / (this.totalCircles + 1);
    const cardWidth = 100;  // Width of the rectangle
    const cardHeight = 60;  // Height of the rectangle

    for (let i = 0; i < this.totalCircles; i++) {
        const xPos = (i + 1) * spacing;
        const card = this.add.image(xPos, 500, cardNames[i]).setOrigin(0.5).setInteractive();
        card.number = i + 1;
        card.setDisplaySize(cardWidth, cardHeight);

        // Set golden border as a rectangle
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xFFD700); // Golden color
        graphics.strokeRect(card.x - card.displayWidth / 2, card.y - card.displayHeight / 2, card.displayWidth, card.displayHeight);

        this.add.text(card.x, card.y + cardHeight / 2 + 20, cardNames[i].replace('_', ''), {
    fontSize: '15px',
    fill: '#FFFFFF',
    // backgroundColor: '#ffffff', // Set the background color to white
    padding: { left: 8, right: 8, top: 4, bottom: 4 }, // Add padding around the text
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
        this.displayPopup(matchedRectangleCard.x, matchedRectangleCard.y, 'You are correct! The answer is Honey Bee.', true);
        
        // Play the celebration star effect
        this.playCelebrationStarEffect();
    } else {
        this.displayPopup(circleCard.x, circleCard.y - 50, 'Incorrect');
    }
}





    checkIncorrectAttempts() {
        if (this.incorrectAttempts >= this.maxIncorrectAttempts) {
            this.displayPopup(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'The correct answer is Honey Bee.', true);
        }
    }

    isCloseEnough(circleCard, rectCard) {
        const threshold = 50;
        const distance = Phaser.Math.Distance.Between(circleCard.x, circleCard.y, rectCard.x, rectCard.y);
        return distance < threshold;
    }

    displayPopup(x, y, message, hasCloseButton = false) {
        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x000000, 0.7);
        popupBackground.fillRoundedRect(x - 150, y - 75, 300, 150, 15);
        popupBackground.setDepth(10);

        const popupText = this.add.text(x, y, message, {
            fontSize: '24px',
            fill: '#ffffff',
            wordWrap: { width: 250, useAdvancedWrap: true },
            align: 'center',
        }).setOrigin(0.5).setDepth(11);

        if (hasCloseButton) {
            const closeButton = this.add.text(x + 120, y - 50, 'X', {
                fontSize: '18px',
                fill: '#ff0000',
                fontStyle: 'bold',
                backgroundColor: '#ffffff',
                padding: { left: 5, right: 5, top: 2, bottom: 2 },
            }).setInteractive().setDepth(12);

            closeButton.on('pointerdown', () => {
                popupBackground.destroy();
                popupText.destroy();
                closeButton.destroy();
            });
        } else {
            this.time.delayedCall(1500, () => {
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
    const yesButton = this.add.text(x - 70, y + 30, 'Yes', {
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
