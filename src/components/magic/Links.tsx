import React from 'react';

interface Props {
  dark?: boolean;
  footer?: boolean;
}

const Links = ({ dark, footer }: Props) => {
  return (
    <div className={`links ${footer ? 'footer-links' : ''}`}>
      {/* <div className={`link ${dark ? 'text-[#6851ff]' : 'text-[#fff]'}`}>
        <a href="https://magic.link/docs/home/welcome" target="_blank" rel="noreferrer">
          Dev Docs
        </a>
      </div> */}
     
    </div>
  );
};

export default Links;
