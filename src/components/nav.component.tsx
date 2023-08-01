'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { signOut } from 'next-auth/react';
import { useState, useRef } from 'react';
import { MdOutlineClose } from 'react-icons/md';

export const Navbar = () => {
  const router = useRouter();

  const ref = useRef<string | any>('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  function handleClick(e: any) {
    if (e.target.contains(ref.current)) {
      setShowMenu(false);
    }
  }

  return (
    <div className="w-full h-18 lg:h-16 sticky top-0 z-50 px-4 font-rubik bg-primary-rose">
      <div className="max-w-container h-full mx-auto py-1 flex items-center justify-between">
        <div>
          <Link href={'/main'}>
            <img
              className="w-16"
              src={'/images/cafe.svg'}
              alt="logo"
            />
          </Link>
        </div>

        <div className="hidden md:inline-flex items-center gap-7">
          <ul className="flex text-primary-gray text-[1.1rem] gap-7 font-normal">
            <Link
              href={'/main'}
              className="hover:text-[#4E3104]">
              <li>Home</li>
            </Link>
            <Link
              href={'/bookmark'}
              className="hover:text-[#4E3104]">
              <li>Bookmark</li>
            </Link>
            <Link
              href={'/favorite'}
              className="hover:text-[#4E3104]">
              <li>Favorite</li>
            </Link>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="h-[27px] cursor-pointer hover:text-[#4E3104]"
              onClick={handleSignOut}
            />
          </ul>
        </div>
        <div
          onClick={() => setShowMenu(true)}
          className="w-6 h-5 flex flex-col justify-between items-center md:hidden text-4xl text-primary-gray cursor-pointer overflow-hidden group">
          <span className="w-full h-[2px] bg-[#4E3104] inline-flex transform group-hover:translate-x-2 transition-all ease-in-out duration-300"></span>
          <span className="w-full h-[2px] bg-[#4E3104] inline-flex transform trancelate-x-3 group-hover:translate-x-0 transition-all ease-in-out duration-300"></span>
          <span className="w-full h-[2px] bg-[#4E3104] inline-flex transform trancelate-x-1 group-hover:translate-x-3 transition-all ease-in-out duration-300"></span>
        </div>
        {showMenu && (
          <div
            ref={(node) => (ref.current = node)}
            onClick={handleClick}
            className="absolute md:hidden top-0 right-0 w-full h-screen bg-black bg-opacity-50 flex flex-col items-end">
            <div className="md:w-2/5 sm:w-3/5 w-full h-full overflow-y-scroll scrollbarHide bg-[#F7EDE2] flex flex-col items-center px-4 py-10 relative">
              <MdOutlineClose
                onClick={() => setShowMenu(false)}
                className="text-4xl text-primary-text cursor-pointer hover:text-primary-coral absolute top-4 right-4"
              />
              <ul className="flex flex-col gap-5 items-start mt-[10rem]">
                <Link href={'/main'}>
                  <li className="text-2xl hover:text-primary-green">Home</li>
                </Link>
                <Link href={'/bookmark'}>
                  <li className="text-2xl hover:text-primary-green">
                    Bookmark
                  </li>
                </Link>
                <Link href={'/favorite'}>
                  <li className="text-2xl hover:text-primary-green">
                    Favorite
                  </li>
                </Link>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="h-[27px] cursor-pointer hover:text-primary-green"
                  onClick={handleSignOut}
                />
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
