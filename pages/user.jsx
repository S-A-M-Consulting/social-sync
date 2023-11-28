//'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  const userId = sessionStorage.getItem("userId");
  console.log("userId", userId);
  console.log(user.picture)
  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <h2>{user.nickname}</h2>
      </div>
    )
  );
}
