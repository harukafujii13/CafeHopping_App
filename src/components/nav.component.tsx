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
      <ul className="flex flex-row justify-end text-primary-gray bg-primary-rose h-[3rem] items-center px-10">
        <li className="ml-5">
          <Link href={'/main'}>
            <FontAwesomeIcon
              icon={faHouse}
              className="h-[27px]"
            />
          </Link>
        </li>
        <li className="ml-5">
          <Link href={'/bookmark'}>
            <FontAwesomeIcon
              icon={faBookmark}
              className="h-[27px]"
            />
          </Link>
        </li>
        <li className="ml-5">
          <Link href={'/favorite'}>
            <FontAwesomeIcon
              icon={faHeart}
              className="h-[27px]"
            />
          </Link>
        </li>
        <li className="ml-5">
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="h-[27px]"
            onClick={handleSignOut}
          />
        </li>
      </ul>
    </div>
  );
};
