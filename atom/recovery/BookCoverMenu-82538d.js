// @flow

import { Component } from 'react';

export class BookCoverMenu extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.book}
        key={bookFolder.bookName}
        underlayColor="#FFF"
        activeOpacity={0.85}
        onPress={() => this.downloadBook(bookFolder)}
      >
        <Image
          borderRadius={3}
          resizeMode="contain"
          style={{ flex: 1 }}
          source={{
            uri: bookFolder.smallCoverUrl
          }}
        />
      </TouchableHighlight>
    );
  }
}
