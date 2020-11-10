import React from 'react';
import {FlipperPlugin, createTablePlugin, KeyboardActions, Panel, ManagedDataInspector, Text, TableBodyRow} from 'flipper';

type Row = {
  id: string,
  type: 'event' | 'screen';
  payload: Record<string, any>;
};

const columns = {
  type: {
    value: 'Type',
  },
  name: {
    value: 'Name',
  },
  payload: {
    value: 'Parameters',
  },
};

const columnSizes = {
  type: '10%',
  name: '15%',
  payload: 'flex',
};

function renderSidebar(row: Row) {
  return (
    <Panel floating={false} heading={'Info'}>
      <ManagedDataInspector data={row} expandRoot={true} />
    </Panel>
  );
}

function buildRow(row: Row): TableBodyRow {
  return {
    columns: {
      type: {
        value: <Text>{row.type}</Text>,
        isFilterable: true,
        sortValue: row.type,
      },
      name: {
        value: <Text>{row.payload.name}</Text>,
        isFilterable: true,
        sortValue: row.payload.name,
      },
      payload: {
        value: <Text>{Object.entries(row.payload || {}).map(([key, value]) => `${key}=${value}`).join(', ')}</Text>,
        isFilterable: true,
      },
    },
    key: row.id,
    copyText: JSON.stringify(row),
    filterValue: `${row.type} ${row.payload.name} ${JSON.stringify(row.payload)}`,
  };
}

export default createTablePlugin<Row>({
  method: 'newRow',
  columns,
  columnSizes,
  renderSidebar,
  buildRow,
});