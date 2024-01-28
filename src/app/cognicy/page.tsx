'use client';

import Navbar from '../../components/navbar';
import FormDataTypeArray from '../../types/formData';
import ImageUploadForm from '@/components/ImageUploadForm';
import '../globals.css';
import { useState } from 'react';
import { ResponseItem, CombinedInfo, FailedRow } from '@/types/responseForm';
import githubLogo from '../../images/github-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import NegotiationScript from '@/components/negotiationScript';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const getPrice = (price: Number | null) => {
  if (price) {
    return formatter.format(Number(price));
  }
  return 'N/A';
};
interface HandleRowParams {
  data: ResponseItem;
}
const HandleRow: React.FC<HandleRowParams> = ({ data }) => {
  if (data.type == 'failedRow') {
    return (
      <tr className="bg-blue-500">
        <td>{data.cptCode}</td>
        <td>{data.description}</td>
        <td colSpan={2}>Did not have access to price data</td>
      </tr>
    );
  } else {
    return (
      <tr className={data.highlight ? 'bg-red-500' : ''}>
        <td>{data.cptCode}</td>
        <td>{data.description}</td>
        <td
          style={getPrice(data.hospitalPrice) === 'N/A' ? { color: 'red' } : {}}
        >
          {getPrice(data.hospitalPrice)}
        </td>
        <td
          style={getPrice(data.normalPrice) === 'N/A' ? { color: 'red' } : {}}
        >
          {getPrice(data.normalPrice)}
        </td>
      </tr>
    );
  }
};

export default function Home() {
  const [formData, setFormData] = useState<FormDataTypeArray | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const keysOfFormDataType = Object.keys({} as FormDataTypeArray[number]);
  const anyPriceAboveStandard = formData?.some(
    (data) => data.hospitalPrice > data.normalPrice
  );
  const anyHighlight =
    formData &&
    formData.forEach((data) => {
      if (data.highlight) {
        return true;
      }
      return false;
    });
  console.log(formData);
  return (
    <main>
      <Navbar />
      {/* center the drop field*/}
      <ImageUploadForm setFormData={setFormData} setLoading={setIsLoading} />
      <div className="overflow-x-auto tableStyle rounded-md">
        {/* {isLoading ? (
          'loading'
        ) : ( */}
        <table className="table ">
          {/* head */}
          <thead>
            <tr>
              <th>cptCode</th>
              <th>description</th>
              <th>hospitalPrice</th>
              <th>normalPrice</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  <span className="loading loading-dots loading-lg"></span>
                </td>
              </tr>
            ) : formData && formData.length > 0 ? (
              formData.map((data, index) => (
                <HandleRow key={index} data={data as ResponseItem} />
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* )} */}
      </div>
      {anyPriceAboveStandard && formData && (
        <NegotiationScript
          cptCodes={formData?.map((data) => data.cptCode)}
          chargedPrices={formData?.map((data) => data.hospitalPrice)}
          standardPrices={formData?.map((data) => data.normalPrice)}
        />
      )}
      <footer className="footer footer-center p-10 bg-primary text-primary-content">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="inline-block fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p className="font-bold">
            HackMT team 9<br />
            Providing reliable tech since 2024
          </p>
          <p>Copyright © 2024 - All right reserved</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <Link href={'https://github.com/Felopater-Melika/HackMT'}>
              <Image
                src={githubLogo}
                alt="github logo"
                height={50}
                // align the logo to the right side of the navbar
                className="align-middle"
              />
            </Link>
          </div>
        </nav>
      </footer>
    </main>
  );
}
