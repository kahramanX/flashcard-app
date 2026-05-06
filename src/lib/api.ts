import fs from 'fs';
import path from 'path';
import { Word } from '@/types';

// This abstracts away data fetching. 
// Right now it reads from files, but can easily be swapped for a real DB or external API.
export const api = {
  async getAllWords(): Promise<Word[]> {
    try {
      const filePath = path.join(process.cwd(), 'words.json');
      if (fs.existsSync(filePath)) {
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
      }
    } catch (error) {
      console.error('Failed to load words.json:', error);
    }
    return [];
  },

  async getUnknownWords(): Promise<Word[]> {
    try {
      const filePath = path.join(process.cwd(), 'unknown_words.json');
      if (fs.existsSync(filePath)) {
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
      }
    } catch (error) {
      console.error('Failed to load unknown_words.json:', error);
    }
    return [];
  },

  async getWordsByLevel(level: string): Promise<Word[]> {
    const words = await this.getAllWords();
    const targetLevel = level.toLowerCase();
    
    return words.filter(w => {
      const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
      if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) return false;
      
      let wLevel = typeof w.level === 'string' ? w.level.trim() : "Unknown";
      if (wLevel === "") wLevel = "Unknown";
      
      return wLevel.toLowerCase() === targetLevel;
    }).sort((a, b) => (a.word || "").localeCompare(b.word || ""));
  },

  async getUnknownWordsByLevel(level: string): Promise<Word[]> {
    const unknownWords = await this.getUnknownWords();
    const targetLevel = level.toLowerCase();
    
    return unknownWords.filter(w => {
      const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
      if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) return false;
      
      let wLevel = typeof w.level === 'string' ? w.level.trim() : "Unknown";
      if (wLevel === "") wLevel = "Unknown";
      
      return wLevel.toLowerCase() === targetLevel;
    }).sort((a, b) => (a.word || "").localeCompare(b.word || ""));
  },

  async getLevelCounts(): Promise<Record<string, number>> {
    const words = await this.getAllWords();
    const counts: Record<string, number> = {};
    
    words.forEach(w => {
      const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
      if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) return;
      
      let level = typeof w.level === 'string' ? w.level.trim() : "Unknown";
      if (level === "") level = "Unknown";
      
      counts[level] = (counts[level] || 0) + 1;
    });
    
    return counts;
  },

  async getUnknownLevelCounts(): Promise<Record<string, number>> {
    const unknownWords = await this.getUnknownWords();
    const counts: Record<string, number> = {};
    
    unknownWords.forEach(w => {
      const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
      if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) return;
      
      let level = typeof w.level === 'string' ? w.level.trim() : "Unknown";
      if (level === "") level = "Unknown";
      
      counts[level] = (counts[level] || 0) + 1;
    });
    
    return counts;
  }
};
