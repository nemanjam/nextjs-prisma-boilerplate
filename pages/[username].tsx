import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import prisma from 'lib/prisma';
import { Prisma } from '@prisma/client';

type Props = {
  profile: Prisma.UserCreateInput;
};

const Profile: React.FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState(undefined);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const isEditable = session.user.username === router.query.username;

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
      await axios.post('/api/user/upload-avatar', formData, config);
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
      {avatar && (
        <img src={avatar} style={{ height: '100px', width: '100px' }} />
      )}
      {progress > 0 && progress}

      <button onClick={handleUpload}>Upload</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const router = useRouter();
  const { username } = router.query;

  const drafts = await prisma.post.findMany({
    where: { username },
  });

  return {
    props: { drafts },
  };
};

export default Profile;
