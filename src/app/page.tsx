'use client';
import ImageUploadForm from '../components/FileUploadForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ImageUploadForm />
    </main>
  );
}
