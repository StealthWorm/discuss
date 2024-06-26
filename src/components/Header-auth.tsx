'use client';

import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@nextui-org/react'
import * as actions from '@/actions'
import { useSession } from 'next-auth/react';

export default function HeaderAuth() {
  // session from client side
  const session = useSession()

  let authContent: React.ReactNode;

  /* como agora estamos validando a sessão do lado do cliente, e este precisa fazer uma chamada ao servidor,
     precisamos validar se a requisição ainda não foi carregada (loading), evitando que o conteudo
     seja mostrado enquanto o status não for positivo
  */
  if (session.status === 'loading') {
    authContent = null
  } else if (session.data?.user) {
    authContent =
      <Popover placement='left' id="avatar" data-test-id='popover-user'>
        <PopoverTrigger>
          <Avatar src={session.data.user.image || ""} data-test-id="signed-in-avatar" />
        </PopoverTrigger>

        <PopoverContent>
          <div className="p-4">
            <form action={actions.signOut}>
              <Button type="submit" data-test-id="sign-out-button">Sign Out</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
  } else {
    authContent = <>
      <NavbarItem id="options">
        <form action={actions.signIn}>
          <Button type="submit" color="secondary" variant='bordered' data-test-id="sign-in-button">
            Sign In
          </Button>
        </form>
      </NavbarItem>
      <NavbarItem>
        <form action={actions.signIn}>
          <Button type="submit" color="primary" variant='flat' data-test-id="sign-up-button">
            Sign Up
          </Button>
        </form>
      </NavbarItem>
    </>
  }

  return authContent;
}
