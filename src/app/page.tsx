'use client';
import ImageUploadForm from '../components/FileUploadForm';
export default function Home() {
  return (<>
    <p>Some parentheses</p>
    <p>Paragraph 2</p>
  </>)
}





























export function OldHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ImageUploadForm />
      </div>
    </main>
  );
}
