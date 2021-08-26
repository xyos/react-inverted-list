import { FC } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { IContent } from '../App';

export interface ListItemProps {
  index: number;
  item: IContent;
  deleteListItem: (index: number) => void;
  provided: DraggableProvided;
  isDragging: boolean;
}

export const ListItem: FC<ListItemProps> = (props: ListItemProps) => {
  return (
    <div
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
      style={props.provided.draggableProps.style}
      ref={props.provided.innerRef}
      className="p-2"
    >
    <div className={`rounded border p-4 bg-gradient-to-r ${props.isDragging ? 'from-indigo-50 to-indigo-100': 'from-red-50 to-red-100'}`}>
        <div className="flex justify-between pb-2">
          <span className="font-bold">item-{props.index + 1}</span>
          <span>id:{props.item.id}</span>
          <button
            className="flex justify-center content-center px-2 font-semibold rounded-lg shadow-md text-white bg-pink-200 hover:bg-pink-700"
            onClick={() => props.deleteListItem(props.index)}
          >
            &#10005;
          </button>
        </div>
        <div className="prose">
          <p className="text-justify">{props.item.content}</p>
        </div>
      </div>
    </div>
  );
};
