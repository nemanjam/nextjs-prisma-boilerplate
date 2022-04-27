import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { dehydrate, QueryClient } from 'react-query';
import ProfileView from 'views/Profile';
import QueryKeys from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { getAvatarPathAbsolute } from 'lib-client/imageLoaders';
import { ssrNcHandler } from '@lib-server/nc';
import { Redirects } from 'lib-client/constants';
import { ClientUser } from 'types/models/User';
import { getPosts } from '@lib-server/services/posts';
import { getUserByIdOrUsernameOrEmail } from '@lib-server/services/users';
import {
  validatePostsSearchQueryParams,
  validateUserSearchQueryParams,
} from '@lib-server/validation';

type ProfileProps = {
  profile: ClientUser;
};

const Profile: FC<ProfileProps> = ({ profile }) => {
  return (
    <>
      <CustomHead
        title={profile.name}
        description={profile.name}
        image={getAvatarPathAbsolute(profile)}
      />
      <PageLayout noPaddingTop>
        <ProfileView profile={profile} />
      </PageLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const callback1 = async () => {
    validateUserSearchQueryParams(params);
    return await getUserByIdOrUsernameOrEmail(params);
  };
  const profile = await ssrNcHandler<ClientUser>(req, res, callback1);

  if (!profile) return Redirects.NOT_FOUND;

  const query = { username: profile.username };

  const callback2 = async () => {
    validatePostsSearchQueryParams(query);
    return await getPosts(query);
  };
  const posts = await ssrNcHandler(req, res, callback2); // <PaginatedResponse<PostWithAuthor>>

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [QueryKeys.POSTS_PROFILE, profile.username, 1],
    () => posts
  );

  return {
    props: {
      profile,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Profile;
