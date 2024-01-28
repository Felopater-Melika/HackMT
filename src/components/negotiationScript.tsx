import { useState } from 'react';
import axios from 'axios';

const NegotiationScript = ({
  cptCodes,
  chargedPrices,
  standardPrices
}: {
  cptCodes: string[];
  chargedPrices: number[];
  standardPrices: number[];
}) => {
  const [additionalComments, setAdditionalComments] = useState('');
  const [negotiationScript, setNegotiationScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/generate-script', {
        cptCodes,
        chargedPrices,
        standardPrices,
        additionalInfo: additionalComments
      });
      setNegotiationScript(response.data.script);
    } catch (error) {
      console.error('Error fetching negotiation script:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="my-10 flex items-center w-full justify-center flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 w-1/2"
      >
        <textarea
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className="textarea textarea-primary w-full"
          placeholder="Additional comments..."
        ></textarea>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Get Negotiation Tips
        </button>
      </form>
      {isLoading && (
        <span className="loading loading-dots loading-sm block my-10"></span>
      )}
      {negotiationScript && <NegotiationTips script={negotiationScript} />}
    </div>
  );
};
const formatScriptText = (text: string) => {
  const splitText = text.split('\n');
  return splitText.map((paragraph, index) => {
    if (paragraph.match(/^\d+\./)) {
      return (
        <li key={index} className="my-3">
          {paragraph.slice(paragraph.indexOf('.') + 1).trim()}
        </li>
      );
    } else if (paragraph !== '') {
      return <p key={index}>{paragraph}</p>;
    }
    return null;
  });
};

const NegotiationTips = ({ script }: { script: string }) => {
  const formattedScript = formatScriptText(script);

  return (
    <div className="w-1/2 my-5">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Negotiation Tips</h2>
          <ol className="list-decimal list-inside">{formattedScript}</ol>
        </div>
      </div>
    </div>
  );
};

export default NegotiationScript;
