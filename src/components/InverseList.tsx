import { Component } from 'react';

export interface IContent {
  content: string;
}


export interface InverseListProps {
  deleteListItem: (index: number) => void;
  list: IContent[];
}

export interface State {
  list: [];
}

export class InverseList extends Component<InverseListProps, State> {
  removeItem = (index: number) => {
    this.props.deleteListItem(index);
  }

  render() {
    return (
      <h1>LIST:</h1>
    )
  }
}
