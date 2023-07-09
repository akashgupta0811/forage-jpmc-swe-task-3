import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      ratio: 'float', // New field to track the ratio
      upper_bound: 'float', // Upper bound for trading opportunity
      lower_bound: 'float', // Lower bound for trading opportunity
      trigger_alert: 'boolean', // Indicates if the bounds are crossed
      timestamp: 'date',
      price_abc: 'float', // Necessary to calculate the ratio
      price_def: 'float', // Necessary to calculate the ratio
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'bool',
        timestamp: 'distinct count',
        price_abc: 'avg',
        price_def: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const data = DataManipulator.generateRow(this.props.data);
      this.table.update([data] as any);
    }
  }
}

export default Graph;
