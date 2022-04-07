import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSearchSchema } from 'lib-server/validation';
import { getErrorClass, withBem } from 'utils/bem';

interface SearchFormData {
  search: string;
}

type Props = {
  onSearchSubmit?: (search: string) => void;
  isFetching?: boolean;
};

const SearchInput: FC<Props> = ({ onSearchSubmit, isFetching }) => {
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
        <div className={b('label-row')}>
          <label className={b('label')} htmlFor="search">
            Search
          </label>
          {isFetching && <span className={b('text')}>Fetching...</span>}
        </div>
        <input
          {...register('search')}
          id="search"
          type="text"
          className={getErrorClass(errors.search?.message)}
          aria-errormessage="search-err-msg-id"
          aria-invalid="true"
        />
        <p id="search-err-msg-id" className={getErrorClass(errors.search?.message)}>
          {errors.search?.message}
        </p>
      </div>
    </form>
  );
};

export default SearchInput;
