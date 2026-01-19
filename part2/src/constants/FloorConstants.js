export const FLOOR_WIDTH = 100.0;
export const FLOOR_HEIGHT = 100.0;
export const FLOOR_TEXTURE_REPEAT = 10;

/**
 * Calculates floor boundary for orb placement
 * @param {number} floorWidth - Width of the floor
 * @returns {number} Boundary value for orb placement
 */
export const getFloorBoundary = (floorWidth) => {
  return floorWidth / 2 - 10;
};
