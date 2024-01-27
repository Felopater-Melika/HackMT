// import axios from 'axios';
const fs = require('fs');
const { Readable } = require('stream');
const {
  AzureKeyCredential,
  DocumentAnalysisClient
} = require('@azure/ai-form-recognizer');
const key = process.env.AZURE_AI_KEY as string;
const endpoint = process.env.AZURE_AI_ENDPOINT;
async function getImageAsBase64() {
  // Adjust the path according to where your Next.js project root is
  const imagePath = './public/img_4.png';

  // Read the file
  const imageBuffer = fs.readFileSync(imagePath);

  // Convert to base64
  return imageBuffer.toString('base64');
}
async function azureOCR(base64Image: any) {
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );
  // Convert base64 string to binary buffer
  const buffer = Buffer.from(base64Image, 'base64');

  // Create a stream from the buffer
  const stream = Readable.from(buffer);

  const poller = await client.beginAnalyzeDocument('prebuilt-invoice', stream);

  const {
    documents: [result]
  } = await poller.pollUntilDone();

  if (result) {
    const invoice = result.fields;

    console.log('Vendor Name:', invoice.VendorName?.content);
    console.log('Customer Name:', invoice.CustomerName?.content);
    console.log('Invoice Date:', invoice.InvoiceDate?.content);
    console.log('Due Date:', invoice.DueDate?.content);

    console.log('Items:');
    for (const { properties: item } of invoice.Items?.values ?? []) {
      console.log('  CPT Code:', item.ProductCode?.content ?? '<no CPT code>');
      console.log('  Description:', item.Description?.content);
      console.log('  Quantity:', item.Quantity?.content);
      console.log('  Date:', item.Date?.content);
      console.log('  Unit:', item.Unit?.content);
      console.log('  Unit Price:', item.UnitPrice?.content);
      console.log('  Tax:', item.Tax?.content);
      console.log('  Amount:', item.Amount?.content);
    }

    console.log('Subtotal:', invoice.SubTotal?.content);
    console.log(
      'Previous Unpaid Balance:',
      invoice.PreviousUnpaidBalance?.content
    );
    console.log('Tax:', invoice.TotalTax?.content);
    console.log('Amount Due:', invoice.AmountDue?.content);
  } else {
    throw new Error('Expected at least one receipt in the result.');
  }
}

export async function GET(request: Request) {
  try {
    const base64Image = await getImageAsBase64();
    const ocrResult = await azureOCR(base64Image);
    return new Response(JSON.stringify(ocrResult), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in GET request:', error);
    // @ts-ignore
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// export const dynamic = 'force-dynamic'; // defaults to auto

// Felo will implement this

// backend team will implement this
// async function lookupNormalPrices(cptCodes: string[]) {
// I'll get information about exactly what this URL will
// be later.
// const URL = 'some localhost url with a different port';
// use axios.post; look up the documentation.
// }

// interface BillLine {
//   cptCode: string;
//   hospitalPrice: number;
// }

// interface PriceInfo {
//   cptCode: string;
//   normalPrice: number;
//   description: string;
// }

// interface CombinedInfo {
//   cptCode: string;
//   hospitalPrice: number;
//   normalPrice: number;
//   description: string;
// }

// CPT Code:
// in hospitals they need a consistent way to describe what
// a procedure is, so CPT codes are one of the systems they
// use. It's what's normally on itemized bills.

// export async function POST(request: Request) {
// get image from the request
// const imageFormData = await request.formData();

// then take the image and feed it to azureOCR
// const bill: BillLine[] = await azureOCR(image);

// get the cpt codes out of the bill info
// const cptCodes = bill.map((item) => item.cptCode);

// const priceInfo: PriceInfo[] = lookupNormalPrices(cptCodes);

// TODO: combine this new info with the existing bill information to
// add the hospital price to it. You could turn the bill array
// into an object with the cpt codes as keys.

// const combinedInfo: CombinedInfo[] = []; // however you make this

/*
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
  */

// return Response.json(combinedInfo);
// }
