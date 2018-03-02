React Switcher
==============

### Demo

<table class="table table-bordered table-striped">
    <tbody>
        <tr>
          <td><img src="http://g.recordit.co/E3mAr1uJv9.gif"/></td>
          <td><img src="http://g.recordit.co/TkGntNnTee.gif"/></td>
        </tr>
        <tr>
          <td><a href="https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/components/SyncToggle.js">Source</a></td>
          <td><a href="https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/components/Settings.js">Source</a></td>
        </tr>
    </tbody>
</table>

### Installation

```
npm install --save react-switcher
```

### Usage

```js
import Switcher from 'react-switcher';

<Switcher
   on={this.state.isLocal} 
   onClick={() => this.setState({ isLocal: !this.state.isLocal })}
>
   Use local server
</Switcher>
```

### License

MIT
