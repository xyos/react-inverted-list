import { LoremIpsum } from 'lorem-ipsum';
import React, { useState } from 'react';
import { InverseList } from './components/InverseList';
import './App.css';

export interface IContent {
  content: string;
}

const App: React.FC = () => {
  const loremGenerator = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 2,
    },
    wordsPerSentence: {
      max: 16,
      min: 2,
    },
  });

  const [numberOfItems, setNumberOfItems] = useState<string>('');
  const [list, setList] = useState<IContent[]>([]);

  const deleteListItem = (index: number) => {};

  const handleNumberOfItemsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumberOfItems(e.target.value);
  };

  const generateItems = () => {
    const items: IContent[] = Array.from(Array(Number(numberOfItems)), () => ({
      content: loremGenerator.generateParagraphs(1),
    }));
    console.log(items);
    setList(items);
  };

  return (
    <main>
      <div className="d-flex">
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={numberOfItems}
          onChange={handleNumberOfItemsChange}
          id="itemNumber"
          type="number"
          placeholder="# of items"
        ></input>
        <button
          onClick={generateItems}
          className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-red-700"
        >
          Generate
        </button>
        <button className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-red-500 hover:bg-red-700">
          Reset
        </button>
      </div>
      <InverseList list={list} deleteListItem={deleteListItem}></InverseList>
    </main>
  );
};

export default App;
