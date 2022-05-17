import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import PageLayout from 'layouts/PageLayout';
import { dehydrate, QueryClient } from 'react-query';
import ProfileView from 'views/Profile';
import QueryKeys, { filterEmptyKeys } from 'lib-client/react-query/queryKeys';
import CustomHead from 'components/CustomHead';
import { getAvatarPathAbsolute } from 'lib-client/imageLoaders';
import { ssrNcHandler } from 'lib-server/nc';
import { Redirects } from 'lib-client/constants';
import { ClientUser } from 'types/models/User';
import { getPosts } from 'lib-server/services/posts';
import { getMe, getUserByIdOrUsernameOrEmail } from 'lib-server/services/users';
import {
  validatePostsSearchQueryParams,
  validateUserSearchQueryParams,
} from 'lib-server/validation';
import { QueryParamsType } from 'types';

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
  // just for MeProvider
  const callback1 = async () => await getMe({ req });
  const me = await ssrNcHandler<ClientUser | null>(req, res, callback1);

  const callback2 = async () => {
    const parsedData = validateUserSearchQueryParams(params as QueryParamsType);
    return await getUserByIdOrUsernameOrEmail(parsedData);
  };
  const profile = await ssrNcHandler<ClientUser>(req, res, callback2);

  if (!profile) return Redirects.NOT_FOUND;

  const query: QueryParamsType = { username: profile.username };
  const callback3 = async () => {
    const parsedData = validatePostsSearchQueryParams(query);
    return await getPosts(parsedData);
  };
  const posts = await ssrNcHandler(req, res, callback3); // <PaginatedResponse<PostWithAuthor>>

  if (!posts) return Redirects._500;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [QueryKeys.POSTS_PROFILE, profile.username, 1],
    () => posts
  );
  await queryClient.prefetchQuery(filterEmptyKeys([QueryKeys.ME, me?.id]), () => me);

  return {
    props: {
      profile,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Profile;
