import Phaser from 'phaser';
import gsap from 'gsap';

class MatchingGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'lvl9' });
        this.matchedCount = 0;
        this.totalPairs = 1; // Only 1 rectangle card
        this.totalCircles = 9; // 9 circle cards
        this.popups = {}; // Store popups for rectangle cards
        this.incorrectAttempts = 0; // Track incorrect attempts
        this.maxIncorrectAttempts = 6; // Maximum incorrect attempts before showing the correct answer
        this.correctAnswers = ['Honey_bee', 'Solitary_bee', 'Stingless_bees'  ]; // Define correct answers
        this.correctMatches = new Set(); // Track matched correct answers
    }

    preload() {
        // Load images for the game
        this.load.image('rectangleCard9', 'assets/9.png'); // Updated to 2.png
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
        this.load.image('leftArrow', 'assets/leftArrow.png'); // Load left arrow image
        this.load.image('spark', 'assets/spark.png'); // Load particle image for the win bomb effect
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Create background
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(width, height);

        // Create a single rectangle card
        this.rectangleCards = this.createRectangleCard(width);

        // Create 9 circle cards at the bottom with names below
        this.circleCards = this.createCircleCards(width);

        // Set up interactivity
        this.setupCardInteractivity();

        // Add right arrow button for redirect to the next level
        this.addRightArrow(width, height);

        // Add left arrow button for redirect back to the previous level or screen
        this.addLeftArrow(width, height);

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
        this.scene.stop('lvl9');
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


createRectangleCard(width) {
    const isLaptop = window.innerHeight < 900;
    const yPos = isLaptop ? 180 : 300;
    const card = this.add.image(width / 2, yPos, 'rectangleCard9')
        .setOrigin(0.5)
        .setInteractive();
    
    card.setDisplaySize(width / 5, (width / 5) * 1.4); // Adjust card size

    // Add click event to show an interesting fact
    card.on('pointerdown', () => {
        this.displayPopup(card.x, card.y, 
            'Interesting fact about crops: They benefit greatly from honey bee pollination.', true
        );
    });

    // Add a golden border
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xFFD700); // Golden color
    graphics.strokeRect(
        card.x - card.displayWidth / 2, 
        card.y - card.displayHeight / 2, 
        card.displayWidth, 
        card.displayHeight
    );

    return [card]; // Return an array for consistency
}

createCircleCards(width) {
    const cards = [];
    const cardNames = [
        'Wasp', 'Stingless_bees', 'Solitary_bee', 'Moth', 'Honey_bee',
        'Flies', 'Butterfly', 'Bumblebee', 'ANTS'
    ];
const isLaptop = window.innerHeight < 900;
    const spacing = width / (this.totalCircles + 1);
    const verticalPosition = isLaptop ? 500 : 800;
    const cardWidth = isLaptop ? 100 : 110;
    const cardHeight = isLaptop ? 60 : 80;
    const fontSize = isLaptop ? '12px' : '20px';

    for (let i = 0; i < this.totalCircles; i++) {
        const xPos = (i + 1) * spacing;
        const card = this.add.image(xPos, verticalPosition, cardNames[i])
            .setOrigin(0.5)
            .setInteractive();
        
        card.setDisplaySize(cardWidth, cardHeight);
        card.name = cardNames[i]; // Set name property

        // Add golden border
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xFFD700); // Golden color
        graphics.strokeRect(
            card.x - card.displayWidth / 2, 
            card.y - card.displayHeight / 2, 
            card.displayWidth, 
            card.displayHeight
        );

        // Add label text below each card
        this.add.text(
            card.x, 
            card.y + cardHeight / 2 + 20, 
            cardNames[i].replace('_', ' '), 
            {
                fontSize: fontSize,
                fill: '#FFFFFF',
                backgroundColor: '#000000',
                padding: { left: 8, right: 8, top: 4, bottom: 4 },
                align: 'center'
            }
        ).setOrigin(0.5);

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
            this.isCloseEnough(card, rectCard) && this.correctAnswers.includes(card.name)
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
            this.correctMatches.add(circleCard.name);

            // Only show a congratulatory popup if all correct answers are matched
            if (this.correctMatches.size === this.correctAnswers.length) {
                this.displayPopup(matchedRectangleCard.x, matchedRectangleCard.y, 'Congratulations! You matched all the correct answers.', true);
                this.playWinBombEffect(matchedRectangleCard.x, matchedRectangleCard.y);
            }
        }
    }

    checkIncorrectAttempts() {
        // Show the correct answer popup if the user reaches 6 incorrect attempts without matching all correct answers
        if (this.incorrectAttempts >= this.maxIncorrectAttempts && this.correctMatches.size < this.correctAnswers.length) {
            this.displayPopup(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'The correct answers for cashew are ......', true);
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

    playWinBombEffect(x, y) {
        const particles = this.add.particles('spark');
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
        });

        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }

    addRightArrow(width, height) {
        const rightArrow = this.add.image(width - 50, height / 2, 'rightArrow').setInteractive();
        rightArrow.setDisplaySize(120, 100);

        rightArrow.on('pointerdown', () => {
            this.scene.start('lvl10');
        });
    }

    addLeftArrow(width, height) {
        const leftArrow = this.add.image(50, height / 2, 'leftArrow').setInteractive();
        leftArrow.setDisplaySize(120, 100);

        leftArrow.on('pointerdown', () => {
            this.scene.start('lvl8'); // Adjust to your actual previous scene key
        });
    }
}

export default MatchingGameScene;

