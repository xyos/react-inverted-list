import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { IContent } from '../App';
import './InverseList.css';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';

export interface InverseListProps {
  deleteListItem: (index: number) => void;
  list: IContent[];
}

export const InverseList: FC<InverseListProps> = (props: InverseListProps) => {
  const sizesCache = new CellMeasurerCache({
    defaultHeight: 85,
    fixedWidth: true,
  });

  const mounted: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const listRef: RefObject<List> = useRef<List>(null);

  useEffect(() => {
    console.log(mounted);
    if (mounted.current) {
      sizesCache.clearAll();
      listRef?.current?.recomputeRowHeights();
      setTimeout(() => scrollToBottom());
    }
  },[mounted]);

  const width = 280;

  const [showScrollButton, setShowScrollButton] = useState(true);

  // useEffect(() => {
  //   ref?.current?.addEventListener('scroll', () => {
  //     console.log(ref);
  //     if (ref?.current && ref.current?.scrollTop < 0) {
  //       setShowScrollButton(true);
  //     } else {
  //       setShowScrollButton(false);
  //     }
  //   });
  // }, []);

  const scrollToBottom = () => {
    listRef.current?.scrollToRow(props.list.length);
    // hack on react-virtualized issue
    setTimeout(() => {
      listRef.current?.scrollToRow(props.list.length);
    });
  };

  const renderItem = (
    item: IContent,
    index: number,
    style: Object,
    parent: MeasuredCellParent
  ) => {
    return (
      <CellMeasurer
        cache={sizesCache}
        columnIndex={0}
        key={item.id}
        parent={parent}
        rowIndex={index}
        width={width}
      >
        <div key={item.id} className="p-2" style={style}>
          <div className="rounded border p-4 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <div className="flex justify-between mb-2">
              <span className="font-bold">item-{index + 1}</span>
              <span>id:{item.id}</span>
              <button
                className="flex justify-center content-center px-2 font-semibold rounded-lg shadow-md text-white bg-pink-200 hover:bg-pink-700"
                onClick={() => props.deleteListItem(index)}
              >
                &#10005;
              </button>
            </div>
            <div className="prose">
              <p className="text-justify">{item.content}</p>
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const rowRenderer =
    (list: IContent[]) =>
    ({
      index,
      style,
      parent,
    }: {
      index: number;
      style: Object;
      parent: MeasuredCellParent;
    }) => {
      const item: IContent = list[index];
      return renderItem(item, index, style, parent);
    };

  return (
    <div className="flex flex-col flex-1" ref={mounted}>
      <p>{props.list.length} Items</p>
      <div>
        {props.list.length && showScrollButton ? (
          <a onClick={() => scrollToBottom()} className="">
            Back to bottom
          </a>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
      <AutoSizer>
        {({ width, height }) => (
          <List
            // className={styles.List}
            ref={listRef}
            className="scroll-bottom flex-col-reverse"
            deferredMeasurementCache={sizesCache}
            height={height}
            rowCount={props.list.length}
            rowHeight={sizesCache.rowHeight}
            rowRenderer={rowRenderer(props.list)}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
};
