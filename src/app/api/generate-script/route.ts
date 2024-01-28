import OpenAI from 'openai';

async function generateNegotiationScript(
  cptCodes: string[],
  chargedPrices: string[],
  standardPrices: string[],
  additionalInfo?: string
): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
  });
  let prompt =
    'As an experienced negotiator using principles from "Never Split the Difference", create a detailed negotiation script for a patient to discuss billing charges with a healthcare provider. The patient has been charged the following prices for procedures, which are above the standard rates:\n\n';
  for (let i = 0; i < cptCodes.length; i++) {
    prompt += `Procedure code ${cptCodes[i]} was charged at $${chargedPrices[i]}, while the standard price is $${standardPrices[i]}.\n`;
  }
  if (additionalInfo) {
    prompt += `\n here are some additional information about the user to keep in mind: ${additionalInfo}\n`;
  }
  prompt +=
    '\nBased on this information, craft a script that the patient can use to negotiate a fair price.\n';

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo'
    });

    console.log(completion);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating script with OpenAI:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  const { cptCodes, chargedPrices, standardPrices, additionalInfo } = data;

  try {
    const generatedScript = await generateNegotiationScript(
      cptCodes,
      chargedPrices,
      standardPrices,
      additionalInfo
    );

    return new Response(JSON.stringify({ script: generatedScript }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // @ts-ignore
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
