import { ComponentType, FC, useCallback, useEffect, useRef, useState } from 'react';
import { IContent } from '../App';
import './InverseList.css';
import {
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { ListItem } from './ListItem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

export interface InverseListProps {
  deleteListItem: (index: number) => void;
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  list: IContent[];
}

export const InverseList: FC<InverseListProps> = (props: InverseListProps) => {

  const [showButton, setShowButton] = useState(false)
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const scrollBottom = () => {
    virtuosoRef?.current?.scrollToIndex(props.list.length);
  }

  const HeightPreservingItem = useCallback(({ children, ...props }) => {
    const [size, setSize] = useState(0);
    const knownSize = props['data-known-size'];
    useEffect(() => {
      setSize((prevSize) => {
        return knownSize == 0 ? prevSize : knownSize;
      });
    }, [knownSize]);
    return (
      <div
        {...props}
        className="height-preserving-container"
        style={{
          '--child-height': `${size}px`,
        }}
      >
        {children}
      </div>
    );
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <p>{props.list.length} Items</p>
      <div>
        {props.list.length && showButton ? (
          <a onClick={scrollBottom}>
            Back to bottom
          </a>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
      <div className="flex-1 border">
        <Virtuoso
          ref={virtuosoRef}
          scrollerRef={(scrollerRef) => {
            if (scrollerRef instanceof HTMLElement) {
              props.provided.innerRef(scrollerRef);
            }
          }}
          initialTopMostItemIndex={props.list.length}
          followOutput={true}
          atBottomStateChange={(atBottom: boolean) => {setShowButton(!atBottom)}}
          components={{ Item: HeightPreservingItem }}
          data={props.list}
          itemContent={(index, item) => {
            return (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided, snapshot) => (
                  <ListItem
                    provided={provided}
                    isDragging={snapshot.isDragging}
                    deleteListItem={props.deleteListItem}
                    index={index}
                    item={item}
                  />
                )}
              </Draggable>
            );
          }}
        />
      </div>
    </div>
  );
};
