import UserDetailClient from "../UserDetailClient";

export default function UserDetailPage({ params }) {
  return <UserDetailClient userId={params.id} />;
}
