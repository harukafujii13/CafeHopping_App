'use client';

export const Footer = () => {
  return (
    <div className="bg-primary-rose py-4 mt-8 bottom-0 w-screen">
      <p className="text-primary-gray text-center text-sm">
        © {new Date().getFullYear()} HARUKA FUJII. All Rights Reserved.
      </p>
    </div>
  );
};
