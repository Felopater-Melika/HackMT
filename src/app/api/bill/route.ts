import { Readable } from 'stream';
import {
  AnalyzedDocument,
  AzureKeyCredential,
  DocumentAnalysisClient
} from '@azure/ai-form-recognizer';
// import axios from 'axios';
export const dynamic = 'force-dynamic'; // defaults to auto

async function azureOCR(file: File): Promise<BillLine[]> {
  const key = process.env.AZURE_AI_KEY as string;
  const endpoint = process.env.AZURE_AI_ENDPOINT as string;
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const stream = Readable.from(buffer);

  const poller = await client.beginAnalyzeDocument('prebuilt-invoice', stream);

  const res = await poller.pollUntilDone();
  const [result] = res.documents as AnalyzedDocument[];
  const output = [];

  if (result) {
    const invoice = result.fields;

    console.log('Vendor Name:', invoice.VendorName?.content);
    console.log('Customer Name:', invoice.CustomerName?.content);
    console.log('Invoice Date:', invoice.InvoiceDate?.content);
    console.log('Due Date:', invoice.DueDate?.content);

    console.log('Items:');
    for (const { properties: item } of (invoice.Items as any)?.values ?? []) {
      console.log('  CPT Code:', item.ProductCode?.content ?? '<no CPT code>');
      console.log('  Description:', item.Description?.content);
      console.log('  Quantity:', item.Quantity?.content);
      console.log('  Date:', item.Date?.content);
      console.log('  Unit:', item.Unit?.content);
      console.log('  Unit Price:', item.UnitPrice?.content);
      console.log('  Tax:', item.Tax?.content);
      console.log('  Amount:', item.Amount?.content);
      let cptCode = item.ProductCode?.content as string;
      let hospitalPrice: number = Number(
        item.UnitPrice?.content?.replaceAll('$', '')
      );
      if (cptCode) {
        output.push({
          cptCode,
          hospitalPrice
        });
      }
    }

    console.log('Subtotal:', invoice.SubTotal?.content);
    console.log(
      'Previous Unpaid Balance:',
      invoice.PreviousUnpaidBalance?.content
    );
    console.log('Tax:', invoice.TotalTax?.content);
    console.log('Amount Due:', invoice.AmountDue?.content);

    return output;
  } else {
    throw new Error('Expected at least one receipt in the result.');
  }
}

// backend team will implement this
async function lookupNormalPrices(cptCodes: string[]): Promise<PriceInfo[]> {
  // I'll get information about exactly what this URL will
  // be later.
  const URL = 'localhost:5000';

  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cptCodes)
  });
  const data: PriceInfo[] = await res.json();

  return data;
}

interface BillLine {
  cptCode: string;
  hospitalPrice: number;
}

interface PriceInfo {
  cptCode: string;
  normalPrice: number;
  description: string;
}

interface CombinedInfo {
  cptCode: string;
  hospitalPrice: number;
  normalPrice: number;
  description: string;
  /// Make this true if there's a big difference between hospitalPrice
  /// and normalPrice
  highlight: boolean;
}

// CPT Code:
// in hospitals they need a consistent way to describe what
// a procedure is, so CPT codes are one of the systems they
// use. It's what's normally on itemized bills.

export async function POST(request: Request) {
  // awiat a timeout for 3 seconds
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // return Response.json([
  //   {
  //     cptCode: '12345',
  //     hospitalPrice: 100,
  //     normalPrice: 50,
  //     description: 'hey this is dummy data',
  //     highlight: false
  //   },
  //   {
  //     cptCode: '55345',
  //     hospitalPrice: 100,
  //     normalPrice: 50,
  //     description: 'this is also dummy data',
  //     highlight: false
  //   },
  //   {
  //     cptCode: '33345',
  //     hospitalPrice: 100,
  //     normalPrice: 100,
  //     description: 'more dummy data',
  //     highlight: true
  //   },
  //   {
  //     cptCode: '12345',
  //     hospitalPrice: 100,
  //     normalPrice: 50,
  //     description: 'hey this is dummy data',
  //     highlight: true
  //   }
  // ]);
  try {
    // get image from the request
    const imageFormData = await request.formData();

    const image = imageFormData.get('image') as File;

    // then take the image and feed it to azureOCR
    const bill: BillLine[] = await azureOCR(image);

    const priceInfo: PriceInfo[] = await lookupNormalPrices(
      bill.map((item) => item.cptCode)
    );

    // TODO: combine this new info with the existing bill information to
    // add the hospital price to it. You could turn the bill array
    // into an object with the cpt codes as keys.

    let billIndex: { [key: string]: BillLine } = {};

    for (let billLine of bill) {
      billIndex[billLine.cptCode] = billLine;
    }

    const combinedInfo: CombinedInfo[] = []; // however you make this
    //we will use a for loop that will based on the number of CPT codes within the bill interface. each time it loops it will
    //create a new combined info data type and append it to the combinedInfo array
    for (let i = 0; i < bill.length; i++) {
      let billLine: BillLine = billIndex[priceInfo[i].cptCode];
      let highlighter = true;
      //True means it doesnt get highlighted, this means the hospital price is less than normal price
      //false means hospital price is higher than normal price.
      if (billLine.hospitalPrice - priceInfo[i].normalPrice > 0) {
        highlighter = false;
      }
      let newInfo: CombinedInfo = {
        cptCode: priceInfo[i].cptCode,
        hospitalPrice: billLine.hospitalPrice,
        normalPrice: priceInfo[i].normalPrice,
        description: priceInfo[i].description,
        highlight: highlighter
      };
      combinedInfo.push(newInfo);
    }

    return Response.json(combinedInfo);
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
