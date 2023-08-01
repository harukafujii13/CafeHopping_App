'use client';

import { ReactNode } from 'react';
// import loginPage from '/public/images/login-img.jpg';

export const RegisterFrame = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <section className="bg-[url('/images/woody-bg.jpg')] min-h-screen h-full w-screen flex items-center bg-cover bg-bottom min-w-[300px]">
        <div className="w-[85%] max-w-[1000px] xl:max-h-[800px] lg:max-h-[700px] md:max-h-[550px] flex items-center mx-auto rounded-xl overflow-hidden shadow-lg aspect-[3/2] bg-[white] max-md:aspect-[3/4] max-sm:flex-col max-md:relative  max-md:justify-center max-md:w-[85%] max-xs:w-[95%] max-xs:h-auto max-lg:max-h-[90%] my-[5%]">
          <div className="p-3 flex flex-col w-[40%] font-main items-center gap-[0.3rem] max-lg:gap-[0.1rem] max-md:relative max-md:z-10 max-md:bg-[rgba(255,255,255,0.7)] max-md:rounded-lg max-md:py-5 max-md:px-4 max-md:w-4/5 max-md:h-4/5 max-md:justify-center">
            <div>
              <h1 className="mb-5 text-[2rem] md:text-[1.5rem] lg:text-[2rem] font-rubik font-bold max-xs:mb-2  text-primary-yellow">
                Create an Account
              </h1>
            </div>
            {children}
          </div>
          <div className="w-[60%] max-md:absolute max-md:z-1 max-md:w-full">
            <img
              className=" w-full"
              src={'/images/signup-bg.jpg'}
              alt="login page picture"
            />
          </div>
        </div>
      </section>
    </>
  );
};
