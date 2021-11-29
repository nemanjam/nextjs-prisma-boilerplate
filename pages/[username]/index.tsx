import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import prisma from 'lib-server/prisma';
import { Prisma } from '@prisma/client';
import { Routes } from 'lib-client/constants';

type Props = {
  profile: Prisma.UserCreateInput;
};

// this profile feed with messages, not edit profile settings
const Profile: React.FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState(undefined);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [progress, setProgress] = useState(0);

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // console.log('profile', profile, 'session', session);

  const isEditable = session?.user.username === profile.username;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const file = event.target.files[0];
    setAvatar(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleUpload = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: ProgressEvent) => {
        const _progress = Math.round((event.loaded * 100) / event.total);
        setProgress(_progress);
      },
    };

    try {
      await axios.post(Routes.API.USERS, formData, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <div>
        <input
          accept="image/*"
          multiple={false}
          name="avatar"
          onChange={handleChange}
          type="file"
        />
      </div>
      {avatar && <img src={avatar} style={{ height: '100px', width: '100px' }} />}
      {progress > 0 && progress}

      <button onClick={handleUpload}>Upload</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const username = params.username as string;

  const profile = await prisma.user.findUnique({
    where: { username },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: {
        ...profile,
        createdAt: profile.createdAt.toISOString(), // dates not seriazable but needed
        updatedAt: profile.updatedAt.toISOString(),
      },
    },
  };
};

export default Profile;
