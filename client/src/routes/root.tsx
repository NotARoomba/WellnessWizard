import { Link } from 'react-router-dom';

export default function Root() {
	return (
		<>
			Hello World
			<br/>
			<Link to='/app'>continue to App</Link>
		</>
	);
}