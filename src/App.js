// Import necessary dependencies and components
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// Import styling for the App component
import './App.css';

// Import custom components
import List from './Components/List/List';
import Navbar from './Components/Navbar/Navbar';

// Define the main App component
function App() {
  // Define constant lists for status, user, and priority
  const statusList = ['In progress', 'Backlog', 'Todo', 'Done', 'Cancelled'];
  const userList = ['Anoop sharma', 'Yogesh', 'Suresh', 'Shankar Kumar', 'Ramesh'];
  const priorityList = [
    { name: 'No priority', priority: 0 },
    { name: 'Low', priority: 1 },
    { name: 'Medium', priority: 2 },
    { name: 'High', priority: 3 },
    { name: 'Urgent', priority: 4 },
  ];

  // State variables for dark mode and sorting/grouping values
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [groupValue, setgroupValue] = useState(getStateFromLocalStorage() || 'status');
  const [orderValue, setorderValue] = useState('title');
  const [ticketDetails, setticketDetails] = useState([]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  // Callback function to order data based on selected value
  const orderDataByValue = useCallback(async (cardsArray) => {
    if (orderValue === 'priority') {
      cardsArray.sort((a, b) => b.priority - a.priority);
    } else if (orderValue === 'title') {
      cardsArray.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (titleA < titleB) {
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    await setticketDetails(cardsArray);
  }, [orderValue, setticketDetails]);

  // Function to save the current groupValue to local storage
  function saveStateToLocalStorage(state) {
    localStorage.setItem('groupValue', JSON.stringify(state));
  }

  // Function to get the groupValue from local storage
  function getStateFromLocalStorage() {
    const storedState = localStorage.getItem('groupValue');
    if (storedState) {
      return JSON.parse(storedState);
    }
    return null;
  }

  // useEffect hook to fetch data from an API and refactor it
  useEffect(() => {
    saveStateToLocalStorage(groupValue);

    async function fetchData() {
      const response = await axios.get('https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers');
      await refactorData(response);
    }

    async function refactorData(response) {
      let ticketArray = [];
      if (response.status === 200) {
        for (let i = 0; i < response.data.tickets.length; i++) {
          for (let j = 0; j < response.data.users.length; j++) {
            if (response.data.tickets[i].userId === response.data.users[j].id) {
              let ticketJson = { ...response.data.tickets[i], userObj: response.data.users[j] };
              ticketArray.push(ticketJson);
            }
          }
        }
      }
      await setticketDetails(ticketArray);
      orderDataByValue(ticketArray);
    }

    fetchData();
  }, [orderDataByValue, groupValue]);

  // Event handler for changing the groupValue
  function handleGroupValue(value) {
    setgroupValue(value);
    console.log(value);
  }

  // Event handler for changing the orderValue
  function handleOrderValue(value) {
    setorderValue(value);
    console.log(value);
  }

  // JSX structure of the component
  return (
    <>
      {/* Navbar component with props */}
      <Navbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        groupValue={groupValue}
        orderValue={orderValue}
        handleGroupValue={handleGroupValue}
        handleOrderValue={handleOrderValue}
        toggleDarkMode={toggleDarkMode}
      />
      {/* Board details section with dynamic class based on dark mode */}
      <section className={`board-details ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="board-details-list">
          {/* Dynamic rendering of List components based on groupValue */}
          {
            {
              'status': <>
                {statusList.map((listItem) => {
                  return (
                    <List
                      groupValue="status"
                      orderValue={orderValue}
                      listTitle={listItem}
                      listIcon=""
                      statusList={statusList}
                      ticketDetails={ticketDetails}
                      isDarkMode={isDarkMode}
                    />
                  );
                })}
              </>,
              'user': <>
                {userList.map((listItem) => {
                  return (
                    <List
                      groupValue="user"
                      orderValue={orderValue}
                      listTitle={listItem}
                      listIcon=""
                      userList={userList}
                      ticketDetails={ticketDetails}
                      isDarkMode={isDarkMode}
                    />
                  );
                })}
              </>,
              'priority': <>
                {priorityList.map((listItem) => {
                  return (
                    <List
                      groupValue="priority"
                      orderValue={orderValue}
                      listTitle={listItem.priority}
                      listIcon=""
                      priorityList={priorityList}
                      ticketDetails={ticketDetails}
                      isDarkMode={isDarkMode}
                    />
                  );
                })}
              </>
            }[groupValue]
          }
        </div>
      </section>
    </>
  );
}

// Export the App component
export default App;
