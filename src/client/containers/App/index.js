import React from 'react';
import $ from 'jquery';

import MainSection from '../../components/MainSection';
import Footer from '../../components/Footer';

import { scrollDown, format } from '../../utils';

import ChatMessage from '../../components/ChatMessage';
import ChatMap from '../../components/ChatMessage/map';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      clientName: null,
      botName: 'LawBot',
      userName: 'You',
      botTypingMessage: 'Typing...'
    };
  }

  componentDidUpdate() {
    const el = this.refs.messageList;
    el.scrollTop = el.scrollHeight;
  }

  componentDidMount() {
    // TODO: Document this (and migrate to it!)
    // this.sendMessage('interface_command_welcome_user_uk');
    this.sendMessage('welcomeuseruk');
  }

  chat(input) {
    var lastMessage = this.state.messages[this.state.messages.length - 1];
    if (lastMessage.author_name == this.state.userName ||
      (lastMessage.message == this.state.botTypingMessage
        && lastMessage.author_name == this.state.botName))
    {
      return false;
    }

    this.addMessage({
      author_name: this.state.userName,
      author_id: this.state.clientName,
      message: input,
      component: ChatMessage
    });

    setTimeout(function() {
      this.sendMessage(input);
    }.bind(this), 1000);
  }

  sendMessage(input) {
    this.typingOn();

    var self = this;

    $.ajax({
      method: 'POST',
      url: '/',
      data: {input: input, clientName: this.state.clientName},
      success: data => {
        try {
          var commands = JSON.parse(data.text);
        } catch (exception) {
          var commands = [{command: 'say', value: data.text}];
        }

        self.processCommands(commands);

        if (data.clientName) { this.setState({clientName: data.clientName}); }

        this.track({'label':'Message'})
      },
      error: data => {
        self.addMessage({message: 'Sorry, an error occured when sending your previous message. Please try again.'});
      }
    });
  }

  typingOn() {
    this.addMessage({
      author_name: this.state.botName,
      author_id: this.state.botName,
      message: this.state.botTypingMessage,
      component: ChatMessage
    });
  }

  typingOff() {
    if (this.state.messages.length > 0 &&
      this.state.messages[this.state.messages.length - 1].author_id === this.state.botName &&
      this.state.messages[this.state.messages.length - 1].message === this.state.botTypingMessage)
    {
      this.state.messages.splice(this.state.messages.length - 1, 1);
    }
  }

  addMessage(properties) {
    this.typingOff();

    this.setState({messages: this.state.messages.concat({
      author_name: properties.author_name || this.state.botName,
      author_id: properties.author_id || this.state.botName,
      message: properties.message,
      meta: properties.meta || {},
      component: properties.component || ChatMessage
    })});
  }

  processCommands(commands) {
    commands.forEach(function(command){
      this[command.command](command);
    }, this);
  }

  say(command) {
    this.addMessage({message: command.value});
  }

  map(command) {
    $.ajax({
      method: 'POST',
      url: '/place',
      data: {search: command.value},
      success: data => {
        data.directions = 'https://www.google.com/maps/dir//' + encodeURIComponent(data.name + ',' + data.address).replace(/%20/g, "+");
        data.size = {width: 400, height: 200};
        data.map = 'http://maps.googleapis.com/maps/api/staticmap?' + $.param({
          center: data.address,
          scale: 1,
          size: data.size.width + 'x' + data.size.height,
          maptype: 'roadmap',
          format: 'png',
          visual_refresh: 'true',
          markers: 'color:blue|label:p|' + data.address,
          key: process.env.GOOGLE_STATICMAPS_API_KEY
        });

        var message = format(command.message, data.name, data.address);
        this.addMessage({message: message, meta: data, component: ChatMap});
      },
      error: data => {
        // TODO: Document this
        this.sendMessage('interfacecommandlocationnotfound');
      }
    });
  }

  track(command) {
    var category = command.category || 'Chat';
    var label = command.label || null;
    var value = command.value || null;
    ga('send', 'event', category, label, value);
  }

  render() {
    return (
        <div className="w-100 h-100 sans-serif overflow-hidden">
          <div className="flex flex-column h-100">
            <div className="pa4 bg-washed-blue black-70" style={{flex: "0 0 auto"}}>
              <h1 className="f1-ns ma0">LawBot</h1>
              <p className="f6 f5-ns ma0">By using our service you agree to our terms and conditions. <a className="black dim" href="http://lawbot.info/terms-and-conditions/">Learn more at LawBot.info &rarr;</a></p>
            </div>
            <div className="bg-lightest-blue pa4 overflow-y-auto relative flex-auto" ref="messageList">
              <MainSection messages={this.state.messages} />
            </div>
            <Footer chat={::this.chat} />
          </div>
        </div>
    );
  }
}

export default App;
