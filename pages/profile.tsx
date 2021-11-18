import { useState } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState(undefined);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [progress, setProgress] = useState(0);

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

// getServerSideProps and prisma get user

export default Profile;
