```jsx
const colors = {
  'Support Green': '#78A300',
  'Message Green': '#37B8AF',
  'Explore Blue': '#30AABC',
  'Guide Pink': '#EB4962',
  'Connect Red': '#EB6651',
  'Chat Orange': '#F79A3E',
  'Talk Yellow': '#EFC93D',
  'Sell Gold': '#D4AE5E'
};

const ColorSampleSquare = styled.div`
  background-color: ${props => props.color};
  width: 1em;
  height: 1em;
`;

const ColorSamplePreview = styled.div`
  cursor: default;
  display: inline-block;
`;

const InlineItem = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
`;

const StyledNoItemsMessage = styled.div`
  margin: 16px;
  text-align: center;
`;

const Color = ({ name, color, includeSample }) =>
  includeSample ? (
    <div style={{ display: 'inline-block' }}>
      <InlineItem>
        <ColorSampleSquare color={color} />
      </InlineItem>
      <InlineItem>{name}</InlineItem>
      <InlineItem>({color})</InlineItem>
    </div>
  ) : (
    <ColorSamplePreview>
      {name} (<span style={{ color }}>{color}</span>)
    </ColorSamplePreview>
  );

initialState = {
  inputValue: '',
  selectedItem: 'Support Green'
};

const renderItems = () => {
  const items = Object.keys(colors).filter(color => {
    return !state.inputValue || color.toLowerCase().includes(state.inputValue.toLowerCase());
  });

  if (items.length === 0) {
    return <StyledNoItemsMessage>No items found</StyledNoItemsMessage>;
  }

  return items.map(option => (
    <Autocomplete.Item key={option} value={option}>
      <Color color={colors[option]} name={option} includeSample />
    </Autocomplete.Item>
  ));
};

<Autocomplete
  inputValue={state.inputValue}
  onInputValueChange={inputValue => setState({ inputValue })}
  selectedItem={state.selectedItem}
  onSelect={selectedItem => setState({ selectedItem })}
>
  <Autocomplete.Label>Product Color Example</Autocomplete.Label>
  <Autocomplete.Preview>
    <Color color={colors[state.selectedItem]} name={state.selectedItem} />
  </Autocomplete.Preview>
  <Autocomplete.Menu>{renderItems()}</Autocomplete.Menu>
</Autocomplete>;
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
