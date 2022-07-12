import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/global.css'
const documentRootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(documentRootElement);
root.render(<App />);
