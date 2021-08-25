import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { IContent } from '../App';
import './InverseList.css';

export interface InverseListProps {
  deleteListItem: (index: number) => void;
  list: IContent[];
}

export const InverseList: FC<InverseListProps> = (props: InverseListProps) => {

  const [showScrollButton, setShowScrollButton] = useState(false);

  const ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref?.current?.addEventListener("scroll", () => {
      console.log(ref)
      if (ref?.current && ref.current?.scrollTop < 0) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    });
  }, []);


  const scrollToBottom = () => {
    ref?.current?.scrollTo({ top: 0 });
  };

  const renderItem = (item: IContent, index: number) => {
    const newIndex = props.list.length - index - 1;
    return (
      <div
        key={item.id}
        className="border mb-2 rounded p-4 bg-gradient-to-r from-indigo-50 to-indigo-100"
      >
        <div className="flex justify-between mb-2">
          <span className="font-bold">
            item-{newIndex} id:{item.id}
          </span>
          <button
            className="flex justify-center content-center px-2 font-semibold rounded-lg shadow-md text-white bg-pink-500 hover:bg-pink-700"
            onClick={() => props.deleteListItem(newIndex)}
          >
            &#10005;
          </button>
        </div>
        <div className="prose">
          <p className="text-justify">{item.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
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
      <div
        ref={ref}
        className="relative flex-1 overflow-y-scroll flex flex-col-reverse border px-4 py-2 scroll-bottom"
      >
        {props.list.slice().reverse().map(renderItem)}
      </div>
    </div>
  );
};
