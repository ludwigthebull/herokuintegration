import React from 'react';

const ChatMap = (props) => {
  return (
    <article className="dt w-100 pb2 mt2">
      <div className="dtc w2 w3-ns">
        <img src={"https://robohash.org/" + props.message.author_id + ".png"} className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
      </div>
      <div className="dtc v-mid pl3">
        <h1 className="f6 f5-ns fw6 lh-title black mv0">{props.message.author_name}</h1>
        <p className="f5 fw4 mt0 mb0 black-70 lh-copy measure-wide" style={{"white-space": "pre-wrap"}}>
          {props.message.message}
        </p>
        <p className="f5 fw4 mt2 mb0 black-70 lh-copy measure-wide">
          <a href={props.message.meta.directions} target="_blank">
            <img style={{"height":props.message.meta.size.height}} src={props.message.meta.map}/>
          </a>
        </p>
      </div>
    </article>
  );
};

export default ChatMap;
