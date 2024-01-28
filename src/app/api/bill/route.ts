import { Readable } from 'stream';
import {
  AnalyzedDocument,
  AzureKeyCredential,
  DocumentAnalysisClient
} from '@azure/ai-form-recognizer';
import axios from 'axios';
export const dynamic = 'force-dynamic'; // defaults to auto
import { ResponseItem, CombinedInfo, FailedRow } from '@/types/responseForm';

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

    /*
    console.log('Vendor Name:', invoice.VendorName?.content);
    console.log('Customer Name:', invoice.CustomerName?.content);
    console.log('Invoice Date:', invoice.InvoiceDate?.content);
    console.log('Due Date:', invoice.DueDate?.content);

    console.log('Items:');
    */
    for (const { properties: item } of (invoice.Items as any)?.values ?? []) {
      /*
      console.log('  CPT Code:', item.ProductCode?.content ?? '<no CPT code>');
      console.log('  Description:', item.Description?.content);
      console.log('  Quantity:', item.Quantity?.content);
      console.log('  Date:', item.Date?.content);
      console.log('  Unit:', item.Unit?.content);
      console.log('  Unit Price:', item.UnitPrice?.content);
      console.log('  Tax:', item.Tax?.content);
      console.log('  Amount:', item.Amount?.content);
      */
      let cptCodeRaw = item.ProductCode?.content;
      let cptCode = null;
      let description = item.Description?.content ?? 'no description';
      if (cptCodeRaw === undefined) {
        let result = description.match(/\d{5}/g);
        if (result && result.length > 0) {
          cptCode = result[0];
        }
      } else {
        cptCode = cptCodeRaw;
      }
      let hospitalPriceRaw = item.Amount?.content?.replaceAll('$', '');
      let hospitalPrice: number | null = null;
      if (hospitalPriceRaw !== undefined) {
        hospitalPrice = Number(hospitalPriceRaw);
      }

      if (cptCode) {
        output.push({
          cptCode,
          description,
          hospitalPrice
        });
      }
    }

    /*
    console.log('Subtotal:', invoice.SubTotal?.content);
    console.log(
      'Previous Unpaid Balance:',
      invoice.PreviousUnpaidBalance?.content
    );
    console.log('Tax:', invoice.TotalTax?.content);
    console.log('Amount Due:', invoice.AmountDue?.content);
    */

    return output;
  } else {
    throw new Error('Expected at least one receipt in the result.');
  }
}

// backend team will implement this
async function lookupNormalPrices(cptCodes: string[]): Promise<PriceInfo> {
  // I'll get information about exactly what this URL will
  // be later.
  const URL = 'http://127.0.0.1:5000/price';

  try {
    /*
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bcodes: cptCodes })
    });
    const data: { avg_prices: PriceInfo[] } = await res.json();
    */
    const res = await axios.post(URL, { bcodes: cptCodes });
    const data: { avg_prices: PriceInfo } = res.data;
    return data.avg_prices;
  } catch (error) {
    console.error(error);
    throw Error('Error in lookupNormalPrices');
  }
}

interface BillLine {
  cptCode: string;
  hospitalPrice: number | null;
  description: string;
}

interface PriceInfo {
  [key: string]: number;
}

// CPT Code:
// in hospitals they need a consistent way to describe what
// a procedure is, so CPT codes are one of the systems they
// use. It's what's normally on itemized bills.

export async function POST(request: Request) {
  try {
    // get image from the request
    const imageFormData = await request.formData();

    const image = imageFormData.get('image') as File;

    // then take the image and feed it to azureOCR
    const billRaw: BillLine[] = await azureOCR(image);
    const bill = billRaw.filter((item) => item.cptCode !== undefined);

    const priceInfo: PriceInfo = await lookupNormalPrices(
      bill.map((item) => item.cptCode)
    );

    const responseData: ResponseItem[] = [];

    // TODO: combine this new info with the existing bill information to
    // add the hospital price to it. You could turn the bill array
    // into an object with the cpt codes as keys.

    let billIndex: {
      [key: string]: {
        bill: BillLine;
        visited: boolean;
      };
    } = {};

    for (let billLine of bill) {
      billIndex[billLine.cptCode] = { bill: billLine, visited: false };
    }

    for (let cptCode in priceInfo) {
      const normalPrice = priceInfo[cptCode];
      let billLine: BillLine = billIndex[cptCode].bill;
      billIndex[cptCode].visited = true;
      let highlighter = false;
      //True means it doesnt get highlighted, this means the hospital price is less than normal price
      //false means hospital price is higher than normal price.
      const diff = (billLine.hospitalPrice ?? normalPrice) - normalPrice;
      if (diff > 20) {
        highlighter = true;
      }

      let newInfo: CombinedInfo = {
        type: 'combinedInfo',
        cptCode: cptCode,
        hospitalPrice: billLine.hospitalPrice,
        normalPrice: normalPrice,
        description: billLine.description,
        highlight: highlighter
      };
      responseData.push(newInfo);
    }

    for (const item of Object.values(billIndex)) {
      if (!item.visited) {
        responseData.push({
          type: 'failedRow',
          description: item.bill.description,
          cptCode: item.bill.cptCode
        });
      }
    }

    return Response.json(responseData);
  } catch (error) {
    console.error('Error in POST request:', error);
    // @ts-ignore
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

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
