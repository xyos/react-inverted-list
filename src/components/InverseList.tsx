import { Component } from 'react';

export interface InverseListProps {
  renderItem: JSX.Element;
  list: any[];
}

export interface State {
  list: any[];
}

export class InverseList extends Component<InverseListProps, State> {
  removeItem = (index: number) => {
    this.setState((state) => ({
      list: state.list.filter((_: any, idx: number) => index !== idx),
    }))
  }
}
