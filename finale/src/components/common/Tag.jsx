import React from 'react';

export default function Tag({ children, muted }) {
  return <span className={muted ? 'tag muted-tag' : 'tag'}>{children}</span>;
}
