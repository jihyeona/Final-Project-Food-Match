import React, { useState } from 'react'
import { Container } from 'styled-container-component';
import { Button } from 'styled-button-component';
import { Navbar, NavbarLink } from 'styled-navbar-component';
import { Nav } from 'styled-nav-component';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/user'
import { InputButton } from '../lib/button'

export const NavbarLight = () => {
  const [hidden, setHidden] = useState(true)
  const dispatch = useDispatch()

  return (
    <Navbar expandSm light>
      <Nav start>
        <Link to='/home'>
          <NavbarLink light brand>ROLL POLL.</NavbarLink>
        </Link>
        <Nav end>
          <Button
            light
            outline
            toggleCollapse
            expandSm
            onClick={() => setHidden(!hidden)}
          >
            <span>&#9776;</span>
          </Button>
        </Nav>
      </Nav>
      <Nav start collapse expandSm hidden={hidden}>
        <Link to='/home'>
          <NavbarLink light active>Ongoing Polls</NavbarLink>
        </Link>
        <Link to='/addpoll'>
          <NavbarLink light active>Add a Poll</NavbarLink>
        </Link>
        <Link to='/mypage'>
          <NavbarLink light active>My Page</NavbarLink>
        </Link>

        <Link to='/login'>
          <InputButton light active type='submit' onClick={() => dispatch(logout())} value='Log Out' />
        </Link>
        {/* <NavbarLink light disabled href="#">Disabled</NavbarLink> */}
      </Nav>
    </Navbar>
  );
};

export default NavbarLight