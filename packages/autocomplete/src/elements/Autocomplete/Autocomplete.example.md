```jsx
const options = ['Item 1', 'Item 2', 'Item 3'];

const StyledNoItemsMessage = styled.div`
  margin: 16px;
  text-align: center;
`;

initialState = {
  inputValue: '',
  selectedItem: options[0]
};

renderItems = () => {
  const items = options.filter(option => {
    return !state.inputValue || option.toLowerCase().includes(state.inputValue.toLowerCase());
  });

  if (items.length === 0) {
    return <StyledNoItemsMessage>No items found</StyledNoItemsMessage>;
  }

  return items.map(item => (
    <Autocomplete.Item key={item} value={item}>
      {item}
    </Autocomplete.Item>
  ));
};

<Autocomplete
  inputValue={state.inputValue}
  selectedItem={state.selectedItem}
  onSelect={selectedItem => setState({ selectedItem })}
  onInputValueChange={inputValue => setState({ inputValue })}
>
  <Autocomplete.Label>Simple Example</Autocomplete.Label>
  <Autocomplete.Preview>{state.selectedItem}</Autocomplete.Preview>
  <Autocomplete.Menu>{renderItems()}</Autocomplete.Menu>
</Autocomplete>;
```

```jsx
const colors = [
  { label: 'Support Green', value: '#78A300' },
  { label: 'Message Green', value: '#37B8AF' },
  { label: 'Explore Blue', value: '#30AABC' },
  { label: 'Guide Pink', value: '#EB4962' },
  { label: 'Connect Red', value: '#EB6651' },
  { label: 'Chat Orange', value: '#F79A3E' },
  { label: 'Talk Yellow', value: '#EFC93D' },
  { label: 'Sell Gold', value: '#D4AE5E' }
];

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
  selectedItem: colors[0]
};

const renderItems = () => {
  const items = colors.filter(color => {
    return !state.inputValue || color.label.toLowerCase().includes(state.inputValue.toLowerCase());
  });

  if (items.length === 0) {
    return <StyledNoItemsMessage>No items found</StyledNoItemsMessage>;
  }

  return items.map(item => (
    <Autocomplete.Item key={item.value} value={item}>
      <Color color={item.value} name={item.label} includeSample />
    </Autocomplete.Item>
  ));
};

<Autocomplete
  inputValue={state.inputValue}
  onInputValueChange={inputValue => setState({ inputValue })}
  selectedItem={state.selectedItem}
  onSelect={selectedItem => setState({ selectedItem })}
  itemToString={item => (item ? item.label : '')}
>
  <Autocomplete.Label>Product Color Example</Autocomplete.Label>
  <Autocomplete.Preview>
    <Color color={state.selectedItem.value} name={state.selectedItem.label} />
  </Autocomplete.Preview>
  <Autocomplete.Menu>{renderItems()}</Autocomplete.Menu>
</Autocomplete>;
```

```jsx
const { HeaderItem, Separator } = require('@zendeskgarden/react-menus/src');

const NODE_TYPE = {
  HEADER: 'root',
  SEPARATOR: 'separator',
  ITEM: 'item',
  PREVIOUS: 'prev',
  NEXT: 'next'
};

const treeStructure = {
  root: {
    nodes: [
      {
        label: 'Root Node',
        value: 'root',
        type: NODE_TYPE.HEADER
      },
      {
        type: NODE_TYPE.SEPARATOR
      },
      {
        label: 'Item 1',
        value: 'item-1',
        type: NODE_TYPE.ITEM
      },
      {
        label: 'Parent Item',
        value: 'parent-item',
        type: NODE_TYPE.NEXT
      },
      {
        label: 'Item 3',
        value: 'item-3',
        type: NODE_TYPE.ITEM
      }
    ]
  },
  'parent-item': {
    nodes: [
      {
        label: 'Root Node',
        value: 'root',
        type: NODE_TYPE.PREVIOUS
      },
      {
        type: NODE_TYPE.SEPARATOR
      },
      {
        label: 'Item 1',
        value: 'root',
        type: NODE_TYPE.ITEM
      }
    ]
  }
};

initialState = {
  inputValue: '',
  isOpen: false,
  selectedItem: 'root'
};

renderItems = () => {
  const matchingTree = treeStructure[state.selectedItem] || treeStructure['root'];

  return matchingTree.nodes.map((node, idx) => {
    if (node.type === NODE_TYPE.HEADER) {
      return <HeaderItem key={node.label}>{node.label}</HeaderItem>;
    }

    if (node.type === NODE_TYPE.SEPARATOR) {
      return <Separator key={`separator-${idx}`} />;
    }

    if (node.type === NODE_TYPE.ITEM) {
      return (
        <Autocomplete.Item key={node.label} value={node.value}>
          {node.label}
        </Autocomplete.Item>
      );
    }

    if (node.type === NODE_TYPE.PREVIOUS) {
      return (
        <Autocomplete.PreviousItem key={node.label} value={node.value}>
          {node.label}
        </Autocomplete.PreviousItem>
      );
    }

    if (node.type === NODE_TYPE.NEXT) {
      return (
        <Autocomplete.NextItem key={node.label} value={node.value}>
          {node.label}
        </Autocomplete.NextItem>
      );
    }

    throw new Error('Invalid node type provided');
  });
};

<Autocomplete
  inputValue={state.inputValue}
  isOpen={state.isOpen}
  onOpen={isOpen => setState({ isOpen })}
  onInputValueChange={inputValue => setState({ inputValue })}
  onSelect={selectedItem => {
    setState({ selectedItem });
  }}
>
  <Autocomplete.Label>Tree Example</Autocomplete.Label>
  <Autocomplete.Preview>{state.selectedItem}</Autocomplete.Preview>
  <Autocomplete.Menu style={{ minHeight: 200 }}>{renderItems()}</Autocomplete.Menu>
</Autocomplete>;
```
