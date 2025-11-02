'use client';

// A basic Markdown renderer. For a real app, a library like 'react-markdown' would be better.
export const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;
    
    const blocks = content.trim().split(/\n\s*\n/);
  
    return (
      <>
        {blocks.map((block, index) => {
          const trimmedBlock = block.trim();
          if (trimmedBlock.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{trimmedBlock.substring(3)}</h2>;
          }
          if (trimmedBlock.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-10 mb-6">{trimmedBlock.substring(2)}</h1>;
          }
          if (trimmedBlock.match(/^\d+\.\s/)) {
              return (
                  <ol key={index} className="list-decimal list-inside space-y-2 my-4">
                      {trimmedBlock.split('\n').map((item, i) => (
                          <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
                      ))}
                  </ol>
              )
          }
           if (trimmedBlock.startsWith('- ')) {
              return (
                  <ul key={index} className="list-disc list-inside space-y-2 my-4">
                      {trimmedBlock.split('\n').map((item, i) => (
                          <li key={i}>{item.replace(/^- \s/, '')}</li>
                      ))}
                  </ul>
              )
          }
          if (trimmedBlock) {
            return <p key={index} className="my-4 leading-relaxed">{trimmedBlock}</p>;
          }
          return null;
        })}
      </>
    );
  };
