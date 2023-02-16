import { useState, useEffect } from 'react';
import './App.css';

function App(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [datetime, setDateTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  type Transaction = {
    price: number;
    name: string;
    description: string;
    datetime: string;
  };

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const url = `${process.env.REACT_APP_API_URL}/transactions`
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransactions();
    
  }, []);

 
  function addNewTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const url = `${process.env.REACT_APP_API_URL}/transaction`
    console.log(url);
    const price = name.split(' ')[0]

    if (url) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(
          {
            price,
            name: name.substring(price.length + 1),
            description,
            datetime
          })
      }).then(response => {
        response.json().then(json => {
          setName('')
          setDateTime('')
          setDescription('')
          setTransactions([...transactions, json]);

        })
      })
    }
   
  }
  let balance = 0
  for (let transaction of transactions) {
    balance += transaction.price

  }
  

  return (
    <main>
      <h1>${balance}</h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>

          <input type="text" placeholder='' value={name} onChange={e => setName(e.target.value)} />
          <input type="datetime-local" value={datetime} onChange={e => setDateTime(e.target.value)} />
        </div>
        <div className='description'>

          <input type="text" placeholder='description' value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.map((transaction, index) => (
          <div className="transaction" key={index}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price > 0 ? 'green' : 'red'}`}>
                {transaction.price}
              </div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}

export default App;