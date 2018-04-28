import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// As of release 3.x, Enzyme now has an "adapter" system. The adapters tell Enzyme how to work with
// your version of React or whatever React-like library you are using. This means you will have to
// install Enzyme alongside of an adapter as well. After install of the adapter you will want to
// configure Enzyme with the adapter before using Enzyme in your tests. This script can be ran
// before any other tests to do just that.
Enzyme.configure({ adapter: new Adapter() })
