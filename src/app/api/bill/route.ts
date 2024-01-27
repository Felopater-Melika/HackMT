import axios from 'axios';
export const dynamic = 'force-dynamic'; // defaults to auto

// Felo will implement this
async function azureOCR(billLine: BillLine[]) {}

// backend team will implement this
async function lookupNormalPrices(cptCodes: string[]) {
  // I'll get information about exactly what this URL will
  // be later.
  const URL = 'some localhost url with a different port';
  // use axios.post; look up the documentation.
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
}

// CPT Code:
// in hospitals they need a consistent way to describe what
// a procedure is, so CPT codes are one of the systems they
// use. It's what's normally on itemized bills.

export async function POST(request: Request) {
  // get image from the request
 const imageFormData = await request.formData() 
 

  // then take the image and feed it to azureOCR
  // const bill: BillLine[] = await azureOCR(image);

  // get the cpt codes out of the bill info
  // const cptCodes = bill.map((item) => item.cptCode);

  // const priceInfo: PriceInfo[] = lookupNormalPrices(cptCodes);

  // TODO: combine this new info with the existing bill information to
  // add the hospital price to it. You could turn the bill array
  // into an object with the cpt codes as keys.

  const combinedInfo: CombinedInfo[] = []; // however you make this

  /*
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
  */

  return Response.json(combinedInfo);
}
