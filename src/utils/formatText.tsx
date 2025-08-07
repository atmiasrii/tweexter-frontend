import React from 'react';

export const formatTextWithMarkdown = (text: string): React.ReactNode[] => {
  // Split by line breaks first to preserve them
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Process markdown formatting within each line
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Regular expressions for markdown patterns
    const boldPattern = /\*\*(.*?)\*\*/g;
    const italicPattern = /\*(.*?)\*/g;
    
    // First process bold text (double asterisks)
    let match;
    const processedSegments: Array<{text: string, type: 'normal' | 'bold' | 'italic', start: number, end: number}> = [];
    
    // Find all bold matches
    boldPattern.lastIndex = 0;
    while ((match = boldPattern.exec(line)) !== null) {
      // Add normal text before this match
      if (match.index > currentIndex) {
        processedSegments.push({
          text: line.substring(currentIndex, match.index),
          type: 'normal',
          start: currentIndex,
          end: match.index
        });
      }
      
      // Add bold text
      processedSegments.push({
        text: match[1],
        type: 'bold',
        start: match.index,
        end: match.index + match[0].length
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining normal text
    if (currentIndex < line.length) {
      processedSegments.push({
        text: line.substring(currentIndex),
        type: 'normal',
        start: currentIndex,
        end: line.length
      });
    }
    
    // Now process italic text within the normal segments
    const finalSegments: Array<{text: string, type: 'normal' | 'bold' | 'italic'}> = [];
    
    processedSegments.forEach(segment => {
      if (segment.type === 'bold') {
        finalSegments.push(segment);
        return;
      }
      
      // Process italics in normal text
      const italicMatches: Array<{text: string, type: 'normal' | 'italic', start: number, end: number}> = [];
      let segmentIndex = 0;
      
      italicPattern.lastIndex = 0;
      while ((match = italicPattern.exec(segment.text)) !== null) {
        // Add normal text before this match
        if (match.index > segmentIndex) {
          italicMatches.push({
            text: segment.text.substring(segmentIndex, match.index),
            type: 'normal',
            start: segmentIndex,
            end: match.index
          });
        }
        
        // Add italic text
        italicMatches.push({
          text: match[1],
          type: 'italic',
          start: match.index,
          end: match.index + match[0].length
        });
        
        segmentIndex = match.index + match[0].length;
      }
      
      // Add remaining normal text
      if (segmentIndex < segment.text.length) {
        italicMatches.push({
          text: segment.text.substring(segmentIndex),
          type: 'normal',
          start: segmentIndex,
          end: segment.text.length
        });
      }
      
      // If no italic matches found, just add the original segment
      if (italicMatches.length === 0) {
        finalSegments.push(segment);
      } else {
        finalSegments.push(...italicMatches.map(m => ({text: m.text, type: m.type})));
      }
    });
    
    // Convert segments to React nodes
    const lineContent = finalSegments.map((segment, segmentIndex) => {
      const key = `${lineIndex}-${segmentIndex}`;
      
      switch (segment.type) {
        case 'bold':
          return <strong key={key} className="font-semibold">{segment.text}</strong>;
        case 'italic':
          return <em key={key} className="italic">{segment.text}</em>;
        default:
          return <span key={key}>{segment.text}</span>;
      }
    });
    
    // Return line with proper line break
    return (
      <React.Fragment key={lineIndex}>
        {lineContent}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};