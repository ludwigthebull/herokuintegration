import React from 'react';

import ChatMessage from '../ChatMessage';

const MainSection = (props) => {
  return (
    <main className="messages">
      {
        props.messages.map(function(message, i) {
          var ChatComponent = message.component;
          return (
            <div key={i}>
              <ChatComponent message={message} />
            </div>
          );
        })
      }
    </main>
  );
};

export default MainSection;
