import { h, Component } from 'preact';
import EpubView from 'book-view';
import styled from 'styled-components';

const Book = styled.div`display: inline;`;

export default class BookView extends Component {
  componentDidMount() {
    this.epub.loadBook({
      path: 'file:///Users/bruno/workspace/books/Benjamin/',
      width: 300,
      height: 500,
      fontSize: '1.60em'
    });
  }
  render() {
    return (
      <Book>
        {<}<EpubView ref={epub => (this.epub = epub)} />
      </Book>
    );
  }
}
