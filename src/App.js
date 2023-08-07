import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';

const warehousesAPI = 'https://mocki.io/v1/8b144989-82e8-4af4-8fcb-cd5b62afc938'; // Replace with the actual API URL

const WarehouseListingPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [spaceFilter, setSpaceFilter] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(warehousesAPI);
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCityFilter = (event) => {
    setCityFilter(event.target.value);
  };

  const handleClusterFilter = (event) => {
    setClusterFilter(event.target.value);
  };

  const handleSpaceFilter = (event) => {
    setSpaceFilter(event.target.value);
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    return (
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (cityFilter === '' || warehouse.city === cityFilter) &&
      (clusterFilter === '' || warehouse.cluster === clusterFilter) &&
      (spaceFilter === '' || warehouse.space_available <= parseInt(spaceFilter))
    );
  });

  return (
    <div>
      <h1>Warehouse Listing</h1>
      <input type="text" placeholder="Search by name" onChange={handleSearch} />
      <select onChange={handleCityFilter}>
        <option value="">Select City</option>
        {/* Create options for cities based on the data */}
      </select>
      <select onChange={handleClusterFilter}>
        <option value="">Select Cluster</option>
        {/* Create options for clusters based on the data */}
      </select>
      <input type="number" placeholder="Space Available Limit" onChange={handleSpaceFilter} />
      <ul>
        {filteredWarehouses.map((warehouse) => (
          <li key={warehouse.id}>
            <Link to={`/warehouse/${warehouse.id}`}>{warehouse.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const WarehouseDetailsPage = ({ match }) => {
  const warehouseId = match.params.id;
  const [warehouse, setWarehouse] = useState(null);

  useEffect(() => {
    fetchWarehouseDetails();
  }, []);

  const fetchWarehouseDetails = async () => {
    try {
      const response = await axios.get(`${warehousesAPI}/${warehouseId}`);
      setWarehouse(response.data);
    } catch (error) {
      console.error('Error fetching warehouse details:', error);
    }
  };

  const handleEdit = () => {
    console.log("hello")
  };

  const handleAddCustomField = () => {
    // Implement add custom field functionality here
    console.log("hello")
  };

  if (!warehouse) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Warehouse Details</h1>
      <p>Name: {warehouse.name}</p>
      <p>Cluster: {warehouse.cluster}</p>
      <p>City: {warehouse.city}</p>
      <p>Space Available: {warehouse.space_available}</p>
      <p>Warehouse Live Status: {warehouse.warehouse_live_status}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleAddCustomField}>Add Custom Field</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={WarehouseListingPage} />
        <Route path="/warehouse/:id" component={WarehouseDetailsPage} />
      </Switch>
    </Router>
  );
};

export default App;
