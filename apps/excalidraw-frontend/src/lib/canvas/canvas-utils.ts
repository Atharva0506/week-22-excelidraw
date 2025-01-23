import { FindElement, Tools } from "@/types";







export function getElementAtPosition(
    x: number,
    y: number,
    elements: Tools[]
  ): FindElement | undefined {
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
   * refrance link for below code  : https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line/17693146#17693146Z
   *
   * Rectangles: Check if x and y fall within the bounds of the rectangle defined by element.x, element.y, element.width, and element.height.
   * Circles: Calculate the distance between the point (x, y) and the center of the circle (element.centerX, element.centerY) and compare it to the radius of the circle.
   * Lines and Arrows: For both lines and arrows, you can calculate the distance from the point to the line segment using the pointToLineDistance helper function. If the distance is less than a threshold (e.g., 5 pixels), it's considered "within" the line or arrow.
   * Diamonds: For a diamond shape, check if the point lies within the bounding box that encompasses the diamond. You can adjust this logic if you want to use a more accurate point-in-polygon check.
   * Pencil: For the pencil shape (which could be a freehand line), check if the point is near any of the path segments formed by consecutive points in the element.points array.
   */
  function isWithinElement(x: number, y: number, element: Tools): boolean {
    if (element.type === "rect") {
      return (
        x >= element.x! &&
        x <= element.x! + element.width! &&
        y >= element.y! &&
        y <= element.y! + element.height!
      );
    } else if (element.type === "circle") {
      const distance = Math.sqrt(
        (x - element.centerX!) ** 2 + (y - element.centerY!) ** 2
      );
      return distance <= element.radius!;
    } else if (element.type === "line" || element.type === "arrow") {
      const distance = pointToLineDistance(
        x,
        y,
        element.startX!,
        element.startY!,
        element.endX!,
        element.endY!
      );
      return distance <= 5; // Adjust threshold as needed
    } else if (element.type === "diamond") {
      const halfWidth = element.width! / 2;
      const halfHeight = element.height! / 2;
      return (
        x >= element.x! - halfWidth &&
        x <= element.x! + halfWidth &&
        y >= element.y! - halfHeight &&
        y <= element.y! + halfHeight
      );
    } else if (element.type === "pencil") {
      for (let i = 0; i < element.points!.length - 1; i++) {
        const p1 = element.points![i];
        const p2 = element.points![i + 1];
        const distance = pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
        if (distance <= 5) {
          return true;
        }
      }
    }
    return false;
  }
  
  function pointToLineDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const numerator = Math.abs(
      (y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1
    );
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    return numerator / denominator;
  }
  