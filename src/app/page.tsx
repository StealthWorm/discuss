import { Button } from "@nextui-org/react";
import * as actions from '@/actions';
import { auth } from "@/auth";
import Profile from "@/components/Profile";

export default async function Home() {
  // session from server side
  const session = await auth()

  return (
    <div>
      <form action={actions.signIn}>
        <Button type="submit">Sign In</Button>
      </form>

      <form action={actions.signOut}>
        <Button type="submit">Sign Out</Button>
      </form>

      {session?.user
        ? <div>From Server:{JSON.stringify(session.user)}</div>
        : <div>From Client:Not Signed In</div>
      }

      <Profile />
    </div>
  );
}
