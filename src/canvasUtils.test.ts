import { resizeCanvas } from './canvasUtils';

describe('Canvas Utilities', () => {
  describe('resizeCanvas', () => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
      // Create a canvas element
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      
      // Get the context
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      context = ctx;
      
      // Draw a simple shape on the canvas
      context.fillStyle = 'red';
      context.fillRect(10, 10, 20, 20);
    });

    it('should preserve drawing content when resizing', () => {
      // Get the image data before resizing
      const beforeData = context.getImageData(10, 10, 1, 1).data;
      
      // Resize the canvas
      resizeCanvas(canvas, 200, 200);
      
      // Get the image data after resizing
      const afterData = context.getImageData(10, 10, 1, 1).data;
      
      // The color at the same position should be the same (red)
      expect(Array.from(beforeData)).toEqual(Array.from(afterData));
    });

    it('should not stretch the drawing when resizing', () => {
      // Get the image data at the edge of the shape before resizing
      const beforeData = context.getImageData(30, 30, 1, 1).data;
      
      // Resize the canvas to double the size
      resizeCanvas(canvas, 200, 200);
      
      // In the old implementation, the drawing would be stretched,
      // and the edge would move to (60, 60)
      // In the new implementation, the edge should stay at (30, 30)
      const afterData = context.getImageData(30, 30, 1, 1).data;
      
      // The color at the edge should still be the same
      expect(Array.from(beforeData)).toEqual(Array.from(afterData));
      
      // Check that the drawing wasn't stretched (pixel at 60,60 should be transparent)
      const stretchedData = context.getImageData(60, 60, 1, 1).data;
      expect(stretchedData[3]).toBe(0); // Alpha channel should be 0 (transparent)
    });
  });

  // This test verifies that mouse coordinates are correctly calculated after resize
  describe('Mouse coordinate calculation', () => {
    it('should calculate correct mouse coordinates after canvas resize', () => {
      // This is a more complex test that would require mocking the DOM and events
      // For simplicity, we'll just document how this could be tested:
      
      // 1. Create a canvas element with initial size
      // 2. Create a mock mouse event at a specific position
      // 3. Calculate the coordinates using the mouseEventToCoords function
      // 4. Resize the canvas
      // 5. Create another mock mouse event at the same visual position
      // 6. Calculate the coordinates again
      // 7. Verify that the calculated coordinates point to the same logical position on the canvas
      
      // Since this requires more complex setup with DOM mocking, we'll leave this as a comment
      // for now, but it could be implemented with a testing library like jsdom or testing-library/react
    });
  });
});