import React from 'react';
import moment from 'moment';
import { PostStr, UserStr } from 'types';
import { withBem } from 'utils/bem';
import PostItem from 'components/PostItem';
import { getAvatarPath, getHeaderImagePath } from 'utils';
import { mommentFormats } from '@lib-server/constants';

type ProfileProps = {
  profile: UserStr;
  posts: PostStr[];
};

const Profile: React.FC<ProfileProps> = ({ profile, posts }) => {
  const b = withBem('profile');

  return (
    <div className={b()}>
      <section className={b('user-card')}>
        <div
          className={b('header-image')}
          style={{ backgroundImage: `url('${getHeaderImagePath(profile)}')` }}
        />
        <div className={b('user-info')}>
          <img className={b('avatar')} src={getAvatarPath(profile)} />
          <h2 className={b('name')}>{profile.name}</h2>
          <p className={b('username')}>{profile.username}</p>
          <p className={b('bio')}>{profile.bio}</p>
          <p className={b('date')}>{`Joined ${moment(profile.createdAt).format(
            mommentFormats.dateForUsersAndPosts
          )}`}</p>
          {/* count messages, comments, followers */}
        </div>
      </section>

      <section className={b('list')}>
        {posts.map((post) => (
          <PostItem key={post.id} post={{ ...post, author: profile }} />
        ))}
      </section>
    </div>
  );
};

export default Profile;
