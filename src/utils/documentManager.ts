import { Document, ScanResult } from '../types';

// In a real app, this would be stored in a database
let documents: Document[] = [];

export const addDocument = (userId: string, title: string, content: string): Document => {
  const newDocument: Document = {
    id: (documents.length + 1).toString(),
    userId,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  documents.push(newDocument);
  return newDocument;
};

export const getDocument = (documentId: string): Document | null => {
  return documents.find((doc) => doc.id === documentId) || null;
};

export const getUserDocuments = (userId: string): Document[] => {
  return documents.filter((doc) => doc.userId === userId);
};

export const getAllDocuments = (): Document[] => {
  return documents;
};

// Simple text similarity algorithm using Levenshtein distance
const calculateLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Calculate similarity score (0-100) based on Levenshtein distance
const calculateSimilarity = (text1: string, text2: string): number => {
  const distance = calculateLevenshteinDistance(text1, text2);
  const maxLength = Math.max(text1.length, text2.length);
  
  if (maxLength === 0) return 100; // Both strings are empty
  
  const similarity = (1 - distance / maxLength) * 100;
  return Math.round(similarity * 100) / 100; // Round to 2 decimal places
};

// Find similar documents
export const findSimilarDocuments = (content: string, threshold: number = 50): ScanResult[] => {
  const results: ScanResult[] = [];

  for (const doc of documents) {
    const similarity = calculateSimilarity(content, doc.content);
    
    if (similarity >= threshold) {
      results.push({
        documentId: doc.id,
        title: doc.title,
        similarity,
      });
    }
  }

  // Sort by similarity (highest first)
  return results.sort((a, b) => b.similarity - a.similarity);
};

// Word frequency analysis for document topics
export const analyzeDocumentTopics = (): Record<string, number> => {
  const wordFrequency: Record<string, number> = {};
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
    'by', 'about', 'as', 'of', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
    'should', 'can', 'could', 'may', 'might', 'must', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
    'them', 'my', 'your', 'his', 'its', 'our', 'their'
  ]);

  documents.forEach(doc => {
    const words = doc.content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  });

  return wordFrequency;
};