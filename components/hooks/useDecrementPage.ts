import { SetStateAction, useEffect } from 'react';

type Props = {
  itemsType: 'posts' | 'users';
  page: number;
  total: number;
  setPage: (value: SetStateAction<number>) => void;
};

/**
 * reusable hook home, profile, drafts, users
 * decrement page if no posts on that page
 */
const useDecrementPage = ({ itemsType, total, setPage, page }: Props) => {
  const perPage =
    itemsType === 'posts'
      ? parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE)
      : itemsType === 'users'
      ? parseInt(process.env.NEXT_PUBLIC_USERS_PER_PAGE)
      : 5;

  useEffect(() => {
    if (total > 0 && page > 1 && total - (page - 1) * perPage === 0) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [total, page]);
};

export default useDecrementPage;
