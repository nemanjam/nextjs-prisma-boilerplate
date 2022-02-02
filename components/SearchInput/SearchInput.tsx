import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSearchSchema } from '@lib-server/validation';
import { getErrorClass, withBem } from 'utils/bem';

interface SearchFormData {
  search: string;
}

type Props = {
  onSearchSubmit?: (search: string) => void;
};

const SearchInput: FC<Props> = ({ onSearchSubmit }) => {
  const b = withBem('search');

  const { register, handleSubmit, formState } = useForm<SearchFormData>({
    resolver: zodResolver(postSearchSchema),
  });

  const { errors } = formState;

  const onSubmit = async ({ search }: SearchFormData) => {
    onSearchSubmit && onSearchSubmit(search);
  };

  return (
    <form className={b()} onSubmit={handleSubmit(onSubmit)}>
      <div className={b('form-field')}>
        <label htmlFor="search">Search</label>
        <input
          {...register('search')}
          id="search"
          type="text"
          className={getErrorClass(errors.search?.message)}
        />
        <p className={getErrorClass(errors.search?.message)}>{errors.search?.message}</p>
      </div>
    </form>
  );
};

export default SearchInput;
