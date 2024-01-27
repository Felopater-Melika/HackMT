import axios from 'axios';
import { imageOptimizer } from 'next/dist/server/image-optimizer';
export const dynamic = 'force-dynamic'; // defaults to auto

// Felo will implement this
async function azureOCR(image: File): Promise<BillLine[]> {
  return [
    {cptCode: '99284', hospitalPrice: 2000},
    {cptCode: '80048', hospitalPrice: 3000}
  ]
}

// backend team will implement this
async function lookupNormalPrices(cptCodes: string[]): Promise<PriceInfo[]> {
  // I'll get information about exactly what this URL will
  // be later.
  const URL = 'localhost:5000';
  //const res = await axios.post(URL, cptCodes)
  //return res.data;
  // use axios.post; look up the documentation.


  //Potential use of Fetch
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cptCodes),
  });
  const data : PriceInfo [] = await res.json();


  // will return something like
  return [
    {cptCode: '99284', normalPrice: 2000, description: "Code a"},
    {cptCode: '80048', normalPrice: 3000, description: "Code b"}
  ]
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
  // get image from the request
 const imageFormData = await request.formData();
 
 const image = imageFormData.get('image') as File;

 //console.log(image.name);

 
 
 // then take the image and feed it to azureOCR
  const bill: BillLine[] = await azureOCR(image);

  // get the cpt codes out of the bill info
  const cptCodes = bill.map((item) => item.cptCode);
  const HospitalPrice = bill.map((item)=>item.hospitalPrice);
  

  const priceInfo: PriceInfo[] = await lookupNormalPrices(cptCodes);

  // TODO: combine this new info with the existing bill information to
  // add the hospital price to it. You could turn the bill array
  // into an object with the cpt codes as keys.
  let len = cptCodes.length;

  let billIndex: {[key: string]: BillLine} = {};

  for (let billLine of bill) {
    billIndex[billLine.cptCode] = billLine;
  }
  
  const combinedInfo: CombinedInfo[] = []// however you make this
  //we will use a for loop that will based on the number of CPT codes within the bill interface. each time it loops it will
  //create a new combined info data type and append it to the combinedInfo array
  for(let i = 0; i < len; i++){
    let billLine: BillLine = billIndex[priceInfo[i].cptCode];
    let highlighter = true;
    //True means it doesnt get highlighted, this means the hospital price is less than normal price
    //false means hospital price is higher than normal price.
    if(billLine.hospitalPrice - priceInfo[i].normalPrice > 0){
      highlighter = false;
    }
    let newInfo: CombinedInfo = { 
      cptCode: priceInfo[i].cptCode, 
      hospitalPrice: billLine.hospitalPrice , 
      normalPrice: priceInfo[i].normalPrice, 
      description: priceInfo[i].description,
      highlight: highlighter 
    }
    combinedInfo.push(newInfo);
}
/*const combinedInfo: CombinedInfo = {
  cptCode:cptCodes[0], 
  hospitalPrice: HospitalPrice[0], 
  normalPrice: 
}*/
  return Response.json(combinedInfo);
}
