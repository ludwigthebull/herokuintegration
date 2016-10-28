import React from 'react';
import ChatForm from '../ChatForm';

const Footer = (props) => {
  return (
    <footer>
      <ChatForm chat={props.chat}/>
    </footer>
  );
};

export default Footer;
