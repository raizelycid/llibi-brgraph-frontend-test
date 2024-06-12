import React, {useState, useEffect} from 'react';
import Logo from '../../images/logo.svg';
import { CSSTransition } from 'react-transition-group';

function SearchClient({setSearchClient, setIsVisible, setSearch}) {

    const [inProp, setInProp] = useState(true);
    const handleClick = () => {
        setInProp(false);
        setTimeout(() => setIsVisible(false), 500); // same duration as your transition
        setSearch(true)
      };
  return (
    <CSSTransition in={inProp} timeout={500} classNames="my-node">
    <div className="my-node flex flex-col justify-center items-center py-8">
      <img src={Logo} alt="Logo" className="w-72 h-36"  />
        <div className="flex flex-col items-center justify-center">
            <input
            type="text"
            placeholder="Input Client Name"
            className="w-96 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
                setSearchClient(e.target.value);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter'){
                    handleClick();
                }
            }}
            />
            <button className="h-10 w-32 flex justify-center px-6 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600" onClick={handleClick}>
            <span className='text-center mt-auto mb-auto'>Search</span>
            </button>
        </div>
    </div>
    </CSSTransition>
  )
}

export default SearchClient
