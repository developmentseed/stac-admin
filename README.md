
# STAC-Admin :satellite: :page_facing_up: 

## Introduction
The STAC-Admin is a tool designed for managing the values of a STAC (SpatioTemporal Asset Catalog) collection and its items. This interface provides a user-friendly way to modify and update the properties of collections and items within a STAC catalog.

## Getting Started

### Prerequisites
- Node
- Yarn

### Installation
1. Install Yarn packages:
   ```
   yarn install
   ```

### Configuration
Before running the application, update the `.env` file with the required environment variable:
- `REACT_APP_STAC_API`: Set this to the API endpoint of your STAC server.

### Running the Application
To start the application in development mode:
```
yarn start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits, and lint errors will appear in the console.

### Running Tests
Launch the test runner in interactive watch mode:
```
yarn test
```
More details can be found in the [Create React App testing documentation](https://facebook.github.io/create-react-app/docs/running-tests).

### Building for Production
Build the app for production:
```
yarn build
```
This bundles the app in production mode, optimizing the build for performance. The build is minified, and filenames include hashes.

## Contributing
Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License
This project is licensed under the [Your License] - see the LICENSE.md file for details.

## Learn More
- For more information on React, visit the [React documentation](https://reactjs.org/).
- To learn more about Create React App, check out the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
