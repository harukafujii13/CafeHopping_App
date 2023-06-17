'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faBookmark,
  faHeart,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import { signOut } from 'next-auth/react';

export const Navbar = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div>
      <ul className="flex flex-row justify-end text-primary-gray bg-primary-rose h-[3.2rem] items-center px-10">
        <li className="ml-[2rem]">
          <Link href={'/main'}>
            <FontAwesomeIcon
              icon={faHouse}
              className="h-[27px] cursor-pointer hover:text-[#4E3104]"
            />
          </Link>
        </li>
        <li className="ml-[2rem]">
          <Link href={'/bookmark'}>
            <FontAwesomeIcon
              icon={faBookmark}
              className="h-[27px] cursor-pointer hover:text-[#4E3104]"
            />
          </Link>
        </li>
        <li className="ml-[2rem]">
          <Link href={'/favorite'}>
            <FontAwesomeIcon
              icon={faHeart}
              className="h-[27px] cursor-pointer hover:text-[#4E3104]"
            />
          </Link>
        </li>
        <li className="ml-[2rem]">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="h-[27px] cursor-pointer hover:text-[#4E3104]"
            onClick={handleSignOut}
          />
        </li>
      </ul>
    </div>
  );
};
