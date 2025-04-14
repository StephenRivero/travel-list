import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: true },
];

export default function App() {
  const [item, setItem] = useState([]);
  console.log({item})

  const handleAddItem = (item) => {
    setItem(items => [...items, item])
  }

  const handleDeleteItem = (id) => {
    // console.log({id})
    setItem(items => items.filter(item => item.id !== id))
  }

  const handleToggleItem = (id) => {
    console.log({})
    setItem(items => 
      items.map(item => 
        item.id === id ? { ...item, packed: !item.packed } 
        : item 
      )
    )
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList item={item} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem}/>
      <Stats item={item} />
    </div>
  )
}

function Logo() {
  return <h1>🏝️ Far Away 🧳</h1>
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log({newItem})

    onAddItem(newItem)

    setDescription("");
    setQuantity(1);
  }

  return <form className="add-form"  onSubmit={handleSubmit}>
    <h3>What do you need for your trip?</h3>
    <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    <button>Add</button>
  </form>
}

function PackingList({ item, onDeleteItem, onToggleItem }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = item;

  if (sortBy === "description") sortedItems = item.slice().sort((a,b) => a.description.localeCompare(b.description));

  if (sortBy === "packed") sortedItems = item.slice().sort((a,b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul className="">
        {sortedItems.map(item => (
          <Item key={item.id} item={item} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value='input'>Sort by input order</option>
          <option value='description'>Sort by descriptioin</option>
          <option value='packed'>Sort by packed status</option>
        </select>
      </div>
    </div>
  )
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)}/>
      <span style={item.packed ? {textDecoration: 'line-through'} : {}}>
        {item.quantity}
        {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  )
}

function Stats({ item }) {
  const numItems = item.length
  const packedItems = item.filter(items => items.packed).length
  const packedPercentage = Math.round((packedItems / numItems) * 100)

  return (
    <footer className="stats">
      <em>
        {item.length === 0 && "Start Adding some items to your packing list 🚀"}
        {(item.length > 0 && packedPercentage !== 100) &&
          `You have ${numItems} items on your list, and you already packed ${packedItems} (${packedPercentage}%)`
        }
        {packedPercentage === 100 && `You got everything! Ready to go ✈️` }
       
      </em>
    </footer>
  )
}

