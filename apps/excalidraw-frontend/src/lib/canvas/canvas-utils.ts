import { Tools } from "@/types";

export function getElementAtPosition(x: number, y: number, elements: Tools[]) {
  return elements.find((element) => isWithinElement(x, y, element));
}

/**
 *
 * @param x
 * @param y
 * @param element
 * @returns boolen
 *
 * checks if elements is within element
 *
 *
 * Rectangles: Check if x and y fall within the bounds of the rectangle defined by element.x, element.y, element.width, and element.height.
 * Circles: Calculate the distance between the point (x, y) and the center of the circle (element.centerX, element.centerY) and compare it to the radius of the circle.
 * Lines and Arrows: For both lines and arrows, you can calculate the distance from the point to the line segment using the pointToLineDistance helper function. If the distance is less than a threshold (e.g., 5 pixels), it's considered "within" the line or arrow.
 * Diamonds: For a diamond shape, check if the point lies within the bounding box that encompasses the diamond. You can adjust this logic if you want to use a more accurate point-in-polygon check.
 * Pencil: For the pencil shape (which could be a freehand line), check if the point is near any of the path segments formed by consecutive points in the element.points array.
 */

export function isWithinElement(x: number, y: number, element: Tools) {
  switch (element.type) {
    case "rect": {
      const minX = Math.min(element.x1, element.x2);
      const maxX = Math.max(element.x1, element.x2);
      const minY = Math.min(element.y1, element.y2);
      const maxY = Math.max(element.y1, element.y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }

    case "circle": {
      // https://stackoverflow.com/questions/16792841/detect-if-user-clicks-inside-a-circle
      const distancesquared = (x - element.x1) * (x - element.x1) + (y - element.y1) * (y - element.y1);
      return distancesquared <= element.radius * element.radius;
    }

    case "line": {
      return isPointNearLine(
        x,
        y,
        element.x1,
        element.y1,
        element.x2,
        element.y2
      );
    }

    case "arrow": {
      return isPointNearLine(
        x,
        y,
        element.x1,
        element.y1,
        element.x2,
        element.y2
      );
    }

    case "diamond": {
      const centerX = (element.x1 + element.x2) / 2;
      const centerY = (element.y1 + element.y2) / 2;
      const halfWidth = Math.abs(element.x2 - element.x1) / 2;
      const halfHeight = Math.abs(element.y2 - element.y1) / 2;
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      return dx / halfWidth + dy / halfHeight <= 1;
    }

    case "pencil": {
      return element.points.some((point, index, points) => {
        if (index === 0) return false;
        return isPointNearLine(
          x,
          y,
          points[index - 1].x1,
          points[index - 1].y1,
          point.x1,
          point.y1
        );
      });
    }

    case "cursor":
      return false;

    default:
      return false;
  }
}

//  check if a point is near a line segment
// refrance link for below code  : https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line/17693146#17693146ZZ
function isPointNearLine(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  threshold = 5
) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  const param = lenSq !== 0 ? dot / lenSq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return dx * dx + dy * dy <= threshold * threshold;
}
