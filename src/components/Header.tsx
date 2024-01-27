import Link from 'next/link'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input
} from '@nextui-org/react'
import HeaderAuth from './Header-auth'

/* Por baixo dos panos a função "auth" modifica os cookies. logo, se trata de um comportamento dinâmico.
   Então toda página que conter nosso Header seria tratada como dinâmica. Porém, como separamos nosso
   componente dentro de um componente client, agora não acessamos diretamente os cookies, logo,
   a página continua estática
*/
export default function Header() {
  // session from server side
  // const session = await auth()

  return (
    <Navbar className="shadow mb-6">
      <NavbarBrand>
        <Link href='/' className="font-bold">Discuss</Link>
      </NavbarBrand>

      <NavbarContent justify='center'>
        <NavbarItem>
          <Input />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  )
}
