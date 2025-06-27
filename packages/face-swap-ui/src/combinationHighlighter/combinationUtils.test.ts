import {
  createCombinationId,
  parseCombinationName,
  createCombinationMatch,
  findImageCombinations,
  identifyImage,
  processCombinations,
  groupCombinationsByImage,
  combinationExists,
  getImageGlowColor,
  validateCombinationData,
} from './combinationUtils';
import { OutputImage } from "@repo/shared-interfaces";

// Mock data
const mockFace = {
  src: "http://example.com/face.jpg",
  alt: "Face Image",
  name: "face_123.jpg",
  type: "Face" as const,
};

const mockModel = {
  src: "http://example.com/model.png",
  alt: "Model Image", 
  name: "model_456.png",
  type: "Model" as const,
};

const mockOutputImage: OutputImage = {
  src: "http://example.com/output.png",
  alt: "Output Image",
  name: "face_123.jpg--model_456.png--_00001_.png",
  type: "Output",
  created: "2025-06-27T10:00:00.000Z",
  createdfmt: "27thJun25",
  face: mockFace,
  model: mockModel,
};

describe('combinationUtils', () => {
  describe('createCombinationId', () => {
    test('creates correct combination ID', () => {
      const id = createCombinationId('face_123.jpg', 'model_456.png');
      expect(id).toBe('face_123.jpg--model_456.png');
    });
  });

  describe('parseCombinationName', () => {
    test('parses valid combination name', () => {
      const result = parseCombinationName('face_123.jpg--model_456.png--_00001_.png');
      expect(result).toEqual({
        faceName: 'face_123.jpg',
        modelName: 'model_456.png',
      });
    });

    test('returns null for invalid format', () => {
      const result = parseCombinationName('invalid_format.png');
      expect(result).toBeNull();
    });

    test('returns null for empty parts', () => {
      const result = parseCombinationName('--model_456.png--_00001_.png');
      expect(result).toBeNull();
    });
  });

  describe('createCombinationMatch', () => {
    test('creates combination match with default config', () => {
      const match = createCombinationMatch(mockOutputImage);
      
      expect(match.id).toBe('face_123.jpg--model_456.png');
      expect(match.face).toBe(mockOutputImage.face);
      expect(match.model).toBe(mockOutputImage.model);
      expect(match.output).toBe(mockOutputImage);
      expect(match.glowConfig).toBeDefined();
      expect(match.glowConfig.color).toBeDefined();
      expect(match.created).toBe(mockOutputImage.created);
      expect(match.createdFmt).toBe(mockOutputImage.createdfmt);
    });
  });

  describe('findImageCombinations', () => {
    const combinations = [
      createCombinationMatch(mockOutputImage),
      createCombinationMatch({
        ...mockOutputImage,
        name: 'face_789.jpg--model_456.png--_00001_.png',
        face: { ...mockFace, name: 'face_789.jpg' },
      }),
    ];

    test('finds face combinations', () => {
      const result = findImageCombinations('face_123.jpg', 'face', combinations);
      expect(result).toHaveLength(1);
      expect(result[0]?.face.name).toBe('face_123.jpg');
    });

    test('finds model combinations', () => {
      const result = findImageCombinations('model_456.png', 'model', combinations);
      expect(result).toHaveLength(2);
      result.forEach(combo => {
        expect(combo.model.name).toBe('model_456.png');
      });
    });

    test('returns empty array for non-existent image', () => {
      const result = findImageCombinations('nonexistent.jpg', 'face', combinations);
      expect(result).toHaveLength(0);
    });
  });

  describe('identifyImage', () => {
    const combinations = [createCombinationMatch(mockOutputImage)];

    test('identifies image with combinations', () => {
      const result = identifyImage('face_123.jpg', 'face', combinations);
      
      expect(result.imageName).toBe('face_123.jpg');
      expect(result.imageType).toBe('face');
      expect(result.hasMatches).toBe(true);
      expect(result.combinations).toHaveLength(1);
    });

    test('identifies image without combinations', () => {
      const result = identifyImage('unknown.jpg', 'face', combinations);
      
      expect(result.imageName).toBe('unknown.jpg');
      expect(result.imageType).toBe('face');
      expect(result.hasMatches).toBe(false);
      expect(result.combinations).toHaveLength(0);
    });
  });

  describe('processCombinations', () => {
    test('processes multiple combinations', () => {
      const outputs = [
        mockOutputImage,
        {
          ...mockOutputImage,
          name: 'face_789.jpg--model_123.png--_00001_.png',
          face: { ...mockFace, name: 'face_789.jpg' },
          model: { ...mockModel, name: 'model_123.png' },
        },
      ];

      const result = processCombinations(outputs);
      expect(result).toHaveLength(2);
      result.forEach(combo => {
        expect(combo.id).toBeDefined();
        expect(combo.glowConfig).toBeDefined();
      });
    });
  });

  describe('groupCombinationsByImage', () => {
    test('groups combinations correctly', () => {
      const combinations = [
        createCombinationMatch(mockOutputImage),
        createCombinationMatch({
          ...mockOutputImage,
          name: 'face_123.jpg--model_789.png--_00001_.png',
          model: { ...mockModel, name: 'model_789.png' },
        }),
      ];

      const result = groupCombinationsByImage(combinations);
      
      expect(result.byFace.has('face_123.jpg')).toBe(true);
      expect(result.byFace.get('face_123.jpg')).toHaveLength(2);
      
      expect(result.byModel.has('model_456.png')).toBe(true);
      expect(result.byModel.has('model_789.png')).toBe(true);
    });
  });

  describe('combinationExists', () => {
    const combinations = [createCombinationMatch(mockOutputImage)];

    test('returns true for existing combination', () => {
      const exists = combinationExists('face_123.jpg', 'model_456.png', combinations);
      expect(exists).toBe(true);
    });

    test('returns false for non-existing combination', () => {
      const exists = combinationExists('face_999.jpg', 'model_999.png', combinations);
      expect(exists).toBe(false);
    });
  });

  describe('getImageGlowColor', () => {
    const combinations = [createCombinationMatch(mockOutputImage)];

    test('returns color for image with combinations', () => {
      const color = getImageGlowColor('face_123.jpg', 'face', combinations);
      expect(color).toBeDefined();
      expect(typeof color).toBe('string');
    });

    test('returns null for image without combinations', () => {
      const color = getImageGlowColor('unknown.jpg', 'face', combinations);
      expect(color).toBeNull();
    });
  });

  describe('validateCombinationData', () => {
    test('validates correct data', () => {
      const result = validateCombinationData([mockOutputImage]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('detects missing face data', () => {
      const invalidOutput = {
        ...mockOutputImage,
        face: { ...mockFace, name: '' },
      };
      
      const result = validateCombinationData([invalidOutput]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Combination 0: Missing face data');
    });

    test('detects missing model data', () => {
      const invalidOutput = {
        ...mockOutputImage,
        model: { ...mockModel, name: '' },
      };
      
      const result = validateCombinationData([invalidOutput]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Combination 0: Missing model data');
    });

    test('detects missing combination name', () => {
      const invalidOutput = {
        ...mockOutputImage,
        name: '',
      };
      
      const result = validateCombinationData([invalidOutput]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Combination 0: Missing combination name');
    });
  });
});
