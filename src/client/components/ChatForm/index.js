import React from 'react';

class ChatForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const input = this.refs.input;

    if (input.value == '') return false;

    this.props.chat(input.value);
    input.value = '';
  }

  render() {
    return (
      <form className="w-100 ma0" onSubmit={::this.handleSubmit}>
        <input
          autoFocus
          type="text"
          className="h4-ns h3 input-reset bn pa4 bg-washed-blue w-100 f3"
          placeholder="Say something..."
          style={{flex: "0 0 auto"}}
          ref="input" />
          <button
            className="dn"
            type="submit"
            onSubmit={::this.handleSubmit}>
            Send Message
          </button>
      </form>
    )
  }

}

export default ChatForm;
