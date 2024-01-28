import OpenAI from 'openai';

async function generateNegotiationScript(
  cptCodes: string[],
  chargedPrices: string[],
  standardPrices: string[],
  additionalInfo: string
): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
  });
  let prompt =
    'you are part of product that takes medical bills and analyzes if the prices are fair and if not gives the fair prices. your job is to teach the patient how to negotiate a fair price for a billing charges with a healthcare provider. The patient has been charged the following prices for procedures, which are above the standard rates:\n\n';
  for (let i = 0; i < cptCodes.length; i++) {
    prompt += `Procedure code ${cptCodes[i]} was charged at $${chargedPrices[i]}, while the standard price is $${standardPrices[i]}.\n`;
  }

  prompt +=
    '\nBased on this information, please inform the patient on how to negotiate a fair price. Make sure to include the typical procedure on the typical process of negotiation and negotiation tactics they can use to get a fair price. Please only focus on providing tips and nothing else, no empathy or sympathy or personal talk just go straight on the information and advice. The standard prices are already provided to you and are given to the patient by us. Your one and only task is to educate them on the process and give them advice on how to negotiate a fair price. Do not tell the user you understand that charges seem high or anything of that sort. do not give a tip saying research fair prices as that is already done\n';

  console.log(prompt);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: additionalInfo }
      ],
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
