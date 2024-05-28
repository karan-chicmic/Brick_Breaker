import { _decorator, BoxCollider2D, CircleCollider2D, Component, Node, PhysicsSystem, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;
@ccclass("Game")
export class BallScript extends Component {
    movementSpeed: number = 5;
    currentX: number = 0;
    currentY: number = 0;
    directionX: number = 1;
    directionY: number = -1;

    start() {
        this.currentX = this.node.position.x;
        this.currentY = this.node.position.y;
    }

    update(dt: number) {
        this.currentX += this.movementSpeed + this.directionX * dt;
        this.currentY += this.movementSpeed + this.directionY * dt;

        this.node.position = new Vec3(this.currentX, this.currentY, 0);

        this.checkBoundaryCollisions();
        this.checkBrickCollisions();
    }

    checkBoundaryCollisions() {
        const sceneWidth = this.node.parent.getComponent(UITransform).getBoundingBox().width;
        const sceneHeight = this.node.getComponent(UITransform).getBoundingBox().height;
        const ballRadius = this.node.getComponent(CircleCollider2D).radius;

        if (this.currentX + ballRadius > sceneWidth || this.currentX - ballRadius < 0) {
            this.directionX *= -1;
        }
        if (this.currentY + ballRadius > sceneHeight) {
            // Handle top boundary collision (e.g., game over)
        } else if (this.currentY - ballRadius < 0) {
            this.directionY *= -1;
        }
    }

    checkBrickCollisions() {
        for (const child of this.node.scene.children) {
            if (child.name === "Brick" && child.getComponent(BoxCollider2D)) {
                const collision = PhysicsSystem.instance.collisionTestColliderList(
                    this.node.getComponent(CircleCollider2D),
                    [child]
                ); // Using physics engine
                // if (collision) {
                this.handleBrickCollision(child);
                // }
            }
        }
    }
    // /Users/abhishekrawat/Documents/karan/Cocos_Second_Part_Projects/Brick_Breaker/assets/Script/Game/brick.ts

    handleBrickCollision(child: Node) {
        // Play a sound effect or visual cue for collision
        child.destroy();

        // Update ball direction based on collision point (implement your logic here)
        const ballCenterY = this.node.position.y;
        const brickTop = child.position.y + child.getComponent(BoxCollider2D).getComponent(UITransform).height;
        const brickBottom = child.position.y - child.getComponent(BoxCollider2D).getComponent(UITransform).height;

        if (ballCenterY > brickTop) {
            this.directionY *= -1;
        } else if (ballCenterY < brickBottom) {
            this.directionY *= -1;
        } else {
            // Update directionX based on collision side (implement your logic)
        }
    }
}
