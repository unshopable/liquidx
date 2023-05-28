import grammar from '..';

it('should parse plain text', () => {
  expectMatchSucceeded('Hello, World!').toBe(true);
  expectMatchSucceeded('<a').toBe(true);
  expectMatchSucceeded('<1').toBe(true);
  expectMatchSucceeded('2 < 3').toBe(true);
});

it('should parse valid HTML tags', () => {
  expectMatchSucceeded('<button></button>').toBe(true);
  expectMatchSucceeded('<button type="submit"></button>').toBe(true);
  expectMatchSucceeded('<button>').toBe(true);
  expectMatchSucceeded('</button>').toBe(true);
  expectMatchSucceeded('<a>').toBe(true);
  expectMatchSucceeded('<img />').toBe(true);
});

it('should parse invalid HTML tags', () => {
  expectMatchSucceeded('< button>').toBe(true);
  expectMatchSucceeded('<button').toBe(true);
  expectMatchSucceeded('<button attr').toBe(true);
  expectMatchSucceeded('button>').toBe(true);
  expectMatchSucceeded('button attr>').toBe(true);
  expectMatchSucceeded('</button').toBe(true);
  expectMatchSucceeded('img />').toBe(true);
  expectMatchSucceeded('img attr />').toBe(true);
});

it('should parse valid LiquidX tags', () => {
  expectMatchSucceeded('<Button></Button>').toBe(true);
  expectMatchSucceeded('<Button type="submit"></Button>').toBe(true);
  expectMatchSucceeded('<Button>').toBe(true);
  expectMatchSucceeded('</Button>').toBe(true);
  expectMatchSucceeded('<A>').toBe(true);
  expectMatchSucceeded('<Image />').toBe(true);
});

it('should not parse invalid LiquidX tags', () => {
  expectMatchSucceeded('< Button>').toBe(false);
  expectMatchSucceeded('<Button').toBe(false);
  expectMatchSucceeded('<Button attr').toBe(false);
  expectMatchSucceeded('Button>').toBe(false);
  expectMatchSucceeded('Button attr>').toBe(false);
  expectMatchSucceeded('</Button').toBe(false);
  expectMatchSucceeded('Image />').toBe(false);
  expectMatchSucceeded('Image attr />').toBe(false);
});

function expectMatchSucceeded(source: string) {
  const match = grammar.match(source);

  return expect(match.succeeded());
}
