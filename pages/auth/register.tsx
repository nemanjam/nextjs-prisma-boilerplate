import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegisterSchema } from 'lib-server/validation';
import { Routes } from 'lib-client/constants';

const Register: React.FC = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(userRegisterSchema),
  });
  const { errors } = formState;

  const onSubmit = async ({ name, username, email, password }) => {
    try {
      await axios.post(Routes.API.USERS, { name, username, email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register('name')} />
        {errors.name && <p className="has-error">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" {...register('username')} />
        {errors.username && <p className="has-error">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p className="has-error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="name">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p className="has-error">{errors.password.message}</p>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
};
export default Register;
