# flipper-plugin-analytics
A simple plugin to display a table of analytics events from a mobile app. The react-native client side we use is as follows:

```
import type { Flipper } from 'react-native-flipper';
import { log } from '../log';

interface AnalyticsPluginEvent {
  id: string;
  type: 'event' | 'screen';
  payload: Record<string, any>;
}

interface FlipperAnalyticsPlugin extends Flipper.FlipperPlugin {
  q: Array<AnalyticsPluginEvent>;
  eventId: number;
  connection?: { send: (name: string, event: any) => void };
  logEvent: (event: any) => void;
  logScreen: (routeName: string, reportName: string, args?: Record<string, any>) => void;
}

let eventPlugin: FlipperAnalyticsPlugin | undefined;

if (__DEV__) {
  eventPlugin = {
    q: [],
    eventId: 1,
    runInBackground() {
      return true;
    },
    getId() {
      return 'Analytics';
    },
    onConnect(connection) {
      this.connection = connection;
      log.debug('Flipper connected');
      this.q.forEach((event) => {
        connection.send('newRow', event);
      });
      this.q = [];
    },
    onDisconnect() {
      log.debug('Flipper disconnected');
      delete this.connection;
    },
    logEvent(event) {
      const record: AnalyticsPluginEvent = {
        id: String(this.eventId),
        type: 'event',
        payload: event,
      };
      this.eventId += 1;
      if (this.connection) {
        this.connection.send('newRow', record);
      } else {
        this.q.push(record);
      }
    },
    logScreen(routeName, reportName, args = {}) {
      const record: AnalyticsPluginEvent = {
        id: String(this.eventId),
        type: 'screen',
        payload: {
          ...args,
          name: reportName,
          route: routeName,
        },
      };
      this.eventId += 1;
      if (this.connection) {
        this.connection.send('newRow', record);
      } else {
        this.q.push(record);
      }
    },
  };
  const { addPlugin } = require('react-native-flipper');
  addPlugin(eventPlugin);
}

export default eventPlugin;
```
