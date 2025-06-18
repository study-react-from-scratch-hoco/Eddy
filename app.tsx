// ---- Library --- //
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      return tag(props, ...children);
    }
    const el = {
      tag,
      props,
      children,
    };
    return el;
  },
};


const myAppState = [];
let myAppStateCursor = 0;
const useState = (initialState) => {
  // get the cursor for this useState
  const stateCursor = myAppStateCursor;
  // Check before setting AppState to initialState (reRender)
  myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  console.log(
    `useState is initialized at cursor ${stateCursor} with value:`,
    myAppState
  );
  const setState = (newState) => {
    console.log(
      `setState is called at cursor ${stateCursor} with newState value:`,
      newState
    );
    myAppState[stateCursor] = newState;
    // Render the UI fresh given state has changed.
    reRender();
  };
  // prepare the cursor for the next state.
  myAppStateCursor++;
  console.log(`stateDump`, myAppState);
  return [myAppState[stateCursor], setState];
};


const reRender = () => {
  console.log('reRender-ing :)');
  const rootNode = document.getElementById('myapp');
  // reset/clean whatever is rendered already
  rootNode.innerHTML = '';
  // Reset the global state cursor
  myAppStateCursor = 0;
  // then render Fresh
  render(<App />, rootNode);
};

// ---- Application ---
const App = () => {
  const [name, setName] = useState('Arindam');
  const [count, setCount] = useState(0);
  return (
    <div draggable>
      <h2>Hello {name}!</h2>
      <p>I am a pargraph</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2> Counter value: {count}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
    </div>
  );
};


// ---- Library --- //
const render = (el, container) => {
  let domEl;

  // 0. el의 타입이 문자열인지 확인
  //    문자열이면 텍스트 노드로 처리해야 함
  if (typeof el === 'string') {
    // 실제 텍스트 노드 생성
    domEl = document.createTextNode(el);
    container.appendChild(domEl);
    // 텍스트 노드는 자식이 없으므로 여기서 종료
    return;
  }

  // 1. el에 해당하는 실제 DOM 요소 생성
  domEl = document.createElement(el.tag);

  // 2. props가 있다면 DOM 요소에 속성 설정
  let elProps = el.props ? Object.keys(el.props) : null;
  if (elProps && elProps.length > 0) {
    elProps.forEach((prop) => (domEl[prop] = el.props[prop]));
  }

  // 3. 자식 노드들을 처리 (재귀적으로 렌더링)
  if (el.children && el.children.length > 0) {
    // 자식을 렌더링할 때 현재 생성한 domEl이 그 부모가 됨
    el.children.forEach((node) => render(node, domEl));
  }

  // 4. 완성된 DOM 요소를 부모 container에 추가
  container.appendChild(domEl);
};

// ---- Application --- //
render(<App />, document.getElementById('myapp'));