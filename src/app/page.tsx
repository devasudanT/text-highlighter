'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, FileText, Highlighter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ScrollProgressBar from '@/components/scroll-progress-bar';

interface HighlightMatch {
  type: 'bible' | 'page' | 'reference';
  start: number;
  end: number;
  value: string;
}

const TextHighlighter = () => {
  // State to hold the user's input text.
  const [textInput, setTextInput] = useState('');
  // State to hold the count of paragraphs.
  const [paragraphCount, setParagraphCount] = useState(0);
  // State to hold the count of each highlight type
  const [highlightCounts, setHighlightCounts] = useState({
    bible: 0,
    page: 0,
    reference: 0,
    english: 0
  });

  // A comprehensive list of Tamil Bible book names and their abbreviations.
  const bibleBooksTamil = [
    'ஆதியாகமம்', 'ஆதி.', 'ஆதியா',
    'யாத்திராகமம்', 'யாத்தி.', 'யாத்',
    'லேவியராகமம்', 'லேவி.', 'லேவிரா',
    'எண்ணாகமம்', 'எண்.', 'எண்ணா',
    'உபாகமம்', 'உபா.', 'உபாக',
    'யோசுவா', 'யோசு.', 'யோச',
    'நியாயாதிபதிகள்', 'நியா.', 'நியாப',
    'ரூத்.',
    '1 சாமுவேல்', '1 சாமு.', '1 சா',
    '2 சாமுவேல்', '2 சாமு.', '2 சா',
    '1 இராஜாக்கள்', '1 இரா.', '1இராஜா',
    '2 இராஜாக்கள்', '2 இரா.', '2இராஜா',
    '1 நாளாகமம்', '1 நாள்.', '1நா',
    '2 நாளாகமம்', '2 நாளா.', '2நா',
    'எஸ்றா', 'எஸ்.',
    'நெகேமியா', 'நெகே', 'நெ.',
    'எஸ்தர்', 'எஸ்த', 'எஸ்.',
    'யோபு', 'யோபு', 'யோ',
    'சங்கீதம்', 'சங்.', 'சங்கீ',
    'நீதிமொழிகள்', 'நீதி.', 'நீதிமொ',
    'பிரசங்கி', 'பிரச.', 'பிர.',
    'உன்னதப்பாட்டு', 'உன்ன.', 'உபா',
    'ஏசாயா', 'ஏசா.', 'ஏச.',
    'எரேமியா', 'எரே.', 'எரேமி',
    'புலம்பல்', 'புல.', 'புலம்',
    'எசேக்கியேல்', 'எசே.', 'எசேக்',
    'தானியேல்', 'தானி.',
    'ஓசியா', 'ஓசி', 'ஓச',
    'யோவேல்', 'யோவே.', 'யோவெ',
    'ஆமோஸ்', 'ஆமோ.', 'ஆம',
    'ஒபதியா', 'ஒபதி.', 'ஒப.',
    'யோனா', 'யோனா.', 'யோ',
    'மீகா', 'மீகா', 'மீக.',
    'நாகூம்', 'நாகூ', 'நாக',
    'ஆபகூக்', 'ஆபகூ', 'ஆப',
    'செப்பனியா', 'செப்', 'செ',
    'ஆகாய்', 'ஆகா', 'ஆக',
    'சகரியா', 'சகரி', 'சகர',
    'மல்கியா', 'மல்கி', 'மல்.',
    'மத்தேயு', 'மத்.', 'மத்தே',
    'மாற்கு', 'மாற்.', 'மார்க்',
    'லூக்கா', 'லூக்.', 'லூக்',
    'யோவான்', 'யோவா.', 'யோ',
    'அப்போஸ்தலர்', 'அப்.', 'அப்போஸ்',
    'ரோமர்', 'ரோம.',
    '1 கொரிந்தியர்', '1 கொரி.', '1கொ',
    '2 கொரிந்தியர்', '2 கொரி.', '2கொ',
    'கலாத்தியர்', 'கலா.', 'கலாதி',
    'எபேசியர்', 'எபே.', 'எபேசி.',
    'பிலிப்பியர்', 'பிலி.', 'பிலிப்.',
    'கொலோசெயர்', 'கொலோ.', 'கொலோச',
    '1 தெசலோனிக்கேயர்', '1 தெச.', '1தெ.',
    '2 தெசலோனிக்கேயர்', '2 தெச.', '2தெ.',
    '1 தீமோத்தேயு', '1 தீமோ.',
    '2 தீமோத்தேயு', '2 தீமோ.',
    'தீத்து', 'தீத்.',
    'பிலேமோன்', 'பிலே.', 'பிலேம',
    'எபிரேயர்', 'எபிரே.',
    'யாக்கோபு', 'யாக்கோ.',
    '1 பேதுரு', '1 பேது.',
    '2 பேதுரு', '2 பேது.',
    '1 யோவான்', '1 யோவா.',
    '2 யோவான்', '2 யோவா.',
    '3 யோவான்', '3 யோவா.',
    'யூதா.',
    'வெளிப்படுத்துதல்', 'வெளி', 'வெளிப்ப'
  ];

  // Creates a regular expression pattern for Bible verse references.
  const bibleRegexPattern = `(?:${bibleBooksTamil.join('|')})\\s+\\d+:\\d+`;
  const bibleRegex = new RegExp(bibleRegexPattern, 'g');

  // Regular expressions for other text categories.
  const pageRegex = /PAGE\s+\d+/g;
  const englishRefRegex = /\[[A-Z]\d+\]/g;
  const englishWordRegex = /\b[a-zA-Z]+\b/g;

  const { toast } = useToast();
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);

  // Handles text input changes and triggers the highlighting process.
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setTextInput(text);

    // Count the number of paragraphs.
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
    setParagraphCount(paragraphs.length);

    // Count highlights
    const bibleMatches = text.match(bibleRegex) || [];
    const pageMatches = text.match(pageRegex) || [];
    const referenceMatches = text.match(englishRefRegex) || [];
    const englishMatches = text.match(englishWordRegex) || [];

    setHighlightCounts({
      bible: bibleMatches.length,
      page: pageMatches.length,
      reference: referenceMatches.length,
      english: englishMatches.length
    });
  };

  const handleCopyParagraph = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Paragraph copied to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy paragraph: ", err);
      toast({
        title: "Failed to copy paragraph.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Renders the highlighted text by splitting the input based on regex matches.
  const renderHighlightedText = () => {
    if (!textInput) return null;

    const paragraphs = textInput.split(/\n\s*\n/).filter(p => p.trim() !== '');
    const processedParagraphs: (string | React.ReactNode)[] = [];

    paragraphs.forEach((paragraph) => {
      const pageNumberMatch = paragraph.match(pageRegex);
      if (pageNumberMatch) {
        const pageNumberIndex = paragraph.indexOf(pageNumberMatch[0]);
        const beforePageNumber = paragraph.substring(0, pageNumberIndex).trim();
        const afterPageNumber = paragraph.substring(pageNumberIndex + pageNumberMatch[0].length).trim();

        if (beforePageNumber) {
          processedParagraphs.push(beforePageNumber);
        }
        processedParagraphs.push(pageNumberMatch[0]); // Keep the page number as its own "paragraph" for highlighting
        if (afterPageNumber) {
          processedParagraphs.push(afterPageNumber);
        }
      } else {
        processedParagraphs.push(paragraph);
      }
    });

    return processedParagraphs.map((paraContent, index) => {
      const paragraphText = typeof paraContent === 'string' ? paraContent : ''; // Ensure it's a string for copying

      // An array to store all matches with their type, index, and value.
      const matches: HighlightMatch[] = [];

      // Find all matches for each category and store them.
      const findMatches = (regex: RegExp, type: HighlightMatch['type']) => {
        let match;
        while ((match = regex.exec(paragraphText)) !== null) {
          matches.push({
            type: type,
            start: match.index,
            end: match.index + match[0].length,
            value: match[0],
          });
        }
      };

      // Call the findMatches function for each regex.
      findMatches(bibleRegex, 'bible');
      findMatches(pageRegex, 'page');
      findMatches(englishRefRegex, 'reference');

      // Sort the matches by their starting index to process them in order.
      matches.sort((a, b) => a.start - b.start);

      const elements: React.ReactNode[] = [];
      let lastIndex = 0;

      // Iterate through the sorted matches to build the output JSX.
      matches.forEach((match, matchIndex) => {
        // Add the text before the current match.
        if (match.start > lastIndex) {
          // Highlight English words in the non-matched segments.
          const nonMatchedText = paragraphText.substring(lastIndex, match.start);
          let nonMatchedIndex = 0;
          let englishWordMatch;
          while ((englishWordMatch = englishWordRegex.exec(nonMatchedText)) !== null) {
            const beforeWord = nonMatchedText.substring(nonMatchedIndex, englishWordMatch.index);
            if (beforeWord) {
              elements.push(
                <span key={`text-${index}-${matchIndex}-${nonMatchedIndex}`}>
                  {beforeWord}
                </span>
              );
            }
            elements.push(
              <span key={`english-${index}-${matchIndex}-${englishWordMatch.index}`} className="inline-block rounded-md px-1 py-0.5 font-semibold bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100">
                {englishWordMatch[0]}
              </span>
            );
            nonMatchedIndex = englishWordMatch.index + englishWordMatch[0].length;
          }
          const remainingText = nonMatchedText.substring(nonMatchedIndex);
          if (remainingText) {
            elements.push(
              <span key={`text-${index}-${matchIndex}-${nonMatchedIndex}-rem`}>
                {remainingText}
              </span>
            );
          }
        }

        // Create a span element with the appropriate highlight class for the current match.
        const highlightClass = {
          bible: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100',
          page: 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
          reference: 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100',
        }[match.type];

        elements.push(
          <span key={`match-${index}-${matchIndex}`} className={`inline-block rounded-md px-1 py-0.5 font-semibold ${highlightClass}`}>
            {match.value}
          </span>
        );

        // Update the last processed index.
        lastIndex = match.end;
      });

      // Add any remaining text after the last match, and highlight English words within it.
      if (lastIndex < paragraphText.length) {
        const remainingText = paragraphText.substring(lastIndex);
        let remainingIndex = 0;
        let englishWordMatch;
        while ((englishWordMatch = englishWordRegex.exec(remainingText)) !== null) {
          const beforeWord = remainingText.substring(remainingIndex, englishWordMatch.index);
          if (beforeWord) {
            elements.push(
              <span key={`text-final-${index}-${remainingIndex}`}>
                {beforeWord}
              </span>
            );
          }
          elements.push(
            <span key={`english-final-${index}-${englishWordMatch.index}`} className="inline-block rounded-md px-1 py-0.5 font-semibold bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100">
              {englishWordMatch[0]}
            </span>
          );
          remainingIndex = englishWordMatch.index + englishWordMatch[0].length;
        }
        const finalText = remainingText.substring(remainingIndex);
        if (finalText) {
          elements.push(
            <span key={`text-final-${index}-${remainingIndex}-rem`}>
              {finalText}
            </span>
          );
        }
      }

      return (
        <p
          key={`paragraph-${index}`}
          className={`mb-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${hoveredParagraph === index ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          onMouseEnter={() => setHoveredParagraph(index)}
          onMouseLeave={() => setHoveredParagraph(null)}
          onClick={() => handleCopyParagraph(paragraphText)}
        >
          {elements}
        </p>
      );
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textInput);
    toast({
      title: "All text copied to clipboard!",
    });
  };

  const downloadText = () => {
    const blob = new Blob([textInput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlighted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearText = () => {
    setTextInput('');
    setParagraphCount(0);
    setHighlightCounts({ bible: 0, page: 0, reference: 0, english: 0 });
  };

  return (
    <>
      <ScrollProgressBar containerId="output-scroll-area" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <Highlighter className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Text Highlighter
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced text analysis tool that highlights Bible verses, page numbers, references, and English words with intelligent categorization
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{paragraphCount}</div>
                <div className="text-xs text-muted-foreground">Paragraphs</div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 mx-auto mb-2 rounded bg-yellow-200 dark:bg-yellow-800" />
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{highlightCounts.bible}</div>
                <div className="text-xs text-muted-foreground">Bible Verses</div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 mx-auto mb-2 rounded bg-blue-200 dark:bg-blue-800" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{highlightCounts.page}</div>
                <div className="text-xs text-muted-foreground">Page Numbers</div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 mx-auto mb-2 rounded bg-green-200 dark:bg-green-800" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{highlightCounts.reference}</div>
                <div className="text-xs text-muted-foreground">References</div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-6 h-6 mx-auto mb-2 rounded bg-red-200 dark:bg-red-800" />
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{highlightCounts.english}</div>
                <div className="text-xs text-muted-foreground">English Words</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-6">
            {/* Input Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Input Text</span>
                  <Badge variant="secondary" className="ml-auto">
                    {textInput.length} chars
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Paste your text below to analyze and highlight different elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[162px] w-full rounded-md border border-border/50">
                  <Textarea
                    value={textInput}
                    onChange={handleTextChange}
                    placeholder="உங்கள் உரையை இங்கே ஒட்டவும்... இந்த கருவி தானாகவே வேத வசனங்கள், பக்க எண்கள், குறிப்புகள் மற்றும் ஆங்கில சொற்களை முன்னிலைப்படுத்தும்."
                    className="min-h-[142px] resize-none border-none focus:border-none focus:ring-0 font-tiro-tamil bg-transparent"
                  />
                </ScrollArea>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={copyToClipboard}
                    disabled={!textInput}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={downloadText}
                    disabled={!textInput}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={clearText}
                    disabled={!textInput}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Highlighted Output</CardTitle>
                <CardDescription>
                  Text with automatic highlighting applied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea id="output-scroll-area" className="h-[600px] w-full rounded-md border border-border/50 p-4 bg-background/50">
                  <div className="whitespace-pre-wrap leading-relaxed font-tiro-tamil text-foreground">
                    {textInput ? renderHighlightedText() : (
                      <div className="text-center text-muted-foreground py-12">
                        <Highlighter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-tiro-tamil">முன்னிலைப்படுத்தப்பட்ட முடிவுகளைப் பார்க்க உரையை உள்ளிடவும்</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Highlight Legend</CardTitle>
              <CardDescription>
                Color coding for different types of text elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <div className="w-4 h-4 rounded bg-yellow-300 dark:bg-yellow-700"></div>
                  <div>
                    <div className="font-medium text-yellow-900 dark:text-yellow-100">Bible Verses</div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Tamil Bible references</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <div className="w-4 h-4 rounded bg-blue-300 dark:bg-blue-700"></div>
                  <div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">Page Numbers</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">PAGE + number format</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-700"></div>
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">References</div>
                    <div className="text-sm text-green-700 dark:text-green-300">[Letter+Number] format</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <div className="w-4 h-4 rounded bg-red-300 dark:bg-red-700"></div>
                  <div>
                    <div className="font-medium text-red-900 dark:text-red-100">English Words</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Latin alphabet words</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TextHighlighter;
