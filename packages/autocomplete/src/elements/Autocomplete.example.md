```jsx
<Autocomplete>
  <Autocomplete.Menu>
    <Autocomplete.Item value="item-1">Item 1</Autocomplete.Item>
    <Autocomplete.Item value="item-2">Item 2</Autocomplete.Item>
    <Autocomplete.Item value="item-3">Item 3</Autocomplete.Item>
    <Autocomplete.Item value="item-4">Item 4</Autocomplete.Item>
  </Autocomplete.Menu>
</Autocomplete>
```

```jsx
const phonetics = [
  'Alfa',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliett',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'X-ray',
  'Yankee',
  'Zulu'
];

const options = [];

for (let x = 0; x < phonetics.length; x++) {
  options.push({
    value: `value-${phonetics[x]}`,
    label: phonetics[x]
  });
}

initialState = {
  inputValue: '',
  selectedItem: options[0]
};

const renderItems = () => {
  const items = options.filter(option => {
    return !state.inputValue || option.label.toLowerCase().includes(state.inputValue.toLowerCase());
  });

  if (items.length === 0) {
    return <div>No items found</div>;
  }

  return items.map(option => (
    <Autocomplete.Item key={option.value} value={option.value}>
      {option.label}
    </Autocomplete.Item>
  ));
};

<Autocomplete
  inputValue={state.inputValue}
  onInputValueChange={inputValue => setState({ inputValue })}
  onChange={selectedItem => setState({ selectedItem })}
>
  <p>{state.inputValue}</p>
  <Autocomplete.Menu>{renderItems()}</Autocomplete.Menu>
</Autocomplete>;
```
