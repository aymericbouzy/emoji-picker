import DefaultDocument, { Head, Html, Main, NextScript } from 'next/document';

class Document extends DefaultDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
