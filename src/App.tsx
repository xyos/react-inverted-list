import { LoremIpsum } from 'lorem-ipsum';
import { FC, useEffect, useState } from 'react';
import { InverseList } from './components/InverseList';
import './App.css';
import uniqid from 'uniqid';

import {
  Droppable,
  DragDropContext,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { ListItem } from './components/ListItem';

export interface IContent {
  content: string;
  id: string;
}

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const App: FC = () => {

  const loremGenerator = new LoremIpsum({
    sentencesPerParagraph: {
      max: 6,
      min: 2,
    },
    wordsPerSentence: {
      max: 6,
      min: 2,
    },
  });

  function onDragEnd(result: DropResult): void {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }
    const newQuotes: IContent[] = reorder(
      list,
      result.source.index,
      result.destination.index
    );
    setList(newQuotes);
  }

  const getListFromLocalStorage = (): IContent[] => {
    try {
      const listString = localStorage.getItem('list');
      const listFromStorage = JSON.parse(
        listString === null ? '[]' : listString
      );
      return Array.isArray(listFromStorage) ? listFromStorage : [];
    } catch (e) {
      return [];
    }
  };

  const [numberOfItems, setNumberOfItems] = useState<string>('');
  const [list, setList] = useState<IContent[]>(getListFromLocalStorage());
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('list', JSON.stringify(list));
    } catch (e) {
      alert('Could not set list to localStorage (list is too big)');
    }
  }, [list]);

  const deleteListItem = (index: number) => {
    setList(list.filter((_, idx) => idx !== index));
  };

  const handleNumberOfItemsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      let { value, min, max } = e.target;
      const numberOfItems = Math.max(Number(min), Math.min(Number(max), Number(value)));
      setButtonDisabled(numberOfItems === 0);
      setNumberOfItems(numberOfItems.toString());
    } catch (e) {
      setButtonDisabled(true);
    }
  };

  const generateItems = () => {
    const newItems: IContent[] = Array.from(
      Array(parseInt(numberOfItems)),
      () => ({
        content: loremGenerator.generateParagraphs(1),
        id: uniqid(),
      })
    );
    setList([...list, ...newItems]);
  };

  const reset = () => {
    setNumberOfItems('');
    setList([]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(
          provided: DraggableProvided,
          snapshot: DraggableStateSnapshot,
          rubric: DraggableRubric
        ) => (
            <ListItem
              index={rubric.source.index}
              item={list[rubric.source.index]}
              isDragging={snapshot.isDragging}
              deleteListItem={()=>{}}
              provided={provided}
            ></ListItem>
        )}
      >
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <main className="h-screen w-96 flex flex-col">
            <div className="flex mb-4">
              <input
                className="flex-1 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-pink-400 border-pink-300 focus:ring-2 focus:border-transparent"
                value={numberOfItems}
                onChange={handleNumberOfItemsChange}
                id="itemNumber"
                min="1"
                max="9999"
                type="number"
                placeholder="# of items"
              ></input>
              <button
                onClick={generateItems}
                disabled={buttonDisabled}
                className="py-2 px-3 ml-2 font-semibold rounded-lg shadow-md text-white bg-pink-500 hover:bg-pink-700 disabled:opacity-50 disabled:bg-pink-500 disabled:cursor-not-allowed"
              >
                Generate
              </button>
              <button
                onClick={reset}
                className="py-2 px-3 ml-2 font-semibold rounded-lg shadow-md text-white bg-pink-500 hover:bg-pink-700"
              >
                Reset
              </button>
            </div>
            <InverseList
              list={list}
              provided={provided}
              snapshot={snapshot}
              deleteListItem={deleteListItem}
            ></InverseList>
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
