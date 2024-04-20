Math.random = jest.fn();

describe("Particle class", () => {
    beforeAll(() => {
        Math.random.mockReturnValue(0.5);
    });

    describe("constructor", () => {
        it("should initialize with specified options", () => {
            const particle = new Particle({ x: 100, y: 150 });

            expect(particle.x).toBe(100);
            expect(particle.y).toBe(150);
            expect(particle.color).toBe("0,255,0"); // Middle value from confettiColorPresets
            expect(particle.vy).toBeCloseTo(-10.5);
            expect(particle.vx).toBeCloseTo(0);
            expect(particle.rotationAngle).toBeCloseTo(Math.PI);
            expect(particle.rotationSpeed).toBeCloseTo(0.02);
            expect(particle.shrinking).toBeTruthy();
        });
    });

  
    describe("getFillStyle method", () => {
        it("should update physics correctly", () => {
            const particle = new Particle({ x: 0, y: 0 });
            particle.vx = 5;
            particle.vy = 5;
        
            particle.updatePhysics();
            expect(particle.vx).toBeCloseTo(4.5);
            expect(particle.vy).toBeCloseTo(5.6); // 5 + GRAVITY - 10% air resistance
            expect(particle.x).toBeCloseTo(4.5);
            expect(particle.y).toBeCloseTo(5.6);
        });
    });
  
    describe("updatePhysics method", () => {
      it("should update physics correctly", () => {});
    });
  
    describe("updateSize method", () => {
        it("should increment the size property if not shrinking", () => {
                const particle = new Particle({ x: 0, y: 0 });
                const propertyName = "size";
                particle[propertyName] = 5; // mocked property
                particle.shrinking = false;
                const maxValue = 10;

                article.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(5.2);
        });

        it("should decrement the size property if shrinking", () => {
                const propertyName = "size";
                particle[propertyName] = 5;
                particle.shrinking = true;
                const maxValue = 10;
            
                particle.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(4.8);
        });
        
        it("should toggle shrinking to false when size reaches 0", () => {
                const propertyName = "size";
                particle[propertyName] = 0.1;
                particle.shrinking = true;
                const maxValue = 10;
            
                particle.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(0);
                expect(particle.shrinking).toBe(false);
        });
        
        it("should toggle shrinking to true when size reaches the maximum value", () => {
                const propertyName = "size";
                particle[propertyName] = 9.9;
                particle.shrinking = false;
                const maxValue = 10;
            
                particle.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(10);
                expect(particle.shrinking).toBe(true);
        });
        
        it("should not set size below 0 or above max value", () => {
                const propertyName = "size";
                particle[propertyName] = -0.1; // Testing below 0
                particle.shrinking = true;
                const maxValue = 10;
            
                particle.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(0);
            
                particle[propertyName] = 10.1; // Testing above max
                particle.shrinking = false;
                particle.updateSize(propertyName, maxValue);
                expect(particle[propertyName]).toBe(10);
        });
    });
  
    describe("draw and update not implemented methods", () => {
      it("should throw an error when calling draw", () => {});
      it("should throw an error when calling update", () => {});
    });
});