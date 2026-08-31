/**
 * Brick Blitz - Math & Physics Utility Helpers
 */

export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export const lerp = (a, b, t) => a + (b - a) * t;

export const randomRange = (min, max) => Math.random() * (max - min) + min;

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

/**
 * Circle to AABB (Axis-Aligned Bounding Box) Collision Detection
 * Returns null if no collision, or collision resolution info object.
 */
export function checkCircleAABBCollision(circle, rect) {
  // Find closest point on rect to circle center
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);

  const distX = circle.x - closestX;
  const distY = circle.y - closestY;
  const distanceSq = distX * distX + distY * distY;

  if (distanceSq <= circle.radius * circle.radius) {
    const dist = Math.sqrt(distanceSq);

    // Determine normal vector of impact
    let nx = 0;
    let ny = 0;
    let overlap = 0;

    if (dist === 0) {
      // Circle center is inside box - push out along smallest overlap
      const overlapLeft = circle.x - rect.x + circle.radius;
      const overlapRight = rect.x + rect.width - circle.x + circle.radius;
      const overlapTop = circle.y - rect.y + circle.radius;
      const overlapBottom = rect.y + rect.height - circle.y + circle.radius;

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      if (minOverlap === overlapLeft) { nx = -1; overlap = overlapLeft; }
      else if (minOverlap === overlapRight) { nx = 1; overlap = overlapRight; }
      else if (minOverlap === overlapTop) { ny = -1; overlap = overlapTop; }
      else { ny = 1; overlap = overlapBottom; }
    } else {
      nx = distX / dist;
      ny = distY / dist;
      overlap = circle.radius - dist;
    }

    return {
      collided: true,
      normalX: nx,
      normalY: ny,
      overlap,
      closestX,
      closestY
    };
  }

  return null;
}

/**
 * AABB to AABB Collision Detection (e.g. Laser / Powerup to Paddle/Brick)
 */
export function checkAABBCollision(r1, r2) {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
