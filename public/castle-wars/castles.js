class Castle {
    constructor(ctx, x, color, layers, scorePosX, scorePosY) {
        this.ctx = ctx;
        this.x = x;
        this.color = color;
        this.layers = layers;
        this.stoneSize = 20;
        this.castleWidth = Math.max(...layers) * this.stoneSize;
        this.castleHeight = layers.length * this.stoneSize;
        this.angle = color === 'red' ? 45 : 135;
        this.velocity = 10;
        this.score = 0;
        this.scorePosX = scorePosX;
        this.scorePosY = scorePosY;
    }

    draw() {
        let y = this.ctx.canvas.height - this.castleHeight;
        for (let layer of this.layers) {
            let layerWidth = layer * this.stoneSize;
            let startX = this.x + (this.castleWidth - layerWidth) / 2;
            for (let i = 0; i < layer; i++) {
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(startX + i * this.stoneSize, y, this.stoneSize, this.stoneSize);
            }
            y += this.stoneSize;
        }
        this.drawTrajectoryLine();
        this.drawScore();
    }

    adjustAngle(increase) {
        const change = 5;
        this.angle += increase ? change : -change;
        this.angle = Math.max(5, Math.min(this.angle, 175)); // Keep the angle within bounds
    }

    drawTrajectoryLine() {
        const radianAngle = this.angle * Math.PI / 180;
        const endX = this.x + Math.cos(radianAngle) * 100; // Length of the trajectory line
        const endY = this.ctx.canvas.height - this.castleHeight - Math.sin(radianAngle) * 100;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.ctx.canvas.height - this.castleHeight);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = this.color;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawScore() {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText(`Score: ${this.score}`, this.scorePosX, this.scorePosY);
    }

    fireProjectile(opponent) {
        let projectileX = this.x;
        let projectileY = this.ctx.canvas.height - this.castleHeight;
        const radianAngle = this.angle * Math.PI / 180;
        let speedX = Math.cos(radianAngle) * this.velocity;
        let speedY = Math.sin(radianAngle) * this.velocity * -1; // Negative for upward motion

        const animateProjectile = () => {
            this.ctx.clearRect(projectileX - 5, projectileY - 5, 10, 10); // Clear the previous projectile position

            projectileX += speedX;
            projectileY += speedY;
            speedY += 0.2; // Simulate gravity

            // Stop if it hits the ground
            if (projectileY > this.ctx.canvas.height) return;

            // Detect collision with the opponent castle
            if (projectileX >= opponent.x && projectileX <= (opponent.x + opponent.castleWidth) &&
                projectileY >= opponent.y && projectileY <= (opponent.y + opponent.castleHeight)) {
                this.score++;
                this.drawScore();
                return; // Stop animation on hit
            }

            // Draw the projectile
            this.ctx.beginPath();
            this.ctx.arc(projectileX, projectileY, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "black";
            this.ctx.fill();

            requestAnimationFrame(animateProjectile);
        };

        animateProjectile();
    }
}

// Initialization
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 600; // Increased canvas height for more vertical space

const layersPattern = [5, 4, 5, 4, 5];
const leftCastle = new Castle(ctx, 100, 'red', layersPattern, 50, 30);
const rightCastle = new Castle(ctx, canvas.width - 100 - 100, 'blue', layersPattern, canvas.width - 150, 30);

function drawCastles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    leftCastle.draw();
    rightCastle.draw();
}

drawCastles(); // Initial draw
