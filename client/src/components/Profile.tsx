import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

type UserProfile = {
  id: string;
  username: string;
  email: string;
};

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!id) return;

    api.get(`/api/user/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to load user:", err);
      });
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <h1>profile</h1>
      <div>
        <h1 className="text-xl font-bold">{user.username}</h1>
        <p>ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>
    </>
  );
}